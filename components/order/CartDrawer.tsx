"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaTrash, FaTimes, FaShoppingBag, FaStickyNote } from "react-icons/fa";
import QuantityStepper from "../ui/QuantityStepper";
import Button from "../ui/Button";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    updateNotes,
    subtotal,
    totalItems,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md h-full bg-secondary shadow-2xl flex flex-col z-10 animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            
            <h2 className="font-heading text-xl text-primary translate-y-0.5">
              YOUR CART
            </h2>

          </div>
          <button
            onClick={closeCart}
            className="p-1 text-primary hover:text-primary hover:bg-dark-elevated rounded-lg transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-secondary mb-4">
                <FaShoppingBag size={28} />
              </div>
              <h3 className="font-heading text-lg text-primary mb-1">
                Your cart is empty
              </h3>
              <p className="font-body text-sm text-primary/80 max-w-xs mb-6">
                Add delicious meatboxes, burgers, pastas, and sides to satisfy your
                cravings.
              </p>
              <Button variant="primary" size="md" onClick={closeCart}>
                START ORDERING
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const key = item.variant
                ? `${item.menuItemId}::${item.variant}`
                : item.menuItemId;

              return (
                <div
                  key={key}
                  className="bg-primary w-full border border-dark-border/40 hover:border-dark-border p-4 rounded-xl flex flex-col gap-3 transition-colors"
                >
                  <div className="flex flex-col gap-1 w-full">
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-heading text-sm text-secondary leading-tight truncate">
                          {item.name}
                        </h4>
                        <span className="font-heading text-accent text-sm whitespace-nowrap">
                          
                          {item.price * item.quantity} <span >tk</span>
                        </span>
                      </div>
                      {item.variant && (
                        <span className="inline-block mt-1 py-0.5 font-bold text-accent font-body text-xs rounded">
                          {item.variant}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full justify-end gap-4 pt-2.5 border-t border-dark-border/30">
                    <div className="flex items-center gap-3 ">
                      <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() =>
                          updateQuantity(
                            item.menuItemId,
                            item.quantity + 1,
                            item.variant,
                          )
                        }
                        onDecrease={() =>
                          updateQuantity(
                            item.menuItemId,
                            item.quantity - 1,
                            item.variant,
                          )
                        }
                        size="sm"
                      />
                      <button
                        onClick={() =>
                          removeItem(item.menuItemId, item.variant)
                        }
                        className="text-accent/50 p-1.5 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-text bg-primary">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-body text-secondary text-md">
                <span>Subtotal</span>
                <span>
                  
                  {subtotal} <span>tk</span>
                </span>
              </div>
              <div className="flex justify-between font-body text-secondary/70 text-xs">
                <span>Delivery and taxes calculated at checkout</span>
              </div>
              <div className="flex justify-between font-heading text-secondary text-base pt-2 border-t border-text/40">
                <span>Total Amount</span>
                <span className="text-accent">
                 {subtotal} <span>tk</span>
                </span>
              </div>
            </div>

            <Link href="/order/checkout" onClick={closeCart}>
              <Button variant="primary" fullWidth size="lg">
                PROCEED TO CHECKOUT
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
