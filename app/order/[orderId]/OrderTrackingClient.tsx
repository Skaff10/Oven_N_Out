"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import {  ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, RESTAURANT_PHONE } from "@/config/constants";
import OrderSummary from "@/components/order/OrderSummary";
import { getOrder } from "@/lib/orders";
import { FaCheckCircle, FaChevronRight, FaPhone, FaClipboard, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa";
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
        setOrder(updated as unknown as Order);
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
    <div className="w-full min-h-screen bg-secondary pt-24 pb-16 font-body text-secondary">
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6 space-y-8 animate-fade-in">
        {/* Success Confetti Banner for New Orders */}
        {isNewOrder && (
          <div className="bg-primary border border-primary/30 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
            <FaCheckCircle className="text-accent animate-pulse" size={48} />
            <h1 className="font-heading text-2xl text-accent">ORDER PLACED SUCCESSFULLY!</h1>
            <p className="text-secondary/80 text-sm max-w-lg">
              Thank you for ordering from Oven & Out. We have received your order and are starting to prepare your delicious meal.
            </p>
          </div>
        )}

        

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Customer / Delivery Info */}
          <div className="md:col-span-6 bg-accent border border-dark-border rounded-2xl p-6 space-y-6">
            <h3 className="font-heading text-base text-primary  border-b border-dark-border pb-3">
              DELIVERY DETAILS
            </h3>

            <div className="space-y-4 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-text">Customer Name:</span>
                <span className="text-primary font-medium">{order.customer?.name || (order as any).customerName || "Guest"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text">Phone Number:</span>
                <span className="text-primary font-medium">{order.customer?.phone || (order as any).customerPhone || "N/A"}</span>
              </div>

              {(order.customer?.address || (order as any).customerAddress) && (
                <>
                  {order.customer?.area && (
                    <div className="flex justify-between">
                      <span className="text-text">Area:</span>
                      <span className="text-primary font-medium">{order.customer.area}</span>
                    </div>
                  )}
                  <div className="border-t border-dark-border/40 pt-4 space-y-1.5">
                    <span className="text-text text-xs block uppercase">Address:</span>
                    <p className="text-secondary leading-relaxed bg-primary p-3 rounded-lg border border-dark-border/20 text-xs">
                      {order.customer?.address || (order as any).customerAddress}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-dark-border/40 flex items-center justify-between gap-4">
              <span className="text-xs text-text">Need Help?</span>
              <a
                href={`tel:${RESTAURANT_PHONE}`}
                className="inline-flex items-center gap-2 text-xs font-heading bg-accent text-text border border-dark-border px-3 py-1.5 rounded-lg hover:border-accent transition-colors"
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
              showDetails={false}
            />
          </div>
        </div>

        {/* Call to action at bottom */}
        <div className="flex items-center justify-center pt-4">
          <Link href="/order">
            <Button variant="secondary">ORDER SOMETHING ELSE</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
