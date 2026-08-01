"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Customer, MenuItem, OrderSource, PaymentMethod, PaymentStatus } from "@/types";
import MenuItemPicker, { SelectedItem } from "@/components/admin/MenuItemPicker";
import RecentCustomersBar from "@/components/admin/RecentCustomersBar";
import { createManualOrderAction } from "@/lib/actions/adminActions";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

interface AddManualOrderClientProps {
  menuItems: MenuItem[];
  recentCustomers: Customer[];
}

export default function AddManualOrderClient({
  menuItems,
  recentCustomers,
}: AddManualOrderClientProps) {
  const router = useRouter();

  const [source, setSource] = useState<OrderSource>("facebook");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("due");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Live item total
  const calculatedTotal = selectedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0
  );
  const finalTotal = Math.max(0, calculatedTotal - discount);

  const handleSelectCustomer = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerAddress(customer.address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter customer name.");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Please enter customer phone number.");
      return;
    }
    if (selectedItems.length === 0) {
      setError("Please select at least one menu item.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createManualOrderAction({
        source,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: selectedItems.map((i) => ({
          name: i.name,
          qty: i.qty,
          unitPrice: i.unitPrice,
        })),
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus,
        notes: notes.trim(),
      });

      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Failed to create order.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit order.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#81241D] hover:underline"
        >
          <FaArrowLeft size={10} /> BACK TO DASHBOARD
        </Link>
        <h1 className="font-heading text-xl text-[#81241D]">NEW MANUAL ORDER</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <FaExclamationTriangle className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Source Toggle */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-2">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          1. Order Source
        </label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: "facebook" as OrderSource, label: "💬 Facebook" },
            { key: "call" as OrderSource, label: "📞 Phone Call" },
            { key: "pathao" as OrderSource, label: "🏍️ Pathao" },
            { key: "foodpanda" as OrderSource, label: "🐼 Foodpanda" },
          ]).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSource(s.key)}
              className={`py-3.5 px-4 rounded-xl font-heading text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                source === s.key
                  ? "bg-[#81241D] text-[#F1E1CE] shadow-md border-2 border-[#81241D]"
                  : "bg-[#FAF2E8] text-[#332218] hover:bg-[#F1E1CE] border border-[#E4CEB8]"
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Customer Info */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-4">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          2. Customer Details
        </label>

        {/* Quick-fill Recent Customers Bar */}
        <RecentCustomersBar
          customers={recentCustomers}
          onSelect={handleSelectCustomer}
        />

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#332218]/80 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed"
              className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#332218]/80 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#332218]/80 mb-1">
              Delivery Address *
            </label>
            <input
              type="text"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="e.g. House 14, Road 3, Mugda"
              className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none focus:border-[#81241D] focus:ring-1 focus:ring-[#81241D]"
            />
          </div>
        </div>
      </div>

      {/* STEP 3: Menu Items Picker */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-3">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          3. Select Items (Tap Cards / Steppers)
        </label>
        <MenuItemPicker
          menuItems={menuItems}
          selectedItems={selectedItems}
          onChange={setSelectedItems}
        />
      </div>

      {/* STEP 4: Payment Method + Payment Status */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#E4CEB8] shadow-xs space-y-4">
        <label className="text-xs font-black text-[#332218] uppercase tracking-wider">
          4. Payment Method & Status
        </label>

        {/* Payment Method Button Group */}
        <div>
          <div className="text-xs font-bold text-[#332218]/80 mb-2">
            Payment Method
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(["cash", "bkash", "nagad", "card", "other"] as PaymentMethod[]).map(
              (m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer ${
                    paymentMethod === m
                      ? "bg-[#81241D] text-[#F1E1CE] shadow-sm"
                      : "bg-[#FAF2E8] text-[#332218] border border-[#E4CEB8]"
                  }`}
                >
                  {m === "cash" ? "Cash" : m === "bkash" ? "bKash" : m === "nagad" ? "Nagad" : m === "card" ? "Card" : "Other"}
                </button>
              )
            )}
          </div>
        </div>

        {/* Payment Status Button Group */}
        <div>
          <div className="text-xs font-bold text-[#332218]/80 mb-2">
            Payment Status
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentStatus("due")}
              className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                paymentStatus === "due"
                  ? "bg-amber-800 text-amber-100 shadow-sm border border-amber-900"
                  : "bg-[#FAF2E8] text-[#332218] border border-[#E4CEB8]"
              }`}
            >
              ⏳ Due
            </button>
            <button
              type="button"
              onClick={() => setPaymentStatus("paid")}
              className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                paymentStatus === "paid"
                  ? "bg-emerald-800 text-emerald-100 shadow-sm border border-emerald-900"
                  : "bg-[#FAF2E8] text-[#332218] border border-[#E4CEB8]"
              }`}
            >
              ✓ Paid
            </button>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold text-[#332218]/80 mb-1">
            Optional Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra sauce, no onion"
            className="w-full px-3.5 py-2.5 bg-[#FAF2E8] border border-[#E4CEB8] rounded-xl text-sm font-bold text-[#332218] focus:outline-none"
          />
        </div>
      </div>

      {/* Sticky Order Summary & Submit Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#81241D] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#332218]/70">Subtotal ({selectedItems.reduce((acc, i) => acc + i.qty, 0)} items)</div>
          <div className="text-sm font-bold text-[#332218]">৳{calculatedTotal}</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-bold text-[#332218]/70 shrink-0">Discount (৳)</label>
          <input
            type="number"
            min="0"
            value={discount || ""}
            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-24 px-2 py-1 bg-[#FAF2E8] border border-[#E4CEB8] rounded-lg text-right text-xs font-bold text-[#81241D]"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#E4CEB8] pt-2">
          <div className="font-heading text-base text-[#332218]">TOTAL AMOUNT</div>
          <div className="font-heading text-2xl text-[#81241D]">৳{finalTotal}</div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || selectedItems.length === 0}
          className="w-full py-4 bg-[#81241D] hover:bg-[#681c16] disabled:opacity-50 text-[#F1E1CE] font-heading text-lg tracking-wider rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <FaCheckCircle size={20} className="text-[#DEB124]" />
          <span>{isSubmitting ? "SAVING ORDER..." : "CONFIRM & SAVE ORDER"}</span>
        </button>
      </div>
    </form>
  );
}
