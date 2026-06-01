"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ITEM_TYPES = [
  "TOP", "BOTTOM", "DRESS", "OUTERWEAR",
  "SHOES", "BAG", "ACCESSORY", "OTHER",
];

const COLORS = [
  "BLACK", "WHITE", "GREY", "NAVY", "BEIGE",
  "BROWN", "GREEN", "RED", "BLUE", "PINK", "YELLOW", "OTHER",
];

export default function AddItemPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [dragging, setDragging] = useState(false);

  return (
    <div className="max-w-[720px]">
      {/* Header */}
      <div className="mb-8 border-b border-[#0A0A0A] pb-6">
        <Link
          href="/wardrobe"
          className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors mb-4 inline-block"
        >
          ← WARDROBE
        </Link>
        <h1 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A]">
          Add Item
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Photo upload */}
        <div>
          <Label className="block mb-3">PHOTO</Label>
          <div
            className={`border-2 border-dashed border-[#0A0A0A] bg-white flex flex-col items-center justify-center h-[280px] cursor-pointer transition-colors ${
              dragging ? "bg-[#E8E8E3]" : "hover:bg-[#F5F5F0]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          >
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-2">
              DRAG & DROP OR CLICK TO UPLOAD
            </p>
            <p className="font-sans text-[11px] text-[#5C5C5C]">PNG, JPG up to 10MB</p>
          </div>
        </div>

        {/* Item name */}
        <div>
          <Label htmlFor="item-name" className="block mb-3">
            ITEM NAME
          </Label>
          <Input id="item-name" placeholder="e.g. Oversized Blazer" />
        </div>

        {/* Item type */}
        <div>
          <Label className="block mb-3">TYPE</Label>
          <div className="flex flex-wrap gap-2">
            {ITEM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-[10px] py-2 border transition-colors ${
                  selectedType === type
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#E8E8E3]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <Label className="block mb-3">PRIMARY COLOR</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-[10px] py-2 border transition-colors ${
                  selectedColor === color
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#E8E8E3]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Brand (optional) */}
        <div>
          <Label htmlFor="brand" className="block mb-3">
            BRAND <span className="text-[#5C5C5C] normal-case tracking-normal font-normal">(optional)</span>
          </Label>
          <Input id="brand" placeholder="e.g. Arket, Cos, Uniqlo" />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2 border-t border-[#0A0A0A]">
          <Button variant="secondary" className="flex-1" asChild>
            <Link href="/wardrobe">CANCEL</Link>
          </Button>
          <Button variant="primary" className="flex-1">
            SAVE ITEM
          </Button>
        </div>
      </div>
    </div>
  );
}
