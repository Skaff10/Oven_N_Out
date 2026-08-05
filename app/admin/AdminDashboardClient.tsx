"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminOrder, DeliveryStatus } from "@/types";
import { DeliveryStatusBadge, SourceBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatusAction } from "@/lib/actions/adminActions";
import {
  FaPlusCircle,
  FaReceipt,
  FaArrowRight,
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";

interface DashboardProps {
  todayIncome: number;
  bkashIncome?: number;
  cashIncome?: number;
  deliveryFeeIncome?: number;
  todayExpenses: number;
  netProfit: number;
  recentOrders: AdminOrder[];
  todayOrderCount: number;
  deliveredOrderCount?: number;
}

export default function AdminDashboardClient({
  todayIncome,
  bkashIncome = 0,
  cashIncome = 0,
  deliveryFeeIncome = 0,
  todayExpenses,
  netProfit,
  recentOrders,
  todayOrderCount,
  deliveredOrderCount = 0,
}: DashboardProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (
    orderId: string,
    newStatus: DeliveryStatus
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to update order status");
      }
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Glanceable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Delivered Income */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#332218]/70 uppercase tracking-wider">
              Delivered Income
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              ৳{todayIncome.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-[#332218]/60 mt-0.5">
              {deliveredOrderCount} of {todayOrderCount} orders delivered
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <FaMoneyBillWave size={22} />
          </div>
        </div>

        {/* Today's Expenses */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#332218]/70 uppercase tracking-wider">
              Today's Expenses
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              ৳{todayExpenses.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-[#332218]/60 mt-0.5">
              Logged costs
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <FaWallet size={22} />
          </div>
        </div>

        {/* Today's Net Profit */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#81241D]/30 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#332218]/70 uppercase tracking-wider">
              Today's Net Profit
            </div>
            <div
              className={`text-2xl font-black mt-1 ${
                netProfit >= 0 ? "text-emerald-700" : "text-red-700"
              }`}
            >
              ৳{netProfit.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-[#332218]/60 mt-0.5">
              Delivered income minus costs
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#DEB124]/20 text-[#81241D] flex items-center justify-center">
            <FaChartLine size={22} />
          </div>
        </div>
      </div>

      {/* Money Tracking Breakdown Bar (bKash, Cash, Delivery Charged) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4CEB8] shadow-xs space-y-3">
        <div className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Money Tracking Breakdown (Delivered Orders Only)
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#FAF2E8] p-3 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              💳 bKash Payment
            </div>
            <div className="text-base font-black text-pink-700 mt-1">
              ৳{bkashIncome.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#FAF2E8] p-3 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              💵 Cash Payment
            </div>
            <div className="text-base font-black text-emerald-800 mt-1">
              ৳{cashIncome.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#FAF2E8] p-3 rounded-xl border border-[#E4CEB8]">
            <div className="text-[10px] font-bold text-[#332218]/70 uppercase">
              🛵 Delivery Fee
            </div>
            <div className="text-base font-black text-[#81241D] mt-1">
              ৳{deliveryFeeIncome.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Quick Action Buttons (Thumb-friendly) */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/orders/new" className="block">
          <div className="bg-[#81241D] hover:bg-[#681c16] text-[#F1E1CE] p-4 rounded-2xl shadow-lg border border-[#DEB124]/30 flex flex-col items-center justify-center text-center gap-2 active:scale-98 transition-all cursor-pointer">
            <FaPlusCircle size={28} className="text-[#DEB124]" />
            <span className="font-heading text-sm tracking-wide">
              ADD MANUAL ORDER
            </span>
          </div>
        </Link>

        <Link href="/admin/expenses/new" className="block">
          <div className="bg-[#FAF2E8] hover:bg-[#F1E1CE] text-[#332218] p-4 rounded-2xl shadow-md border-2 border-[#E4CEB8] flex flex-col items-center justify-center text-center gap-2 active:scale-98 transition-all cursor-pointer">
            <FaReceipt size={28} className="text-[#81241D]" />
            <span className="font-heading text-sm tracking-wide text-[#81241D]">
              ADD EXPENSE
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border-2 border-[#E4CEB8] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4CEB8] pb-3">
          <h2 className="font-heading text-base text-[#81241D] tracking-wide">
            RECENT ORDERS
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#81241D] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <FaArrowRight size={10} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#332218]/60 font-semibold">
            No recent orders found.
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 bg-[#FAF2E8] rounded-xl border border-[#E4CEB8] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#332218]">
                        {order.customerName}
                      </span>
                      <SourceBadge source={order.source} />
                    </div>
                    <div className="text-[11px] text-[#332218]/70 mt-0.5">
                      {order.customerPhone} • {order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#81241D]">
                      ৳{order.totalAmount}
                    </div>
                    <DeliveryStatusBadge status={order.deliveryStatus} />
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-1">
                  {order.deliveryStatus === "delivered" || order.deliveryStatus === "cancelled" ? (
                    <span className="text-[10px] font-bold text-gray-500">
                       {order.deliveryStatus === "delivered" ? "✓ Delivered" : "✕ Cancelled"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, "delivered")}
                        className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-emerald-100 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer"
                      >
                        ✓ Delivered
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        className="px-3 py-1 bg-red-800 hover:bg-red-900 text-red-100 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer"
                      >
                        ✕ Cancelled
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
