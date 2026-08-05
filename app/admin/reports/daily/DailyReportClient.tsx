"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminOrder, Expense, OrderSource, ExpenseCategory } from "@/types";
import { SourceBadge, DeliveryStatusBadge } from "@/components/admin/StatusBadge";
import { FaCalendarDay, FaChartBar, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface DailyReportClientProps {
  dateStr: string;
  orders: AdminOrder[];
  expenses: Expense[];
}

export default function DailyReportClient({
  dateStr,
  orders,
  expenses,
}: DailyReportClientProps) {
  const router = useRouter();

  // Calculate daily metrics (ONLY delivered orders add money to bill/totals)
  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "delivered");
  const totalIncome = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);
  const bkashTotal = deliveredOrders
    .filter((o) => o.paymentMethod === "bkash")
    .reduce((s, o) => s + o.totalAmount, 0);
  const cashTotal = deliveredOrders
    .filter((o) => o.paymentMethod === "cash" || o.paymentMethod === "cod")
    .reduce((s, o) => s + o.totalAmount, 0);
  const deliveryFeeTotal = deliveredOrders.reduce(
    (s, o) => s + (o.deliveryFee || 0),
    0
  );

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Income by source (delivered orders only)
  const incomeBySource: Record<OrderSource, number> = {
    website: 0,
    facebook: 0,
    call: 0,
    pathao: 0,
    foodpanda: 0,
  };
  deliveredOrders.forEach((o) => {
    incomeBySource[o.source] = (incomeBySource[o.source] || 0) + o.totalAmount;
  });

  // Expenses by category
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] =
      (expenseByCategory[e.category] || 0) + e.amount;
  });

  const handleDateChange = (newDate: string) => {
    router.push(`/admin/reports/daily?date=${newDate}`);
  };

  // Navigate prev/next day
  const navigateDay = (delta: number) => {
    const d = new Date(dateStr + "T12:00:00+06:00");
    d.setDate(d.getDate() + delta);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    handleDateChange(`${year}-${month}-${day}`);
  };

  const formatDate = (ds: string) => {
    const d = new Date(ds + "T12:00:00+06:00");
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl text-[#81241D]">DAILY REPORT</h1>
        <Link
          href={`/admin/reports/monthly`}
          className="text-xs font-bold text-[#81241D] flex items-center gap-1 hover:underline"
        >
          <FaChartBar size={12} /> Monthly View
        </Link>
      </div>

      {/* Date Picker + Day Nav */}
      <div className="bg-white p-3 rounded-2xl border border-[#E4CEB8] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigateDay(-1)}
          className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#81241D] flex items-center justify-center hover:bg-[#F1E1CE] border border-[#E4CEB8] cursor-pointer active:scale-95"
        >
          <FaArrowLeft size={12} />
        </button>
        <div className="flex-1 text-center">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-transparent text-center text-sm font-bold text-[#332218] cursor-pointer focus:outline-none"
          />
          <div className="text-[10px] text-[#332218]/60 font-semibold mt-0.5">
            {formatDate(dateStr)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateDay(1)}
          className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#81241D] flex items-center justify-center hover:bg-[#F1E1CE] border border-[#E4CEB8] cursor-pointer active:scale-95"
        >
          <FaArrowRight size={12} />
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-xl border border-[#E4CEB8] text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Delivered Income
          </div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            ৳{totalIncome.toLocaleString()}
          </div>
          <div className="text-[9px] font-semibold text-[#332218]/50 mt-0.5">
            {deliveredOrders.length} of {orders.length} orders
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E4CEB8] text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Expenses
          </div>
          <div className="text-lg font-black text-amber-900 mt-0.5">
            ৳{totalExpenses.toLocaleString()}
          </div>
          <div className="text-[9px] font-semibold text-[#332218]/50 mt-0.5">
            {expenses.length} items
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border-2 border-[#81241D]/30 text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Net Profit
          </div>
          <div
            className={`text-lg font-black mt-0.5 ${
              netProfit >= 0 ? "text-emerald-700" : "text-red-700"
            }`}
          >
            ৳{netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Daily Money Tracking Breakdown */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Money Tracking Breakdown (Delivered Orders Only)
        </h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              💳 bKash
            </div>
            <div className="text-sm font-black text-pink-700 mt-0.5">
              ৳{bkashTotal.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              💵 Cash
            </div>
            <div className="text-sm font-black text-emerald-800 mt-0.5">
              ৳{cashTotal.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              🛵 Delivery Fee
            </div>
            <div className="text-sm font-black text-[#81241D] mt-0.5">
              ৳{deliveryFeeTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Income by Source */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Income by Source
        </h2>
        {Object.entries(incomeBySource)
          .filter(([, val]) => val > 0)
          .map(([src, val]) => (
            <div
              key={src}
              className="flex items-center justify-between py-1.5 border-b border-[#E4CEB8] last:border-0"
            >
              <SourceBadge source={src as OrderSource} />
              <span className="text-sm font-bold text-[#332218]">
                ৳{val.toLocaleString()}
              </span>
            </div>
          ))}
        {Object.values(incomeBySource).every((v) => v === 0) && (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-2">
            No income recorded.
          </p>
        )}
      </div>

      {/* Expenses by Category */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Expenses by Category
        </h2>
        {Object.entries(expenseByCategory).map(([cat, val]) => (
          <div
            key={cat}
            className="flex items-center justify-between py-1.5 border-b border-[#E4CEB8] last:border-0"
          >
            <span className="text-xs font-bold text-[#332218] capitalize">
              {cat}
            </span>
            <span className="text-sm font-bold text-amber-900">
              ৳{val.toLocaleString()}
            </span>
          </div>
        ))}
        {Object.keys(expenseByCategory).length === 0 && (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-2">
            No expenses recorded.
          </p>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Orders ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-4">
            No orders on this date.
          </p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E4CEB8] flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#332218]">
                      {order.customerName}
                    </span>
                    <SourceBadge source={order.source} />
                  </div>
                  <div className="text-[10px] text-[#332218]/60 mt-0.5 truncate">
                    {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-[#81241D]">
                    ৳{order.totalAmount}
                  </div>
                  <DeliveryStatusBadge status={order.deliveryStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses Line Items */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Expense Log ({expenses.length})
        </h2>
        {expenses.length === 0 ? (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-4">
            No expenses on this date.
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E4CEB8] flex items-start justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-bold text-[#332218] capitalize">
                    {exp.category}
                  </span>
                  <p className="text-[10px] text-[#332218]/60 mt-0.5">
                    {exp.description}
                  </p>
                </div>
                <span className="text-sm font-black text-amber-900 shrink-0">
                  ৳{exp.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
