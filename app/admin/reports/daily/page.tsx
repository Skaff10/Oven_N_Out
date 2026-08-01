import React from "react";
import { redirect } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getDailyOrders } from "@/lib/orders";
import { getDailyExpenses } from "@/lib/expenses";
import { getDhakaTodayString } from "@/lib/dateUtils";
import DailyReportClient from "./DailyReportClient";

export const revalidate = 0;

export default async function DailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const dateStr = params.date || getDhakaTodayString();

  const [orders, expenses] = await Promise.all([
    getDailyOrders(dateStr),
    getDailyExpenses(dateStr),
  ]);

  return (
    <DailyReportClient
      dateStr={dateStr}
      orders={orders}
      expenses={expenses}
    />
  );
}
