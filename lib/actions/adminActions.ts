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

export interface CreateManualOrderInput {
  source: OrderSource;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: { name: string; qty: number; unitPrice: number }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
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

    const orderPayload = {
      source: data.source,
      items: data.items,
      totalAmount: data.totalAmount,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerAddress: data.customerAddress.trim(),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      deliveryStatus: "pending" as DeliveryStatus,
      notes: data.notes?.trim() || "",
      createdAt: serverTimestamp(),
      deliveredAt: null,
      // Legacy compatibility
      total: data.totalAmount,
      subtotal: data.totalAmount,
      deliveryFee: 0,
      customer: {
        name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        address: data.customerAddress.trim(),
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
          address: data.customerAddress.trim(),
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
      updatePayload.paymentStatus = "paid"; // Auto-mark paid on delivery if needed
    }

    await updateDoc(orderRef, updatePayload);
    return { success: true };
  } catch (err: any) {
    console.error("[updateOrderStatusAction] Error:", err);
    return { success: false, error: err.message || "Failed to update order status." };
  }
}
