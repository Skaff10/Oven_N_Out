"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminOrder, Expense, OrderSource } from "@/types";
import { SourceBadge } from "@/components/admin/StatusBadge";
import { getDaysInMonth, formatDateToDhaka } from "@/lib/dateUtils";
import { FaCalendarDay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MonthlyReportClientProps {
  monthStr: string;
  orders: AdminOrder[];
  expenses: Expense[];
}

export default function MonthlyReportClient({
  monthStr,
  orders,
  expenses,
}: MonthlyReportClientProps) {
  const router = useRouter();

  // === Metrics ===
  const validOrders = orders.filter((o) => o.deliveryStatus !== "cancelled");
  const totalIncome = validOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Income by source
  const incomeBySource: Record<OrderSource, number> = {
    website: 0,
    facebook: 0,
    call: 0,
    pathao: 0,
    foodpanda: 0,
  };
  validOrders.forEach((o) => {
    incomeBySource[o.source] = (incomeBySource[o.source] || 0) + o.totalAmount;
  });

  // Expenses by category
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] =
      (expenseByCategory[e.category] || 0) + e.amount;
  });

  // === Chart data: daily net across month ===
  const days = getDaysInMonth(monthStr);
  const dailyMap: Record<string, { income: number; expenses: number }> = {};
  days.forEach((d) => {
    dailyMap[d] = { income: 0, expenses: 0 };
  });

  validOrders.forEach((o) => {
    const dStr = formatDateToDhaka(o.createdAt);
    if (dailyMap[dStr]) {
      dailyMap[dStr].income += o.totalAmount;
    }
  });

  expenses.forEach((e) => {
    const dStr = formatDateToDhaka(e.date);
    if (dailyMap[dStr]) {
      dailyMap[dStr].expenses += e.amount;
    }
  });

  const chartData = days.map((d) => ({
    date: d.substring(8), // Just DD
    income: dailyMap[d].income,
    expenses: dailyMap[d].expenses,
    net: dailyMap[d].income - dailyMap[d].expenses,
  }));

  // Month navigation
  const navigateMonth = (delta: number) => {
    const [y, m] = monthStr.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/admin/reports/monthly?month=${newMonth}`);
  };

  const formatMonthLabel = (ms: string) => {
    const [y, m] = ms.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl text-[#81241D]">MONTHLY REPORT</h1>
        <Link
          href="/admin/reports/daily"
          className="text-xs font-bold text-[#81241D] flex items-center gap-1 hover:underline"
        >
          <FaCalendarDay size={12} /> Daily View
        </Link>
      </div>

      {/* Month Navigator */}
      <div className="bg-white p-3 rounded-2xl border border-[#E4CEB8] flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#81241D] flex items-center justify-center hover:bg-[#F1E1CE] border border-[#E4CEB8] cursor-pointer active:scale-95"
        >
          <FaArrowLeft size={12} />
        </button>
        <div className="text-center">
          <input
            type="month"
            value={monthStr}
            onChange={(e) =>
              router.push(`/admin/reports/monthly?month=${e.target.value}`)
            }
            className="bg-transparent text-center text-sm font-bold text-[#332218] cursor-pointer focus:outline-none"
          />
          <div className="text-[10px] text-[#332218]/60 font-semibold mt-0.5">
            {formatMonthLabel(monthStr)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="w-9 h-9 rounded-xl bg-[#FAF2E8] text-[#81241D] flex items-center justify-center hover:bg-[#F1E1CE] border border-[#E4CEB8] cursor-pointer active:scale-95"
        >
          <FaArrowRight size={12} />
        </button>
      </div>

      {/* Monthly KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-xl border border-[#E4CEB8] text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Income
          </div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            ৳{totalIncome.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#332218]/50 font-semibold">
            {validOrders.length} orders
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-[#E4CEB8] text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Expenses
          </div>
          <div className="text-lg font-black text-amber-900 mt-0.5">
            ৳{totalExpenses.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#332218]/50 font-semibold">
            {expenses.length} entries
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border-2 border-[#81241D]/30 text-center">
          <div className="text-[10px] font-bold text-[#332218]/60 uppercase">
            Net
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

      {/* Daily Net Profit Bar Chart */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-3">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Daily Net Profit Trend
        </h2>
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E4CEB8" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#332218" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#332218" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FAF2E8",
                  border: "1px solid #E4CEB8",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
                formatter={(value: any, name: any) => [
                  `৳${Number(value).toLocaleString()}`,
                  String(name).charAt(0).toUpperCase() + String(name).slice(1),
                ]}
              />
              <ReferenceLine y={0} stroke="#332218" strokeWidth={1} />
              <Bar
                dataKey="net"
                fill="#81241D"
                radius={[3, 3, 0, 0]}
                maxBarSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income by Source */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Income by Source
        </h2>
        {Object.entries(incomeBySource)
          .filter(([, val]) => val > 0)
          .map(([src, val]) => {
            const pct = totalIncome > 0 ? Math.round((val / totalIncome) * 100) : 0;
            return (
              <div
                key={src}
                className="flex items-center justify-between py-1.5 border-b border-[#E4CEB8] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <SourceBadge source={src as OrderSource} />
                  <span className="text-[10px] text-[#332218]/60 font-semibold">
                    {pct}%
                  </span>
                </div>
                <span className="text-sm font-bold text-[#332218]">
                  ৳{val.toLocaleString()}
                </span>
              </div>
            );
          })}
        {Object.values(incomeBySource).every((v) => v === 0) && (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-2">
            No income this month.
          </p>
        )}
      </div>

      {/* Expenses by Category */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] space-y-2">
        <h2 className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Expenses by Category
        </h2>
        {Object.entries(expenseByCategory)
          .sort((a, b) => b[1] - a[1])
          .map(([cat, val]) => {
            const pct =
              totalExpenses > 0
                ? Math.round((val / totalExpenses) * 100)
                : 0;
            return (
              <div
                key={cat}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#332218] capitalize">
                    {cat}
                  </span>
                  <span className="text-sm font-bold text-amber-900">
                    ৳{val.toLocaleString()}{" "}
                    <span className="text-[10px] text-[#332218]/50 font-semibold">
                      ({pct}%)
                    </span>
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-[#FAF2E8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#DEB124] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        {Object.keys(expenseByCategory).length === 0 && (
          <p className="text-xs text-[#332218]/50 font-semibold text-center py-2">
            No expenses this month.
          </p>
        )}
      </div>
    </div>
  );
}
