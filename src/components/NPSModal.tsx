"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function NPSModal({ onClose }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [bestFeature, setBestFeature] = useState("");
  const [improvement, setImprovement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit = score !== null && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, best_feature: bestFeature, improvement }),
      });
    } catch { /* silent */ }
    setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F3F2EF] max-w-[390px] mx-auto">

      {/* ── Header ── */}
      <div className="px-6 pt-14 pb-8 border-b border-[rgba(14,14,14,0.10)] shrink-0">
        <span className="font-mono-label text-[10px] text-[#0E0E0E] block mb-4">
          A QUICK QUESTION.
        </span>
        <p className="font-display italic text-[28px] leading-[1.15] tracking-[-0.01em] text-[#0E0E0E] m-0">
          It&apos;ll take 30 seconds.
        </p>
      </div>

      {done ? (
        /* ── Thank you state ── */
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="font-display italic text-[26px] text-[#0E0E0E] m-0">
            Thank you.
          </p>
        </div>
      ) : (
        /* ── Questions ── */
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-10">

          {/* Q1 — NPS score */}
          <div>
            <label className="font-mono-label text-[9px] text-[rgba(14,14,14,0.45)] block mb-5">
              HOW LIKELY ARE YOU TO RECOMMEND MIRROR TO A FRIEND?
            </label>
            <div className="flex justify-between">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScore(i)}
                  className={[
                    "rounded-full w-7 h-7 flex items-center justify-center font-mono-label text-[10px] border transition-colors duration-150 shrink-0",
                    score === i
                      ? "bg-[#0E0E0E] text-[#F3F2EF] border-[#0E0E0E]"
                      : "bg-transparent text-[#0E0E0E] border-[rgba(14,14,14,0.30)]",
                  ].join(" ")}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-mono-label text-[8px] text-[rgba(14,14,14,0.30)]">
                NOT LIKELY
              </span>
              <span className="font-mono-label text-[8px] text-[rgba(14,14,14,0.30)]">
                VERY LIKELY
              </span>
            </div>
          </div>

          {/* Q2 — Best feature */}
          <div>
            <label className="font-mono-label text-[9px] text-[rgba(14,14,14,0.45)] block mb-4">
              WHAT&apos;S THE ONE THING MIRROR DOES BEST FOR YOU?
            </label>
            <input
              type="text"
              value={bestFeature}
              onChange={(e) => setBestFeature(e.target.value)}
              placeholder="..."
              className="w-full bg-transparent border-b border-[rgba(14,14,14,0.20)] text-[#0E0E0E] font-sans text-[15px] pb-3 outline-none placeholder:text-[rgba(14,14,14,0.25)]"
            />
          </div>

          {/* Q3 — Improvement */}
          <div>
            <label className="font-mono-label text-[9px] text-[rgba(14,14,14,0.45)] block mb-4">
              WHAT&apos;S THE ONE THING YOU&apos;D WANT MIRROR TO DO BETTER?
            </label>
            <input
              type="text"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="..."
              className="w-full bg-transparent border-b border-[rgba(14,14,14,0.20)] text-[#0E0E0E] font-sans text-[15px] pb-3 outline-none placeholder:text-[rgba(14,14,14,0.25)]"
            />
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {!done && (
        <div className="px-6 pb-10 pt-4 border-t border-[rgba(14,14,14,0.10)] shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              "w-full h-[52px] font-sans text-[13px] font-semibold uppercase tracking-[0.22em] border-none transition-colors duration-150",
              canSubmit
                ? "bg-[#0E0E0E] text-[#F3F2EF] cursor-pointer"
                : "bg-[rgba(14,14,14,0.10)] text-[rgba(14,14,14,0.30)] cursor-default",
            ].join(" ")}
          >
            {submitting ? "SAVING…" : "SUBMIT →"}
          </button>
        </div>
      )}
    </div>
  );
}
