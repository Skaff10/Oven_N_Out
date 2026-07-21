"use client";

import { useState, useTransition, useMemo } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import CategoryNav from "@/components/order/CategoryNav";
import MenuItemCard from "@/components/order/MenuItemCard";
import CartDrawer from "@/components/order/CartDrawer";
import { getCategories } from "@/lib/menu";
import { FaShoppingBag } from "react-icons/fa";

interface OrderPageClientProps {
  items: MenuItem[];
}

export default function OrderPageClient({ items }: OrderPageClientProps) {
  const { totalItems, subtotal, openCart } = useCart();
  const categories = useMemo(() => getCategories(items), [items]);
  const [activeCategory, setActiveCategory] = useState(
    categories[0] || ""
  );

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const offset = 140; // Height of sticky components (navbar + category nav)
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className="w-full min-h-screen bg-secondary pt-24 pb-12 flex flex-col font-body">

      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mt-6">
        <h1 className="font-heading text-4xl text-primary mb-2">ORDER ONLINE</h1>
        <p className="text-text/50 text-sm max-w-lg mb-2 ml-1">
          Fresh, hot, and straight from our kitchen to your door in Dhaka. Choose your favorites below!
        </p>
      </div>

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Menu Sections */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 space-y-12">
        {categories.map((category) => {
          const sectionItems = itemsByCategory[category] || [];
          if (sectionItems.length === 0) return null;

          return (
            <section
              key={category}
              id={`category-${category}`}
              className="space-y-6 scroll-mt-36"
            >
              <h2 className="font-heading text-2xl text-text border-b border-dark-border pb-2.5 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full inline-block" />
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Floating Cart Button (visible if cart has items) */}
      {totalItems > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/90 text-text font-heading flex items-center gap-3 px-5 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 animate-cart-bounce cursor-pointer group"
        >
          <div className="relative">
            <FaShoppingBag size={20} />
            <span className="absolute -top-2.5 -right-2.5 bg-primary text-secondary text-[10px] font-heading w-5 h-5 rounded-full flex items-center justify-center border border-accent">
              {totalItems}
            </span>
          </div>
          <span className="hidden sm:inline-block border-l border-text/20 pl-3">
            
            {subtotal} <span>tk</span>
          </span>
        </button>
      )}
    </div>
  );
}
