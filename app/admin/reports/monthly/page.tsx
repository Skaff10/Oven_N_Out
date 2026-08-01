import React from "react";
import { redirect } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getMonthlyOrders } from "@/lib/orders";
import { getMonthlyExpenses } from "@/lib/expenses";
import { getDhakaMonthString } from "@/lib/dateUtils";
import MonthlyReportClient from "./MonthlyReportClient";

export const revalidate = 0;

export default async function MonthlyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const monthStr = params.month || getDhakaMonthString();

  const [orders, expenses] = await Promise.all([
    getMonthlyOrders(monthStr),
    getMonthlyExpenses(monthStr),
  ]);

  return (
    <MonthlyReportClient
      monthStr={monthStr}
      orders={orders}
      expenses={expenses}
    />
  );
}
