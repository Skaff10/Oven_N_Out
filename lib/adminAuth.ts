import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";

/**
 * Validates whether the ADMIN_PIN is configured in .env.local properly.
 */
export function getAdminPin(): { pin: string | null; error?: string } {
  const pin = process.env.ADMIN_PIN?.trim();
  if (!pin) {
    return {
      pin: null,
      error: "ADMIN_PIN is not set in .env.local. Please set a secure ADMIN_PIN to use the admin panel.",
    };
  }
  if (["1234", "0000", "admin", "password", "change_me"].includes(pin.toLowerCase())) {
    return {
      pin: null,
      error: "ADMIN_PIN in .env.local is set to an insecure default. Please change it to a secure PIN.",
    };
  }
  return { pin };
}

/**
 * Generate HMAC token for session cookie.
 */
export function generateSessionToken(pin: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || pin + "_ovennout_secret_salt";
  return crypto.createHmac("sha256", secret).update("admin_authenticated").digest("hex");
}

/**
 * Verify input PIN against configured ADMIN_PIN.
 */
export function verifyPin(inputPin: string): { success: boolean; error?: string } {
  const { pin, error } = getAdminPin();
  if (error || !pin) {
    return { success: false, error: error || "Admin PIN configuration error" };
  }
  if (inputPin.trim() === pin) {
    return { success: true };
  }
  return { success: false, error: "Incorrect PIN" };
}

/**
 * Verify if current HTTP request has a valid admin session cookie (for Server Actions & Server Components).
 */
export async function isAuthorizedAdmin(): Promise<boolean> {
  const { pin } = getAdminPin();
  if (!pin) return false;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  const expectedToken = generateSessionToken(pin);
  return sessionToken === expectedToken;
}
