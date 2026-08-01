"use client";

import React, { useState } from "react";
import type { MenuItem } from "@/types";
import { FaPlus, FaMinus } from "react-icons/fa";

export interface SelectedItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  qty: number;
}

interface MenuItemPickerProps {
  menuItems: MenuItem[];
  selectedItems: SelectedItem[];
  onChange: (items: SelectedItem[]) => void;
}

export default function MenuItemPicker({
  menuItems,
  selectedItems,
  onChange,
}: MenuItemPickerProps) {
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] || "All"
  );

  const filteredItems = menuItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const getItemQty = (id: string): number => {
    const found = selectedItems.find((i) => i.menuItemId === id);
    return found ? found.qty : 0;
  };

  const handleUpdateQty = (item: MenuItem, delta: number) => {
    const currentQty = getItemQty(item.id);
    const newQty = Math.max(0, currentQty + delta);

    if (newQty === 0) {
      onChange(selectedItems.filter((i) => i.menuItemId !== item.id));
    } else {
      const existingIdx = selectedItems.findIndex((i) => i.menuItemId === item.id);
      if (existingIdx >= 0) {
        const updated = [...selectedItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: newQty,
        };
        onChange(updated);
      } else {
        onChange([
          ...selectedItems,
          {
            menuItemId: item.id,
            name: item.name,
            unitPrice: item.price,
            qty: newQty,
          },
        ]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Horizontal Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? "bg-[#81241D] text-[#F1E1CE] shadow-sm"
                : "bg-[#FAF2E8] text-[#332218] hover:bg-[#F1E1CE] border border-[#E4CEB8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const qty = getItemQty(item.id);
          const isSelected = qty > 0;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (qty === 0) handleUpdateQty(item, 1);
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? "bg-[#FAF2E8] border-[#81241D] shadow-md ring-1 ring-[#81241D]/30"
                  : "bg-white border-[#E4CEB8] hover:border-[#DEB124]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#332218] truncate">
                  {item.name}
                </div>
                <div className="text-xs font-extrabold text-[#81241D] mt-0.5">
                  ৳{item.price}
                </div>
              </div>

              {/* Stepper (+ / -) */}
              <div
                className="flex items-center gap-1 bg-[#F1E1CE] rounded-xl p-1 border border-[#E4CEB8]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleUpdateQty(item, -1)}
                  disabled={qty === 0}
                  className="w-8 h-8 rounded-lg bg-white disabled:opacity-30 text-[#81241D] font-bold flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                >
                  <FaMinus size={10} />
                </button>

                <span className="w-6 text-center text-xs font-black text-[#332218]">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => handleUpdateQty(item, 1)}
                  className="w-8 h-8 rounded-lg bg-[#81241D] text-[#F1E1CE] font-bold flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
