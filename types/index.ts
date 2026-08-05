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
  active?: boolean;
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

export type OrderSource = "website" | "facebook" | "call" | "pathao" | "foodpanda";

export type PaymentMethod = "cash" | "bkash" | "nagad" | "card" | "other" | "cod";

export type PaymentStatus = "paid" | "due";

export type DeliveryStatus =
  | "pending"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  source: OrderSource;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  createdAt: Date;
  deliveredAt?: Date | null;
  // Backward compatibility fields for public checkout
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  customer?: OrderCustomer;
  status?: string;
}

export type ExpenseCategory =
  | "ingredients"
  | "packaging"
  | "delivery"
  | "utilities"
  | "staff"
  | "marketing"
  | "savings"
  | "other";

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  area?: string;
  lastOrderedAt: Date;
}

// === Legacy types used by public-facing order tracking pages ===

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
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
