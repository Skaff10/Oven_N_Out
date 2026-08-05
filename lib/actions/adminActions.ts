"use server";

import { cookies } from "next/headers";
import { verifyPin, generateSessionToken, ADMIN_COOKIE_NAME, isAuthorizedAdmin } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  writeBatch,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { DeliveryStatus, ExpenseCategory, OrderSource, PaymentMethod, PaymentStatus } from "@/types";

import { getDoc } from "firebase/firestore";

export interface CreateManualOrderInput {
  source: OrderSource;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea?: string;
  deliveryFee?: number;
  items: { name: string; qty: number; unitPrice: number }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

export interface AddExpenseInput {
  category: ExpenseCategory;
  amount: number;
  description: string;
  dateStr: string; // YYYY-MM-DD
}

/**
 * Log in admin via PIN, setting an HTTP-only session cookie upon success.
 */
export async function loginAdminAction(pin: string): Promise<{ success: boolean; error?: string }> {
  const result = verifyPin(pin);
  if (!result.success) {
    return { success: false, error: result.error || "Invalid PIN" };
  }

  const token = generateSessionToken(pin.trim());
  const cookieStore = await cookies();
  
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60, // 30 minutes
  });

  return { success: true };
}

/**
 * Log out admin by deleting the session cookie.
 */
export async function logoutAdminAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}

/**
 * Server Action: Create a manual order (atomic write to `orders` and `customers`).
 */
export async function createManualOrderAction(
  data: CreateManualOrderInput
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return { success: false, error: "Unauthorized session. Please log in again." };
  }

  if (!db) {
    return { success: false, error: "Database connection unavailable." };
  }

  try {
    const batch = writeBatch(db);
    const orderRef = doc(collection(db, "orders"));

    const sanitizedPhone = data.customerPhone.replace(/\D/g, "");
    const deliveryFee = data.deliveryFee ?? 0;
    const subtotal = Math.max(0, data.totalAmount - deliveryFee);
    const customerArea = data.customerArea?.trim() || "";
    const fullAddress = [data.customerAddress.trim(), customerArea].filter(Boolean).join(", ");

    const orderPayload = {
      source: data.source,
      items: data.items,
      totalAmount: data.totalAmount,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerAddress: fullAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || "due",
      deliveryStatus: "pending" as DeliveryStatus,
      notes: data.notes?.trim() || "",
      createdAt: serverTimestamp(),
      deliveredAt: null,
      // Legacy compatibility
      total: data.totalAmount,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      customer: {
        name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        address: data.customerAddress.trim(),
        area: customerArea,
      },
      status: "pending",
    };

    batch.set(orderRef, orderPayload);

    // Upsert customer record atomically
    if (sanitizedPhone) {
      const customerRef = doc(db, "customers", sanitizedPhone);
      batch.set(
        customerRef,
        {
          name: data.customerName.trim(),
          phone: data.customerPhone.trim(),
          address: fullAddress,
          lastOrderedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();
    return { success: true, orderId: orderRef.id };
  } catch (err: any) {
    console.error("[createManualOrderAction] Error:", err);
    return { success: false, error: err.message || "Failed to create manual order." };
  }
}

/**
 * Server Action: Add expense to Firestore `expenses` collection.
 */
export async function addExpenseAction(
  data: AddExpenseInput
): Promise<{ success: boolean; expenseId?: string; error?: string }> {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return { success: false, error: "Unauthorized session. Please log in again." };
  }

  if (!db) {
    return { success: false, error: "Database connection unavailable." };
  }

  try {
    // Parse dateStr in local timezone +06:00
    const expenseDate = new Date(`${data.dateStr}T12:00:00+06:00`);

    const docRef = await addDoc(collection(db, "expenses"), {
      category: data.category,
      amount: Number(data.amount),
      description: data.description.trim(),
      date: Timestamp.fromDate(expenseDate),
      createdAt: serverTimestamp(),
    });

    return { success: true, expenseId: docRef.id };
  } catch (err: any) {
    console.error("[addExpenseAction] Error:", err);
    return { success: false, error: err.message || "Failed to add expense." };
  }
}

/**
 * Server Action: Update delivery status of an order.
 * Note: Once a status is set to delivered or cancelled, it CANNOT be changed again.
 */
export async function updateOrderStatusAction(
  orderId: string,
  deliveryStatus: DeliveryStatus
): Promise<{ success: boolean; error?: string }> {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return { success: false, error: "Unauthorized session. Please log in again." };
  }

  if (!db) {
    return { success: false, error: "Database connection unavailable." };
  }

  try {
    const orderRef = doc(db, "orders", orderId);
    const existingSnap = await getDoc(orderRef);
    if (!existingSnap.exists()) {
      return { success: false, error: "Order not found." };
    }

    const currentData = existingSnap.data();
    const currentStatus = currentData.deliveryStatus || currentData.status;

    if (currentStatus === "delivered" || currentStatus === "cancelled" || currentStatus === "completed") {
      return { success: false, error: "Order status is finalized and cannot be changed." };
    }

    // Legacy status map
    let legacyStatus = deliveryStatus as string;
    if (deliveryStatus === "delivered") legacyStatus = "completed";

    const updatePayload: Record<string, any> = {
      deliveryStatus,
      status: legacyStatus,
      updatedAt: serverTimestamp(),
    };

    if (deliveryStatus === "delivered") {
      updatePayload.deliveredAt = serverTimestamp();
      updatePayload.paymentStatus = "paid"; // Auto-mark paid on delivery
    }

    await updateDoc(orderRef, updatePayload);
    return { success: true };
  } catch (err: any) {
    console.error("[updateOrderStatusAction] Error:", err);
    return { success: false, error: err.message || "Failed to update order status." };
  }
}
