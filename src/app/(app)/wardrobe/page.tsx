"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WardrobeItemCard } from "@/components/mirror/wardrobe-item-card";

const CATEGORIES = ["ALL", "TOPS", "BOTTOMS", "OUTERWEAR", "SHOES", "ACCESSORIES"] as const;
type Category = (typeof CATEGORIES)[number];

const PLACEHOLDER_ITEMS = [
  { id: "1", name: "White Oxford Shirt",   type: "TOPS",        color: "#F0F0EB" },
  { id: "2", name: "Black Trousers",        type: "BOTTOMS",     color: "#1C1C1C" },
  { id: "3", name: "Camel Coat",            type: "OUTERWEAR",   color: "#C4956A" },
  { id: "4", name: "White Sneakers",        type: "SHOES",       color: "#F5F5F0" },
  { id: "5", name: "Navy Crewneck",         type: "TOPS",        color: "#2C3E5A" },
  { id: "6", name: "Grey Chinos",           type: "BOTTOMS",     color: "#8A8A84" },
  { id: "7", name: "Black Derby",           type: "SHOES",       color: "#0A0A0A" },
  { id: "8", name: "Stripe Linen Scarf",    type: "ACCESSORIES", color: "#E8E8E3" },
];

export default function WardrobePage() {
  const [activeFilter, setActiveFilter] = useState<Category>("ALL");

  const filtered =
    activeFilter === "ALL"
      ? PLACEHOLDER_ITEMS
      : PLACEHOLDER_ITEMS.filter((item) => item.type === activeFilter);

  const isEmpty = filtered.length === 0;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-[#0A0A0A]">
        <h1 className="font-display text-[40px] md:text-[56px] font-bold leading-[44px] md:leading-[60px] tracking-[-0.02em] text-[#0A0A0A]">
          Wardrobe
        </h1>
        {/* Accent button — one accent use on this screen */}
        <Button variant="accent" asChild>
          <Link href="/wardrobe/add">+ ADD ITEM</Link>
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-6 px-6 md:mx-0 md:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeFilter;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={[
                "shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.1em]",
                "px-[10px] py-[6px] border border-[#0A0A0A] transition-colors",
                isActive
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-white text-[#0A0A0A] hover:bg-[#E8E8E3]",
              ].join(" ")}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="border border-[#D4D4CF] bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
          <h2 className="font-display text-[40px] md:text-[56px] font-bold leading-[44px] md:leading-[60px] tracking-[-0.02em] text-[#0A0A0A] mb-4">
            YOUR WARDROBE<br />IS EMPTY
          </h2>
          <p className="font-sans text-[14px] leading-[22px] text-[#5C5C5C] mb-8 max-w-[280px]">
            Add your first item to start getting AI outfit suggestions.
          </p>
          <Button variant="primary" asChild>
            <Link href="/wardrobe/add">ADD YOUR FIRST ITEM</Link>
          </Button>
        </div>
      ) : (
        /* Wardrobe grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[2px] bg-[#0A0A0A]">
          {filtered.map((item) => (
            <WardrobeItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              type={item.type}
              placeholderColor={item.color}
            />
          ))}
        </div>
      )}

      {/* Item count */}
      {!isEmpty && (
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mt-4">
          {filtered.length} ITEM{filtered.length !== 1 ? "S" : ""}
          {activeFilter !== "ALL" ? ` — ${activeFilter}` : ""}
        </p>
      )}
    </div>
  );
}
