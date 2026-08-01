"use client";
import type { Customer } from "@/types";
import { FaUserClock } from "react-icons/fa";

interface RecentCustomersBarProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
}
export default function RecentCustomersBar({
  customers,
  onSelect,
}: RecentCustomersBarProps) {
  if (!customers || customers.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#332218]/70">
        <FaUserClock size={12} className="text-[#81241D]" />
        <span>Recent Customers (Tap to Quick-Fill):</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {customers.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className="inline-flex flex-col items-start px-3 py-1.5 bg-[#FAF2E8] hover:bg-[#F1E1CE] border border-[#E4CEB8] rounded-xl text-left transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer"
          >
            <span className="text-xs font-bold text-[#332218] truncate max-w-30">
              {c.name || "Customer"}
            </span>
            <span className="text-[10px] font-mono text-[#332218]/70">
              {c.phone}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}