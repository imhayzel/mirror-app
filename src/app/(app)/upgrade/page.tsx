import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES_FREE = [
  "3 AI outfit suggestions",
  "1 illustrated render",
  "Full wardrobe management",
  "Style profile (basic)",
  "Item checker (3 uses)",
];

const FEATURES_PREMIUM = [
  "Unlimited AI outfit suggestions",
  "Unlimited illustrated renders",
  "Full wardrobe management",
  "Full style profile + insights",
  "Unlimited item checker",
  "Priority processing",
];

export default function UpgradePage() {
  return (
    <div className="max-w-[800px] mx-auto">
      {/* Header */}
      <div className="mb-10 border-b border-[#0A0A0A] pb-8 text-center">
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-3">
          YOU&apos;VE USED ALL FREE GENERATIONS
        </p>
        <h1 className="font-display text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#0A0A0A]">
          Unlock Mirror
        </h1>
        <p className="font-sans text-[16px] leading-[26px] text-[#5C5C5C] mt-4 max-w-[480px] mx-auto">
          Upgrade to Premium for unlimited AI outfit suggestions, illustrated renders, and deeper style insights.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#0A0A0A] mb-10">
        {/* Free */}
        <div className="bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="free">FREE</Badge>
            <p className="font-display text-[36px] font-semibold leading-[42px] text-[#0A0A0A]">$0</p>
          </div>
          <p className="font-sans text-[13px] text-[#5C5C5C] mb-6">Your current plan</p>
          <ul className="flex flex-col gap-3">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="font-sans text-[14px] leading-[22px] text-[#0A0A0A] flex items-start gap-2">
                <span className="text-[#5C5C5C] mt-0.5">—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className="bg-[#0A0A0A] p-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="premium">PREMIUM</Badge>
            <p className="font-display text-[36px] font-semibold leading-[42px] text-white">
              $8<span className="font-sans font-normal text-[16px] text-white/40">/mo</span>
            </p>
          </div>
          <p className="font-sans text-[13px] text-white/40 mb-6">Billed monthly, cancel anytime</p>
          <ul className="flex flex-col gap-3 mb-8">
            {FEATURES_PREMIUM.map((f) => (
              <li key={f} className="font-sans text-[14px] leading-[22px] text-white flex items-start gap-2">
                <span className="text-[#C8F000] mt-0.5">—</span>
                {f}
              </li>
            ))}
          </ul>
          <Button variant="accent" className="w-full">
            UPGRADE NOW
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/home"
          className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          NOT NOW — GO BACK
        </Link>
      </div>
    </div>
  );
}
