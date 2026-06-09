"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WardrobeItem } from "@/lib/wardrobe";
import BottomNav from "@/components/BottomNav";

// ─── constants ────────────────────────────────────────────────────────────────

type FilterKey = "ALL" | "TOPS" | "BOTTOMS" | "OUTERWEAR" | "SHOES" | "ACCESSORIES";

const FILTER_TO_TYPE: Record<FilterKey, string | null> = {
  ALL: null,
  TOPS: "top",
  BOTTOMS: "bottom",
  OUTERWEAR: "outerwear",
  SHOES: "shoes",
  ACCESSORIES: "accessory",
};

const FILTERS: FilterKey[] = ["ALL", "TOPS", "BOTTOMS", "OUTERWEAR", "SHOES", "ACCESSORIES"];

// ─── SelectPiecePage ──────────────────────────────────────────────────────────

export default function SelectPiecePage() {
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/wardrobe")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data as WardrobeItem[]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL" ? items : items.filter((i) => i.type === FILTER_TO_TYPE[filter]);

  const handleBuild = useCallback(() => {
    if (!selectedId || generating) return;
    setGenerating(true);
    router.push(`/outfit?anchor=${selectedId}`);
  }, [selectedId, generating, router]);

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col bg-[#F3F2EF]">

        {/* ── Top bar ── */}
        <header className="h-[52px] px-6 flex items-center justify-between shrink-0 border-b border-[rgba(14,14,14,0.12)]">
          <button
            onClick={() => router.back()}
            className="bg-transparent border-none cursor-pointer p-0 flex items-center"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="13,4 7,10 13,16" />
            </svg>
          </button>
          <span className="font-mono-label text-[10px] text-[#0E0E0E]">
            SELECT A PIECE
          </span>
          <div className="w-5" />
        </header>

        {/* ── Subheading ── */}
        <div className="px-6 pt-6 pb-5 shrink-0">
          <p className="font-display italic text-[26px] leading-[1.15] text-[#0E0E0E] m-0">
            Mirror will build around it.
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex gap-[9px] overflow-x-auto px-5 pb-4 shrink-0 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "font-mono-label text-[11px] border px-[17px] py-[9px] rounded-full whitespace-nowrap cursor-pointer transition-colors duration-[180ms]",
                filter === f
                  ? "bg-[#0E0E0E] text-[#F3F2EF] border-[#0E0E0E]"
                  : "bg-transparent text-[#0E0E0E] border-[#0E0E0E]",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Scrollable grid ── */}
        <main className="flex-1 overflow-y-auto pb-36 px-5 pt-2">
          {loading ? (
            <div className="flex items-center justify-center pt-16">
              <span className="font-mono-label text-[11px] text-[#8C8C86]">LOADING</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="pt-12">
              <p className="font-display italic text-[22px] leading-snug text-[#ABABA4] m-0">
                Nothing in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-[14px] gap-y-6">
              {filtered.map((item) => {
                const selected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId((prev) => (prev === item.id ? null : item.id))}
                    className="cursor-pointer"
                  >
                    {/* image plate */}
                    <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#2c2c2a]">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* selected label */}
                    {selected && (
                      <div className="mt-1.5">
                        <span className="font-mono-label text-[9px] text-[#0E0E0E] bg-[#F3F2EF] border border-[#0E0E0E] px-2 py-0.5 inline-block">
                          SELECTED
                        </span>
                      </div>
                    )}

                    {/* metadata */}
                    <div className="pt-[9px]">
                      <span className="font-mono-label text-[9px] text-[#8C8C86] block">
                        {item.type}
                      </span>
                      <p className="font-display text-[17px] font-medium leading-tight tracking-[-0.01em] text-[#0E0E0E] mt-0.5 mb-0">
                        {item.name}
                      </p>
                      {item.color && (
                        <span className="font-mono-label text-[9px] text-[#ABABA4] block mt-1">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ── CTA — only visible when an item is selected ── */}
        {selectedId && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40">
            <button
              onClick={handleBuild}
              disabled={generating}
              className="w-full h-[52px] bg-[#0E0E0E] text-[#F3F2EF] font-sans text-[13px] font-semibold uppercase tracking-[0.22em] border-none cursor-pointer disabled:opacity-50"
            >
              {generating ? "BUILDING…" : "BUILD THIS LOOK →"}
            </button>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
