"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OutfitResultCard } from "@/components/mirror/outfit-result-card";

export default function OutfitResultPage() {
  return (
    <div className="max-w-[800px]">
      {/* Header */}
      <div className="mb-8 border-b border-[#0A0A0A] pb-6 flex items-center justify-between">
        <div>
          <Link
            href="/home"
            className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors mb-4 inline-block"
          >
            ← TODAY
          </Link>
          <h1 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A]">
            Today&apos;s Outfit
          </h1>
        </div>
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C]">
          TUE, 27 MAY
        </p>
      </div>

      <OutfitResultCard
        reasoning="A clean, editorial combination that balances the oversized blazer with slim trousers. The white tee grounds the look without competing with the structured outerwear. Monochrome with a hint of texture keeps it sharp and versatile — office-ready but not corporate."
        outfitItems={["OVERSIZED BLAZER", "SLIM TROUSERS", "WHITE TEE", "LEATHER LOAFERS"]}
        onGetRender={() => {}}
        className="mb-6"
      />

      {/* Action row */}
      <div className="flex gap-4">
        <Button variant="secondary" className="flex-1">REGENERATE OUTFIT</Button>
        <Button variant="secondary" className="flex-1" asChild>
          <Link href="/wardrobe">VIEW WARDROBE</Link>
        </Button>
      </div>
    </div>
  );
}
