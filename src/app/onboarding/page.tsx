"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STYLE_OPTIONS = [
  { id: "minimal", label: "MINIMAL", desc: "Clean lines, neutral palette, nothing unnecessary." },
  { id: "classic", label: "CLASSIC", desc: "Timeless pieces, polished fits, enduring elegance." },
  { id: "streetwear", label: "STREETWEAR", desc: "Bold graphics, relaxed silhouettes, cultural edge." },
  { id: "avant-garde", label: "AVANT-GARDE", desc: "Experimental shapes, unexpected combinations." },
  { id: "bohemian", label: "BOHEMIAN", desc: "Layered textures, earthy tones, free-spirited." },
  { id: "preppy", label: "PREPPY", desc: "Collegiate references, clean colours, tailored." },
];

const OCCASION_OPTIONS = ["EVERYDAY", "WORK", "CASUAL", "EVENING", "ALL OF THE ABOVE"];

const steps = ["STYLE", "OCCASION", "DONE"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 h-[60px] border-b border-[#0A0A0A] bg-white">
        <span className="font-display text-[24px] font-semibold text-[#0A0A0A]">Mirror</span>
        <Link
          href="/"
          className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          EXIT
        </Link>
      </header>

      <div className="flex-1 max-w-[720px] mx-auto w-full px-6 py-12">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-1 w-16 transition-colors ${
                  i <= step ? "bg-[#0A0A0A]" : "bg-[#D4D4CF]"
                }`}
              />
              <span
                className={`font-sans text-[11px] font-semibold uppercase tracking-[0.1em] ${
                  i === step ? "text-[#0A0A0A]" : "text-[#D4D4CF]"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Style */}
        {step === 0 && (
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-3">
              STEP 1 OF 2
            </p>
            <h1 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A] mb-2">
              What describes your style?
            </h1>
            <p className="font-sans text-[14px] leading-[22px] text-[#5C5C5C] mb-8">
              Select all that apply. Mirror uses this to tailor your outfit suggestions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#0A0A0A]">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleStyle(opt.id)}
                  className={`text-left px-6 py-5 transition-colors ${
                    selectedStyles.includes(opt.id)
                      ? "bg-[#0A0A0A] text-white"
                      : "bg-white text-[#0A0A0A] hover:bg-[#E8E8E3]"
                  }`}
                >
                  <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] mb-1">
                    {opt.label}
                  </p>
                  <p
                    className={`font-sans text-[13px] leading-[20px] ${
                      selectedStyles.includes(opt.id) ? "text-white/60" : "text-[#5C5C5C]"
                    }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-8">
              <Button
                variant="primary"
                className="w-full"
                disabled={selectedStyles.length === 0}
                onClick={() => setStep(1)}
              >
                CONTINUE
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Occasion */}
        {step === 1 && (
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-3">
              STEP 2 OF 2
            </p>
            <h1 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A] mb-2">
              What do you dress for most?
            </h1>
            <p className="font-sans text-[14px] leading-[22px] text-[#5C5C5C] mb-8">
              Mirror will prioritise outfit suggestions for this context.
            </p>
            <div className="flex flex-col gap-px bg-[#0A0A0A]">
              {OCCASION_OPTIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`text-left px-6 h-[60px] flex items-center font-sans text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    selectedOccasion === occ
                      ? "bg-[#0A0A0A] text-white"
                      : "bg-white text-[#0A0A0A] hover:bg-[#E8E8E3]"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={() => setStep(0)}>
                BACK
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!selectedOccasion}
                onClick={() => setStep(2)}
              >
                FINISH
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Done */}
        {step === 2 && (
          <div className="text-center">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-3">
              YOU&apos;RE ALL SET
            </p>
            <h1 className="font-display text-[56px] font-bold leading-[60px] tracking-[-0.02em] text-[#0A0A0A] mb-4">
              Welcome to Mirror.
            </h1>
            <p className="font-sans text-[16px] leading-[26px] text-[#5C5C5C] mb-10">
              Start by adding items to your wardrobe. Mirror will get to work.
            </p>
            <Button variant="accent" size="lg" asChild>
              <Link href="/wardrobe/add">ADD YOUR FIRST ITEM</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
