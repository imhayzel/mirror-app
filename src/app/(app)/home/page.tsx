"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OutfitResultCard } from "@/components/mirror/outfit-result-card";

export default function HomePage() {
  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between mb-10 border-b border-[#0A0A0A] pb-8">
        <div>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-2">
            TUESDAY, 27 MAY
          </p>
          <h1 className="font-display text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#0A0A0A]">
            Good morning.
          </h1>
        </div>
        <Button variant="accent" asChild>
          <Link href="/wardrobe/add">+ ADD ITEM</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        {/* Outfit suggestion */}
        <div>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-4">
            TODAY&apos;S SUGGESTION
          </p>
          <OutfitResultCard
            reasoning="A clean, editorial combination that balances the oversized blazer with slim trousers. The white tee grounds the look without competing. Monochrome keeps it sharp."
            outfitItems={["OVERSIZED BLAZER", "SLIM TROUSERS", "WHITE TEE", "LEATHER LOAFERS"]}
            onGetRender={() => {}}
          />
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" className="flex-1">REGENERATE</Button>
            <Button variant="primary" className="flex-1" asChild>
              <Link href="/wardrobe/outfit">VIEW FULL OUTFIT</Link>
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex flex-col gap-px">
          <div className="bg-white border border-[#0A0A0A] p-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-1">
              WARDROBE
            </p>
            <p className="font-display text-[36px] font-semibold leading-[42px] text-[#0A0A0A]">
              0
            </p>
            <p className="font-sans text-[13px] text-[#5C5C5C] mt-1">items</p>
          </div>
          <div className="bg-white border border-[#0A0A0A] p-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-1">
              AI USES REMAINING
            </p>
            <p className="font-display text-[36px] font-semibold leading-[42px] text-[#0A0A0A]">
              3
            </p>
            <p className="font-sans text-[13px] text-[#5C5C5C] mt-1">free tier</p>
          </div>
          <div className="bg-white border border-[#0A0A0A] p-6 flex flex-col gap-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C]">
              QUICK ACTIONS
            </p>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/wardrobe">VIEW WARDROBE</Link>
            </Button>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/checker">SHOULD I BUY THIS?</Link>
            </Button>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/style">MY STYLE PROFILE</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
