export const DELIVERY_FEE = 50; // ৳ — flat rate
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
