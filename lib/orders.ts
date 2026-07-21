import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { CartItem, OrderCustomer, OrderType, PaymentMethod } from "@/types";

interface CreateOrderData {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: OrderCustomer;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
}

/**
 * Write a new order to Firestore.
 * Returns the auto-generated document ID.
 */
export async function createOrder(data: CreateOrderData): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    // Offline fallback — generate a pseudo ID so the confirmation page works
    const pseudoId = `LOCAL-${Date.now().toString(36).toUpperCase()}`;
    console.warn(
      "[orders] Firebase not configured. Simulated order ID:",
      pseudoId
    );
    return pseudoId;
  }

  const docRef = await addDoc(collection(db, "orders"), {
    ...data,
    // Strip imageUrl from items before saving
    items: data.items.map(({ imageUrl: _img, ...rest }) => rest),
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Fetch a single order by its Firestore document ID.
 */
export async function getOrder(orderId: string) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  };
}
