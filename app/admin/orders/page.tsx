import React from "react";
import { redirect } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getAdminOrders } from "@/lib/orders";
import OrdersListClient from "./OrdersListClient";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    redirect("/admin/login");
  }

  const orders = await getAdminOrders(100);

  return <OrdersListClient orders={orders} />;
}
