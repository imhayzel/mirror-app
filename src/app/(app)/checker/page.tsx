"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ItemCheckerPage() {
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<"url" | "upload">("url");

  return (
    <div className="max-w-[720px]">
      {/* Header */}
      <div className="mb-8 border-b border-[#0A0A0A] pb-6">
        <h1 className="font-display text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#0A0A0A]">
          Should I Buy This?
        </h1>
        <p className="font-sans text-[16px] leading-[26px] text-[#5C5C5C] mt-3">
          Paste a product URL or upload a photo. Mirror will tell you if it fits your wardrobe.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-px mb-8">
        {(["url", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 h-[52px] font-sans text-[13px] font-semibold uppercase tracking-[0.08em] border transition-colors ${
              mode === m
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                : "bg-white text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#E8E8E3]"
            }`}
          >
            {m === "url" ? "PASTE URL" : "UPLOAD IMAGE"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <div className="flex flex-col gap-6">
          <div>
            <Label htmlFor="product-url" className="block mb-3">
              PRODUCT URL
            </Label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button variant="accent" disabled={!url} className="w-full">
            ANALYSE THIS ITEM
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
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
          <Button variant="accent" className="w-full">
            ANALYSE THIS ITEM
          </Button>
        </div>
      )}

      {/* Result area — shown after AI response */}
      {/* <div className="mt-10 border-t border-[#0A0A0A] pt-8">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-4">MIRROR SAYS</p>
        <div className="bg-[#0A0A0A] text-white p-6">
          <p className="font-display text-[24px] font-semibold leading-[30px] mb-4">Yes — with reservations.</p>
          <p className="font-sans text-[14px] leading-[22px] text-[#D4D4CF]">...</p>
        </div>
      </div> */}
    </div>
  );
}
