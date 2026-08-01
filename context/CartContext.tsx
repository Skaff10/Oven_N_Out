"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";

// ── helpers ──────────────────────────────────────────────
function itemKey(menuItemId: string, variant?: string) {
  return variant ? `${menuItemId}::${variant}` : menuItemId;
}

// ── state & actions ──────────────────────────────────────
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { menuItemId: string; variant?: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { menuItemId: string; variant?: string; quantity: number };
    }
  | {
      type: "UPDATE_NOTES";
      payload: { menuItemId: string; variant?: string; notes: string };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = itemKey(
        action.payload.menuItemId,
        action.payload.variant
      );
      const idx = state.items.findIndex(
        (i) => itemKey(i.menuItemId, i.variant) === key
      );
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + action.payload.quantity,
        };
        return { ...state, items: next };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM": {
      const key = itemKey(action.payload.menuItemId, action.payload.variant);
      return {
        ...state,
        items: state.items.filter(
          (i) => itemKey(i.menuItemId, i.variant) !== key
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const key = itemKey(action.payload.menuItemId, action.payload.variant);
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => itemKey(i.menuItemId, i.variant) !== key
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.menuItemId, i.variant) === key
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "UPDATE_NOTES": {
      const key = itemKey(action.payload.menuItemId, action.payload.variant);
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.menuItemId, i.variant) === key
            ? { ...i, notes: action.payload.notes }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

// ── context ──────────────────────────────────────────────
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, variant?: string) => void;
  updateQuantity: (
    menuItemId: string,
    quantity: number,
    variant?: string
  ) => void;
  updateNotes: (menuItemId: string, notes: string, variant?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  getItemQuantity: (menuItemId: string, variant?: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ovennout-cart";
const CART_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  // Hydrate from localStorage once on mount (with expiry check)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        // Support new format { items, expiresAt } and legacy plain array
        if (stored && typeof stored === "object" && !Array.isArray(stored)) {
          if (stored.expiresAt && Date.now() > stored.expiresAt) {
            // Cart expired — clear it
            localStorage.removeItem(STORAGE_KEY);
            return;
          }
          if (Array.isArray(stored.items) && stored.items.length > 0) {
            dispatch({ type: "HYDRATE", payload: stored.items });
          }
        } else if (Array.isArray(stored) && stored.length > 0) {
          // Legacy format (plain array) — hydrate and let persist re-save with expiry
          dispatch({ type: "HYDRATE", payload: stored });
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  // Persist on every change with a 10-minute expiry timestamp
  useEffect(() => {
    try {
      const payload = {
        items: state.items,
        expiresAt: state.items.length > 0 ? Date.now() + CART_EXPIRY_MS : 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage full or blocked */
    }
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const getItemQuantity = (menuItemId: string, variant?: string) => {
    const key = itemKey(menuItemId, variant);
    return (
      state.items.find((i) => itemKey(i.menuItemId, i.variant) === key)
        ?.quantity ?? 0
    );
  };

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (id, v) =>
      dispatch({ type: "REMOVE_ITEM", payload: { menuItemId: id, variant: v } }),
    updateQuantity: (id, qty, v) =>
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { menuItemId: id, variant: v, quantity: qty },
      }),
    updateNotes: (id, notes, v) =>
      dispatch({
        type: "UPDATE_NOTES",
        payload: { menuItemId: id, variant: v, notes },
      }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    totalItems,
    subtotal,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
