import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { MenuItem } from "@/types";
import { CATEGORY_ORDER } from "@/config/constants";
import { MENU_DATA } from "./menuData";

/**
 * Fetch all available menu items.
 * Falls back to local data when Firebase is not configured.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isFirebaseConfigured || !db) {
    console.info(
      "[menu] Firebase not configured — using local fallback data."
    );
    return MENU_DATA.filter((item) => item.available);
  }

  try {
    const q = query(
      collection(db, "menuItems"),
      where("available", "==", true),
      orderBy("category"),
      orderBy("name")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    })) as MenuItem[];
  } catch (error) {
    console.error("[menu] Firestore fetch failed, using fallback:", error);
    return MENU_DATA.filter((item) => item.available);
  }
}

/**
 * Derive sorted categories from a list of menu items.
 * Order follows CATEGORY_ORDER, unlisted categories go to the end.
 */
export function getCategories(items: MenuItem[]): string[] {
  const unique = [...new Set(items.map((item) => item.category))];
  return unique.sort((a, b) => {
    const aIdx = CATEGORY_ORDER.indexOf(a);
    const bIdx = CATEGORY_ORDER.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });
}
