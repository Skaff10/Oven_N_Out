"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminOrder, DeliveryStatus } from "@/types";
import { DeliveryStatusBadge, SourceBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatusAction } from "@/lib/actions/adminActions";
import { FaPlusCircle } from "react-icons/fa";

interface OrdersListClientProps {
  orders: AdminOrder[];
}

const STATUS_FILTERS: { label: string; value: DeliveryStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "✓ Delivered", value: "delivered" },
  { label: "✕ Cancelled", value: "cancelled" },
  { label: "⏳ Pending", value: "pending" },
];

export default function OrdersListClient({ orders }: OrdersListClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<DeliveryStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.deliveryStatus === filter);

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
        alert(res.error || "Failed to update order status.");
      }
    } catch {
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl text-[#81241D]">ALL ORDERS</h1>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#81241D] text-[#F1E1CE] text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <FaPlusCircle size={14} className="text-[#DEB124]" />
          <span>New Order</span>
        </Link>
      </div>

      {/* Status Filter Chips (horizontal scroll) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {STATUS_FILTERS.map((sf) => (
          <button
            key={sf.value}
            type="button"
            onClick={() => setFilter(sf.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filter === sf.value
                ? "bg-[#81241D] text-[#F1E1CE] shadow-sm"
                : "bg-white text-[#332218] border border-[#E4CEB8] hover:bg-[#FAF2E8]"
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-xs font-semibold text-[#332218]/60">
        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#332218]/60 text-sm font-semibold">
          No orders match this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white p-3 rounded-2xl border border-[#E4CEB8] shadow-xs transition-all"
              >
                {/* Order Summary Row (always visible) */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : order.id)
                  }
                  className="w-full flex items-start justify-between gap-2 text-left cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#332218] truncate">
                        {order.customerName}
                      </span>
                      <SourceBadge source={order.source} />
                    </div>
                    <div className="text-[11px] text-[#332218]/60 mt-0.5">
                      {formatTime(order.createdAt)} • {order.customerPhone}
                    </div>
                    <div className="text-[11px] text-[#332218]/50 mt-0.5 truncate max-w-62.5">
                      {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-sm font-black text-[#81241D]">
                      ৳{order.totalAmount}
                    </div>
                    <DeliveryStatusBadge status={order.deliveryStatus} />
                  </div>
                </button>

                {/* Expanded Detail & Status Buttons */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#E4CEB8] space-y-3">
                    {/* Full details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#332218]/60 font-semibold">Address:</span>
                        <p className="font-bold text-[#332218]">
                          {order.customerAddress || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#332218]/60 font-semibold">Payment:</span>
                        <p className="font-bold text-[#332218] capitalize">
                          {order.paymentMethod} • {order.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Item list */}
                    <div className="bg-[#FAF2E8] p-2 rounded-xl text-xs space-y-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between font-semibold"
                        >
                          <span>
                            {item.qty}× {item.name}
                          </span>
                          <span className="text-[#81241D]">
                            ৳{item.unitPrice * item.qty}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-[#E4CEB8] pt-1 flex justify-between font-black text-[#81241D]">
                        <span>Total</span>
                        <span>৳{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="text-xs bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 font-semibold">
                        📝 {order.notes}
                      </div>
                    )}

                    {/* 1-Tap Status Change Buttons */}
                    <div>
                      <div className="text-[10px] font-bold text-[#332218]/60 uppercase mb-1.5">
                        Set Order Status:
                      </div>
                      {order.deliveryStatus === "delivered" || order.deliveryStatus === "cancelled" ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700">
                          <span>🔒 Status Finalized: {order.deliveryStatus === "delivered" ? "✓ Delivered" : "✕ Cancelled"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          {(["delivered", "cancelled"] as DeliveryStatus[]).map((st) => {
                            const labels: Record<string, string> = {
                              delivered: "✓ Delivered",
                              cancelled: "✕ Cancelled",
                            };
                            return (
                              <button
                                key={st}
                                type="button"
                                disabled={updatingId === order.id}
                                onClick={() => handleStatusChange(order.id, st)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  st === "delivered"
                                    ? "bg-emerald-800 text-emerald-100 hover:bg-emerald-900 border border-emerald-900"
                                    : "bg-red-800 text-red-100 hover:bg-red-900 border border-red-900"
                                }`}
                              >
                                {labels[st]}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
