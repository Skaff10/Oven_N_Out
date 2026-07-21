export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  variants?: MenuItemVariant[];
  category: string;
  imageUrl: string;
  available: boolean;
  createdAt?: Date;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  notes?: string;
  imageUrl?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address?: string;
  area?: string;
}

export type OrderType = "delivery" | "pickup";
export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: OrderCustomer;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
