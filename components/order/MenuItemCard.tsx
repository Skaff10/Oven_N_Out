"use client";

import { useState } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import Button from "../ui/Button";
import QuantityStepper from "../ui/QuantityStepper";
interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, updateQuantity, getItemQuantity, items } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0] : null
  );


  const currentPrice = selectedVariant ? selectedVariant.price : item.price;
  const variantName = selectedVariant ? selectedVariant.name : undefined;
  const quantity = getItemQuantity(item.id, variantName);

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: currentPrice,
      quantity: 1,
      variant: variantName,

    });
 
  };

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1, variantName);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, quantity - 1, variantName);
  };

  return (
    <div className="bg-primary border border-dark-border rounded-2xl flex flex-col h-full shadow-lg group hover:border-accent/40 transition-all duration-300">
      {/* Category header tag */}
      

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg text-secondary mb-1.5 leading-snug">
            {item.name}
          </h3>
          <p className="font-body text-sm text-secondary/60 line-clamp-2 mb-4">
            {item.description}
          </p>

          {/* Variants Selector */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-heading text-secondary/50 block mb-1.5 uppercase tracking-wider">
                Select Option:
              </span>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.name === v.name;
                  return (
                    <button
                      key={v.name}
                      onClick={() => {
                        setSelectedVariant(v);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-body font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-accent text-text border border-primary"
                          : "bg-secondary text-text border border-primary hover:border-primary/30"
                      }`}
                    >
                      {v.name} (
                      {v.price} <span>tk</span>)
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <div className="flex flex-col">
              <span className="text-xs text-secondary/40 font-body uppercase">
                Price
              </span>
              <span className="text-xl font-heading text-accent">
                
                {currentPrice} <span className="text-md">tk</span>
              </span>
            </div>

            {quantity > 0 ? (
              <QuantityStepper
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                size="md"
              />
            ) : (
              <div className="flex gap-2">
            
                <Button variant="primary" size="md" onClick={handleAddToCart}>
                  ADD TO CART
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
