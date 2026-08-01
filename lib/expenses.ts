import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { Expense } from "@/types";
import { getDhakaDayRange, getDhakaMonthRange } from "./dateUtils";

export function normalizeExpense(id: string, data: any): Expense {
  const date = data.date?.toDate?.() || (data.date ? new Date(data.date) : new Date());
  const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : new Date());

  return {
    id,
    category: data.category || "other",
    amount: Number(data.amount || 0),
    description: data.description || "",
    date,
    createdAt,
  };
}

/**
 * Fetch expenses for a specific day in Asia/Dhaka time.
 */
export async function getDailyExpenses(dateStr: string): Promise<Expense[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const { start, end } = getDhakaDayRange(dateStr);
    const q = query(
      collection(db, "expenses"),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<=", Timestamp.fromDate(end)),
      orderBy("date", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeExpense(d.id, d.data()));
  } catch (err) {
    console.error(`[getDailyExpenses] Error for ${dateStr}:`, err);
    return [];
  }
}

/**
 * Fetch expenses for an entire month in Asia/Dhaka time.
 */
export async function getMonthlyExpenses(monthStr: string): Promise<Expense[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const { start, end } = getDhakaMonthRange(monthStr);
    const q = query(
      collection(db, "expenses"),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<=", Timestamp.fromDate(end)),
      orderBy("date", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeExpense(d.id, d.data()));
  } catch (err) {
    console.error(`[getMonthlyExpenses] Error for ${monthStr}:`, err);
    return [];
  }
}
