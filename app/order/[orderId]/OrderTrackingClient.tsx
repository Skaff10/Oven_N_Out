"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import {  ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, RESTAURANT_PHONE } from "@/config/constants";
import OrderSummary from "@/components/order/OrderSummary";
import { getOrder } from "@/lib/orders";
import { FaCheckCircle, FaChevronRight, FaPhone, FaClipboard, FaTimesCircle, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import Button from "@/components/ui/Button";

interface OrderTrackingClientProps {
  initialOrder: Order | null;
  orderId: string;
  isNewOrder: boolean;
}

export default function OrderTrackingClient({
  initialOrder,
  orderId,
  isNewOrder,
}: OrderTrackingClientProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await getOrder(orderId);
      if (updated) {
        setOrder(updated as Order);
      }
    } catch (err) {
      console.error("Error refreshing order:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Poll for updates if the order is not completed/cancelled
  useEffect(() => {
    if (!order || order.status === "completed" || order.status === "cancelled") {
      return;
    }

    const interval = setInterval(() => {
      handleRefresh();
    }, 15000); // Poll every 15s

    return () => clearInterval(interval);
  }, [order, orderId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="w-full min-h-screen bg-secondary pt-24 pb-16 flex flex-col items-center justify-center font-body text-secondary text-center px-4">
        <FaTimesCircle className="text-primary mb-4" size={48} />
        <h1 className="font-heading text-2xl text-primary mb-2">Order Not Found</h1>
        <p className="text-text text-sm max-w-sm mb-6">
          We couldn&apos;t find an order with ID: <span className="font-mono text-accent">{orderId}</span>
        </p>
        <Link href="/order">
          <Button variant="primary">GO BACK TO ORDER PAGE</Button>
        </Link>
      </div>
    );
  }

  // Calculate current active step index
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(order.status as typeof ORDER_STATUS_STEPS[number]);

  return (
    <div className="w-full min-h-screen bg-dark pt-24 pb-16 font-body text-secondary">
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6 space-y-8 animate-fade-in">
        {/* Success Confetti Banner for New Orders */}
        {isNewOrder && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
            <FaCheckCircle className="text-accent animate-pulse" size={48} />
            <h1 className="font-heading text-2xl text-accent">ORDER PLACED SUCCESSFULLY!</h1>
            <p className="text-secondary/80 text-sm max-w-lg">
              Thank you for ordering from Oven & Out. We have received your order and are starting to prepare your delicious meal.
            </p>
          </div>
        )}

        {/* Order Header / Status */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-heading text-secondary/40 block mb-1 uppercase tracking-widest">
              Order Tracking ID
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg text-accent font-bold truncate max-w-[200px] md:max-w-none">
                {order.id}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-secondary/40 hover:text-accent p-1 transition-colors cursor-pointer"
                title="Copy Order ID"
              >
                <FaClipboard size={14} />
              </button>
              {copied && <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-body">Copied!</span>}
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-xs font-heading text-secondary/40 block mb-1 uppercase tracking-widest">
              Current Status
            </span>
            <span className="px-4 py-1.5 bg-primary text-secondary font-heading rounded-full text-sm uppercase tracking-wide">
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
        </div>

        {/* Tracking Progress Bar */}
        {order.status !== "cancelled" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base text-secondary">ORDER TIMELINE</h3>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs font-semibold text-accent hover:underline disabled:opacity-50 cursor-pointer"
              >
                {isRefreshing ? "Refreshing..." : "Refresh Status"}
              </button>
            </div>

            {/* Stepper progress */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 pt-4">
              {/* Connecting Line for desktop */}
              <div className="absolute top-[26px] left-[20px] right-[20px] h-0.5 bg-dark-border hidden md:block z-0" />
              <div
                className="absolute top-[26px] left-[20px] h-0.5 bg-accent transition-all duration-500 hidden md:block z-0"
                style={{
                  width: `${(currentStepIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />

              {ORDER_STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <div
                    key={step}
                    className="flex flex-row md:flex-col items-center gap-4 md:gap-2.5 z-10 w-full md:w-auto"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-heading text-sm ${
                        isCompleted
                          ? "bg-accent border-accent text-text scale-110 shadow-lg"
                          : "bg-dark-card border-dark-border text-secondary/30"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-accent"
                            : isCompleted
                            ? "text-secondary"
                            : "text-secondary/30"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[step]}
                      </span>
                      <span className="text-[10px] text-secondary/30 font-body">
                        {step === "pending"
                          ? "Received"
                          : step === "confirmed"
                          ? "Kitchen Accepted"
                          : step === "preparing"
                          ? "Cooking"
                          : step === "out_for_delivery"
                          ? "On Way"
                          : "Delivered"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Customer / Delivery Info */}
          <div className="md:col-span-6 bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
            <h3 className="font-heading text-base text-secondary border-b border-dark-border pb-3">
              DELIVERY DETAILS
            </h3>

            <div className="space-y-4 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-secondary/40">Customer Name:</span>
                <span className="text-secondary font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary/40">Phone Number:</span>
                <span className="text-secondary font-medium">{order.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary/40">Delivery Type:</span>
                <span className="text-secondary font-medium capitalize">{order.orderType}</span>
              </div>

              {order.orderType === "delivery" && order.customer.address && (
                <>
                  <div className="flex justify-between">
                    <span className="text-secondary/40">Area:</span>
                    <span className="text-secondary font-medium">{order.customer.area}</span>
                  </div>
                  <div className="border-t border-dark-border/40 pt-4 space-y-1.5">
                    <span className="text-secondary/40 text-xs block uppercase">Address:</span>
                    <p className="text-secondary leading-relaxed bg-dark-elevated p-3 rounded-lg border border-dark-border/20 text-xs">
                      {order.customer.address}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-dark-border/40 flex items-center justify-between gap-4">
              <span className="text-xs text-secondary/40">Need Help?</span>
              <a
                href={`tel:${RESTAURANT_PHONE}`}
                className="inline-flex items-center gap-2 text-xs font-heading bg-dark-elevated text-accent border border-dark-border px-3 py-1.5 rounded-lg hover:border-accent transition-colors"
              >
                <FaPhone size={10} /> CALL OUT
              </a>
            </div>
          </div>

          {/* Items Summary */}
          <div className="md:col-span-6">
            <OrderSummary
              items={order.items}
              subtotal={order.subtotal}
              orderType={order.orderType}
              showDetails={false}
            />
          </div>
        </div>

        {/* Call to action at bottom */}
        <div className="flex items-center justify-center pt-4">
          <Link href="/order">
            <Button variant="outline">ORDER SOMETHING ELSE</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
