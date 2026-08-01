import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import type { CartItem, OrderCustomer, PaymentMethod, AdminOrder, DeliveryStatus } from "@/types";
import { getDhakaDayRange, getDhakaMonthRange } from "./dateUtils";

interface CreateOrderData {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
}

function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === "object" && obj.constructor === Object) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = cleanUndefined(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
}

/**
 * Helper to normalize raw Firestore order snapshot to AdminOrder interface.
 */
export function normalizeOrder(id: string, data: any): AdminOrder {
  const customerName = data.customerName || data.customer?.name || "Guest";
  const customerPhone = data.customerPhone || data.customer?.phone || "";
  const customerAddress =
    data.customerAddress ||
    [data.customer?.address, data.customer?.area].filter(Boolean).join(", ") ||
    "";

  // Normalize items array
  const rawItems = data.items || [];
  const items = rawItems.map((item: any) => ({
    name: item.name || "Unknown Item",
    qty: item.qty ?? item.quantity ?? 1,
    quantity: item.quantity ?? item.qty ?? 1,
    unitPrice: item.unitPrice ?? item.price ?? 0,
    price: item.price ?? item.unitPrice ?? 0,
    variant: item.variant || "",
  }));

  const totalAmount = data.totalAmount ?? data.total ?? 0;
  const source = data.source || "website";
  const paymentMethod = data.paymentMethod || "cash";
  const paymentStatus = data.paymentStatus || (paymentMethod === "cash" || paymentMethod === "cod" ? "due" : "paid");

  // Normalize delivery status
  let deliveryStatus: DeliveryStatus = "pending";
  if (data.deliveryStatus) {
    deliveryStatus = data.deliveryStatus;
  } else if (data.status) {
    if (data.status === "completed" || data.status === "delivered") deliveryStatus = "delivered";
    else if (data.status === "out_for_delivery") deliveryStatus = "out_for_delivery";
    else if (data.status === "cancelled") deliveryStatus = "cancelled";
  }

  const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : new Date());
  const deliveredAt = data.deliveredAt?.toDate?.() || (data.deliveredAt ? new Date(data.deliveredAt) : null);

  const customerObj = data.customer || {
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
    area: "",
  };

  return {
    id,
    source,
    items,
    totalAmount,
    customerName,
    customerPhone,
    customerAddress,
    paymentMethod,
    paymentStatus,
    deliveryStatus,
    notes: data.notes || "",
    createdAt,
    deliveredAt,
    subtotal: data.subtotal ?? totalAmount,
    deliveryFee: data.deliveryFee ?? 0,
    total: data.total ?? totalAmount,
    customer: customerObj,
    status: data.status || deliveryStatus,
  };
}

/**
 * Write a website order to Firestore (and upsert customer).
 */
export async function createOrder(data: CreateOrderData): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const pseudoId = `LOCAL-${Date.now().toString(36).toUpperCase()}`;
    console.warn("[orders] Firebase not configured. Simulated order ID:", pseudoId);
    return pseudoId;
  }

  const sanitizedPhone = data.customer.phone.replace(/\D/g, "");
  const orderItems = data.items.map((item) => ({
    name: item.name,
    qty: item.quantity,
    unitPrice: item.price,
  }));

  const fullAddress = [data.customer.address, data.customer.area].filter(Boolean).join(", ");

  const batch = writeBatch(db);
  const orderRef = doc(collection(db, "orders"));

  const payload = cleanUndefined({
    source: "website",
    items: orderItems,
    totalAmount: data.total,
    customerName: data.customer.name.trim(),
    customerPhone: data.customer.phone.trim(),
    customerAddress: fullAddress.trim(),
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === "cod" ? "due" : "paid",
    deliveryStatus: "pending",
    notes: "",
    createdAt: serverTimestamp(),
    deliveredAt: null,
    // Legacy support fields
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    total: data.total,
    customer: data.customer,
    status: "pending",
    updatedAt: serverTimestamp(),
  });

  batch.set(orderRef, payload);

  // Upsert Customer
  if (sanitizedPhone) {
    const customerRef = doc(db, "customers", sanitizedPhone);
    batch.set(
      customerRef,
      {
        name: data.customer.name.trim(),
        phone: data.customer.phone.trim(),
        address: fullAddress.trim(),
        lastOrderedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  return orderRef.id;
}

/**
 * Fetch a single order by ID.
 */
export async function getOrder(orderId: string): Promise<AdminOrder | null> {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const snap = await getDoc(doc(db, "orders", orderId));
    if (!snap.exists()) return null;
    return normalizeOrder(snap.id, snap.data());
  } catch (error) {
    console.error(`[orders] Failed to fetch order ${orderId}:`, error);
    return null;
  }
}

/**
 * Fetch recent orders for Admin Dashboard & Orders list.
 */
export async function getAdminOrders(limitCount: number = 50): Promise<AdminOrder[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeOrder(d.id, d.data()));
  } catch (err) {
    console.error("[getAdminOrders] Error:", err);
    return [];
  }
}

/**
 * Fetch orders for a single day in Asia/Dhaka time.
 */
export async function getDailyOrders(dateStr: string): Promise<AdminOrder[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const { start, end } = getDhakaDayRange(dateStr);
    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeOrder(d.id, d.data()));
  } catch (err) {
    console.error(`[getDailyOrders] Error for ${dateStr}:`, err);
    return [];
  }
}

/**
 * Fetch orders for an entire month in Asia/Dhaka time.
 */
export async function getMonthlyOrders(monthStr: string): Promise<AdminOrder[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const { start, end } = getDhakaMonthRange(monthStr);
    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeOrder(d.id, d.data()));
  } catch (err) {
    console.error(`[getMonthlyOrders] Error for ${monthStr}:`, err);
    return [];
  }
}
