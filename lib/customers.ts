import { db, isFirebaseConfigured } from "./firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { Customer } from "@/types";

/**
 * Fetch recent customers to power the tap-to-autofill quick bar in manual order creation.
 */
export async function getRecentCustomers(limitCount: number = 20): Promise<Customer[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(
      collection(db, "customers"),
      orderBy("lastOrderedAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        lastOrderedAt: data.lastOrderedAt?.toDate?.() || new Date(),
      };
    });
  } catch (err) {
    console.error("[getRecentCustomers] Error fetching customers:", err);
    return [];
  }
}
