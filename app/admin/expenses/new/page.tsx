"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ExpenseCategory } from "@/types";
import { addExpenseAction } from "@/lib/actions/adminActions";
import { getDhakaTodayString } from "@/lib/dateUtils";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: "ingredients", label: "Ingredients", icon: "🥩" },
  { value: "packaging", label: "Packaging", icon: "📦" },
  { value: "delivery", label: "Delivery", icon: "🛵" },
  { value: "utilities", label: "Utilities", icon: "⚡" },
  { value: "staff", label: "Staff", icon: "👤" },
  { value: "marketing", label: "Marketing", icon: "📢" },
  { value: "savings", label: "Savings", icon: "🐷" },
  { value: "other", label: "Other", icon: "📋" },
];

export default function AddExpensePage() {
  const router = useRouter();

  const [category, setCategory] = useState<ExpenseCategory>("ingredients");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState(getDhakaTodayString());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await addExpenseAction({
        category,
        amount: numAmount,
        description: description.trim(),
        dateStr,
      });

      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Failed to add expense.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add expense.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#81241D] hover:underline"
        >
          <FaArrowLeft size={10} /> DASHBOARD
        </Link>
        <h1 className="font-heading text-xl text-[#81241D]">ADD EXPENSE</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <FaExclamationTriangle className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Button Grid */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-3">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Category (Tap to Select)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                category === cat.value
                  ? "bg-[#81241D] text-[#F1E1CE] shadow-md border-2 border-[#81241D]"
                  : "bg-[#FAF2E8] text-[#332218] border border-[#E4CEB8] hover:bg-[#F1E1CE]"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-3">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Amount (৳)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-[#81241D]">
            ৳
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            className="w-full pl-10 pr-4 py-3.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-2xl font-black text-[#332218] text-right focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
          />
        </div>

        {/* Quick amount buttons */}
        <div className="flex gap-2 flex-wrap">
          {[50, 100, 200, 500, 1000, 2000].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(String(q))}
              className="px-3 py-1.5 bg-[#FAF2E8] hover:bg-[#F1E1CE] border border-[#E4CEB8] rounded-lg text-xs font-bold text-[#332218] cursor-pointer active:scale-95 transition-all"
            >
              ৳{q}
            </button>
          ))}
        </div>
      </div>

      {/* Description (free text input — expected) */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-2">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="e.g. Chicken 5kg from Chawkbazar"
          className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
        />
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-2">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          Date
        </label>
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#81241D] hover:bg-[#681c16] disabled:opacity-50 text-[#F1E1CE] font-heading text-lg tracking-wider rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
      >
        <FaCheckCircle size={20} className="text-[#DEB124]" />
        <span>{isSubmitting ? "SAVING..." : "SAVE EXPENSE"}</span>
      </button>
    </form>
  );
}
