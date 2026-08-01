import React from "react";
import type { DeliveryStatus, OrderSource } from "@/types";

interface StatusBadgeProps {
  status?: DeliveryStatus;
  source?: OrderSource;
  size?: "sm" | "md";
}

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          ⏳ Pending
        </span>
      );
    case "out_for_delivery":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
          🛵 On the Way
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          ✓ Delivered
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          ✕ Cancelled
        </span>
      );
    default:
      return null;
  }
}

export function SourceBadge({ source }: { source: OrderSource }) {
  switch (source) {
    case "website":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
          🌐 Website
        </span>
      );
    case "facebook":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          💬 Facebook
        </span>
      );
    case "call":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          📞 Call
        </span>
      );
    case "pathao":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
          🏍️ Pathao
        </span>
      );
    case "foodpanda":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
          🐼 Foodpanda
        </span>
      );
    default:
      return null;
  }
}
