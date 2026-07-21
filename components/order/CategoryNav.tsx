"use client";

import { useEffect, useRef, useState } from "react";

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onCategorySelect,
}: CategoryNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Center active tab when it changes
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;

      const containerWidth = container.offsetWidth;
      const tabWidth = tab.offsetWidth;
      const tabLeft = tab.offsetLeft;

      container.scrollTo({
        left: tabLeft - containerWidth / 2 + tabWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-20 z-40 bg-primary/95 backdrop-blur-md border-b border-text shadow-md">
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-4 px-4 md:px-8 scrollbar-hide"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              ref={isActive ? activeTabRef : null}
              onClick={() => onCategorySelect(category)}
              className={`px-5 py-2 font-heading rounded-full text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-accent text-text scale-[1.02]"
                  : "bg-secondary text-text hover:text-secondary hover:bg-accent" 
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
