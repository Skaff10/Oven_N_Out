export const AREA_DELIVERY_FEES: Record<string, number> = {
  Mugda: 50,
  Manda: 40,
  Maniknagar: 50,
  Bashabo: 60,
};

export const DEFAULT_DELIVERY_FEE = 50;

export const getDeliveryFeeForArea = (area?: string): number => {
  if (!area) return DEFAULT_DELIVERY_FEE;
  return AREA_DELIVERY_FEES[area] ?? DEFAULT_DELIVERY_FEE;
};

export const DELIVERY_FEE = 50; // default fallback rate
export const DELIVERY_AREAS = [
  "Mugda",
  "Manda",
  "Maniknagar",
  "Bashabo",
] as const;
export const MINIMUM_ORDER = 0; 

export const RESTAURANT_NAME = "Oven & Out";
export const RESTAURANT_PHONE = "016101505388";

export const CATEGORY_ORDER = [
  "Meat Box",
  "Burger",
  "Wings",
  "Pasta",
  "Sides",
  "Chow Mein",
  "Shakes",
  "Drinks",
  "Sauces",
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "On the Way",
  completed: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STEPS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "completed",
] as const;
