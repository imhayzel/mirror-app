import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StyleProfilePage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b border-[#0A0A0A] pb-6">
        <h1 className="font-display text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#0A0A0A]">
          Style Profile
        </h1>
      </div>

      {/* Empty state — shown when wardrobe has < 3 items */}
      <div className="border border-[#D4D4CF] bg-white flex flex-col items-center justify-center py-24 text-center mb-10">
        <p className="font-display text-[24px] font-semibold leading-[30px] text-[#0A0A0A] mb-3">
          Add 3 items to unlock your Style Profile
        </p>
        <p className="font-sans text-[14px] leading-[22px] text-[#5C5C5C] mb-6 max-w-[320px]">
          Mirror analyses your wardrobe to infer your style archetype and preferences.
        </p>
        <Button variant="primary" asChild>
          <Link href="/wardrobe/add">ADD ITEMS</Link>
        </Button>
      </div>

      {/* Profile card — shown when wardrobe is populated */}
      {/* <StyleProfileCard
        archetype="Minimal Modernist"
        descriptors={["CLEAN LINES", "MONOCHROME", "STRUCTURED", "UNDERSTATED"]}
        itemCount={24}
        className="mb-8"
      /> */}

      {/* Style breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#0A0A0A]">
        {[
          { label: "DOMINANT PALETTE", value: "—" },
          { label: "MOST-WORN CATEGORY", value: "—" },
          { label: "PREFERRED FIT", value: "—" },
          { label: "STYLE KEYWORDS", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-6 py-5">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
              {stat.label}
            </p>
            <p className="font-display text-[24px] font-semibold leading-[30px] text-[#0A0A0A]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
