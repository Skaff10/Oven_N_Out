import { getMenuItems } from "@/lib/menu";
import OrderPageClient from "./OrderPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Online | Oven & Out",
  description: "Browse our delicious menu and place your order online for fresh delivery in Dhaka.",
};

// Next.js App Router dynamic page
export const revalidate = 60; // Revalidate every minute

export default async function OrderPage() {
  const items = await getMenuItems();

  return <OrderPageClient items={items} />;
}