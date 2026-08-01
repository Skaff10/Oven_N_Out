import React from "react";
import { redirect } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getMenuItems } from "@/lib/menu";
import { getRecentCustomers } from "@/lib/customers";
import AddManualOrderClient from "./AddManualOrderClient";

export const revalidate = 0;

export default async function AddManualOrderPage() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    redirect("/admin/login");
  }

  const [menuItems, recentCustomers] = await Promise.all([
    getMenuItems(),
    getRecentCustomers(15),
  ]);

  return (
    <AddManualOrderClient
      menuItems={menuItems}
      recentCustomers={recentCustomers}
    />
  );
}
