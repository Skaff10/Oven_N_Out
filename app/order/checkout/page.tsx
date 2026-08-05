"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OrderSummary from "@/components/order/OrderSummary";
import { createOrder } from "@/lib/orders";
import { DELIVERY_AREAS, getDeliveryFeeForArea, AREA_DELIVERY_FEES } from "@/config/constants";
import { FaArrowLeft } from "react-icons/fa";
import type { OrderCustomer, PaymentMethod } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    area: DELIVERY_AREAS[0] as string,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDeliveryFee = getDeliveryFeeForArea(formData.area);

  // Redirect to order page if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.replace("/order");
    }
  }, [items, router, isSubmitting]);

  if (items.length === 0 && !isSubmitting) {
    return null;
  }

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";

    // Simple BD phone check (starts with 01, has 11 digits)
    const phoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ""))) {
      tempErrors.phone = "Please enter a valid Bangladeshi mobile number";
    }

    if (!formData.address.trim()) {
      tempErrors.address = "Delivery address is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const customer: OrderCustomer = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        area: formData.area,
      };

      const finalDeliveryFee = currentDeliveryFee;
      const total = subtotal + finalDeliveryFee;

      const orderId = await createOrder({
        items,
        subtotal,
        deliveryFee: finalDeliveryFee,
        total,
        customer,
        paymentMethod: "cod",
      });

      // Clear cart
      clearCart();

      // Redirect to status page
      router.push(`/order/${orderId}?new=true`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary pt-24 pb-16 font-body text-secondary">
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        {/* Back Link */}
        <Link
          href="/order"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors mb-6 cursor-pointer"
        >
          <FaArrowLeft size={12} /> BACK TO MENU
        </Link>

        <h1 className="font-heading text-3xl text-primary mb-8">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 bg-primary rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="font-heading text-xl text-secondary border-b border-text pb-3">
              CUSTOMER DETAILS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="e.g. 01712345678"
                required
              />

              <div className="flex flex-col gap-1.5 font-body">
                <label className="text-sm font-semibold text-secondary/80">
                  Delivery Area (Dhaka)
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-secondary text-text font-bold border border-dark-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
                >
                  {DELIVERY_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area} — {AREA_DELIVERY_FEES[area]} <span>tk</span>
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                placeholder="e.g. Wapda Goli, Mugda"
                required
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-5">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={currentDeliveryFee}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
