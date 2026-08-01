"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/lib/actions/adminActions";
import { FaLock, FaBackspace, FaExclamationTriangle } from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + num);
      if (error) setError("");
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    if (error) setError("");
  };

  const handleClear = () => {
    setPin("");
    if (error) setError("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError("Please enter your PIN");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await loginAdminAction(pin);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Incorrect PIN. Access Denied.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1E1CE] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-[#E4CEB8] shadow-2xl space-y-6 text-center">
        {/* Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 bg-[#81241D] text-[#DEB124] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <FaLock size={24} />
          </div>
          <h1 className="font-heading text-2xl text-[#81241D] tracking-wide">
            OVEN & OUT
          </h1>
          <p className="text-xs font-bold text-[#332218]/70">
            ENTER OWNER PIN TO ACCESS ADMIN
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? "bg-[#81241D] border-[#81241D] scale-110"
                  : "border-[#E4CEB8] bg-[#FAF2E8]"
              }`}
            />
          ))}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-start gap-2 text-left">
            <FaExclamationTriangle className="text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad for Thumb Entry */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-[#FAF2E8] hover:bg-[#F1E1CE] active:bg-[#DEB124]/30 text-[#332218] text-2xl font-black shadow-xs border border-[#E4CEB8] transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-red-50 hover:bg-red-100 text-red-800 text-xs font-black shadow-xs border border-red-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-14 rounded-2xl bg-[#FAF2E8] hover:bg-[#F1E1CE] active:bg-[#DEB124]/30 text-[#332218] text-2xl font-black shadow-xs border border-[#E4CEB8] transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#FAF2E8] hover:bg-[#F1E1CE] text-[#81241D] text-lg font-black shadow-xs border border-[#E4CEB8] transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <FaBackspace />
          </button>
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting || !pin}
          className="w-full py-4 bg-[#81241D] hover:bg-[#681c16] disabled:opacity-50 text-[#F1E1CE] font-heading text-lg tracking-wider rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer"
        >
          {isSubmitting ? "UNLOCKING..." : "ENTER ADMIN"}
        </button>
      </div>
    </div>
  );
}
