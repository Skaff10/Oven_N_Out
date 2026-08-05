import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getDailyOrders, getAdminOrders } from "@/lib/orders";
import { getDailyExpenses } from "@/lib/expenses";
import { getDhakaTodayString } from "@/lib/dateUtils";
import AdminDashboardClient from "./AdminDashboardClient";

export const revalidate = 0; // Dynamic dashboard

export default async function AdminDashboardPage() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    redirect("/admin/login");
  }

  const todayStr = getDhakaTodayString();

  // Fetch today's data in Asia/Dhaka time
  const [todayOrders, todayExpenses, recentOrders] = await Promise.all([
    getDailyOrders(todayStr),
    getDailyExpenses(todayStr),
    getAdminOrders(10),
  ]);

  // Calculate metrics (ONLY count delivered orders towards income & money tracking)
  const deliveredOrders = todayOrders.filter((o) => o.deliveryStatus === "delivered");

  const todayIncome = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const bkashIncome = deliveredOrders
    .filter((o) => o.paymentMethod === "bkash")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const cashIncome = deliveredOrders
    .filter((o) => o.paymentMethod === "cash" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveryFeeIncome = deliveredOrders.reduce(
    (sum, o) => sum + (o.deliveryFee || 0),
    0
  );

  const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = todayIncome - totalExpenses;

  return (
    <AdminDashboardClient
      todayIncome={todayIncome}
      bkashIncome={bkashIncome}
      cashIncome={cashIncome}
      deliveryFeeIncome={deliveryFeeIncome}
      todayExpenses={totalExpenses}
      netProfit={netProfit}
      recentOrders={recentOrders}
      todayOrderCount={todayOrders.length}
      deliveredOrderCount={deliveredOrders.length}
    />
  );
}
