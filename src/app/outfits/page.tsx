"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

// ─── types ────────────────────────────────────────────────────────────────────

type OutfitSuggestion = {
  id: string;
  items: string[] | null;
  reasoning: string | null;
  worn: boolean | null;
  created_at: string;
};

// ─── helpers ──────────────────────────────────────────────────────────────────

const TILE_GRADS = [
  "linear-gradient(158deg,#3a3a38 0%,#8c8b85 50%,#c8c7c0 100%)",
  "linear-gradient(148deg,#2a2a28 0%,#6a6a65 48%,#aeada7 100%)",
  "linear-gradient(162deg,#1e1e1c 0%,#57564f 46%,#9e9d97 100%)",
  "linear-gradient(155deg,#2c2c2a 0%,#7e7d78 55%,#cbcac4 100%)",
  "linear-gradient(150deg,#3a3a37,#86857f,#bdbcb6)",
  "linear-gradient(160deg,#222221,#6d6c67,#a9a8a2)",
];

function outfitLabel(outfit: OutfitSuggestion): string {
  const items = outfit.items ?? [];
  if (items.length >= 2) return `${items[0]} × ${items[1]}`;
  if (items.length === 1) return items[0];
  return "Untitled look";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

// ─── style constants ──────────────────────────────────────────────────────────

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'SFMono-Regular', monospace",
};
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
};
const SANS: React.CSSProperties = {
  fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
};

// ─── OutfitCard ───────────────────────────────────────────────────────────────

function OutfitCard({
  outfit,
  idx,
  showSuggestedTag,
}: {
  outfit: OutfitSuggestion;
  idx: number;
  showSuggestedTag: boolean;
}) {
  return (
    <div>
      {/* image plate */}
      <div
        style={{
          width: "100%",
          aspectRatio: "0.75",
          background: TILE_GRADS[idx % TILE_GRADS.length],
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "53%",
            width: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "28%",
            width: 1,
            background: "rgba(255,255,255,0.07)",
          }}
        />
        {showSuggestedTag && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <span
              style={{
                ...MONO,
                fontSize: 8,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                background: "rgba(14,14,14,0.5)",
                padding: "3px 6px",
                display: "block",
              }}
            >
              SUGGESTED
            </span>
          </div>
        )}
      </div>

      {/* metadata */}
      <div style={{ paddingTop: 8 }}>
        <p
          style={{
            ...SERIF,
            fontSize: 14,
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.2,
            letterSpacing: "-0.005em",
            color: "#0E0E0E",
            margin: "0 0 4px",
          }}
        >
          {outfitLabel(outfit)}
        </p>
        <span
          style={{
            ...MONO,
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "#8C8C86",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          {formatDate(outfit.created_at)}
        </span>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  kicker,
  outfits,
  showSuggestedTag,
  emptyHeadline,
  emptySubline,
}: {
  kicker: string;
  outfits: OutfitSuggestion[];
  showSuggestedTag: boolean;
  emptyHeadline: string;
  emptySubline: string;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* kicker + rule */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              ...MONO,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8C8C86",
              flexShrink: 0,
            }}
          >
            {kicker}
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(14,14,14,0.1)" }} />
        </div>
      </div>

      {outfits.length === 0 ? (
        <div style={{ padding: "8px 20px 0" }}>
          <p
            style={{
              ...SERIF,
              fontSize: 18,
              fontStyle: "italic",
              color: "#ABABA4",
              margin: "0 0 6px",
              lineHeight: 1.3,
            }}
          >
            {emptyHeadline}
          </p>
          <span
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "#C9C8C2",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            {emptySubline}
          </span>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 10,
            rowGap: 20,
            padding: "0 20px",
          }}
        >
          {outfits.map((outfit, i) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              idx={i}
              showSuggestedTag={showSuggestedTag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── OutfitsPage ──────────────────────────────────────────────────────────────

export default function OutfitsPage() {
  const router = useRouter();
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("outfit_suggestions")
      .select("*")
      .eq("user_id", "demo-user")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("[outfits] fetch error:", error);
        setOutfits((data as OutfitSuggestion[]) ?? []);
        setLoading(false);
      });
  }, []);

  const confirmed = outfits.filter((o) => o.worn === true);
  const suggested = outfits.filter((o) => !o.worn);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F2EF",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#F3F2EF",
        }}
      >
        {/* ── Status bar ── */}
        <div
          style={{
            height: 44,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              ...MONO,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "#0E0E0E",
            }}
          >
            9:41
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
              <rect x="0" y="7" width="3" height="4" fill="#0E0E0E" />
              <rect x="4.3" y="4.5" width="3" height="6.5" fill="#0E0E0E" />
              <rect x="8.6" y="2" width="3" height="9" fill="#0E0E0E" />
              <rect x="12.9" y="0" width="3" height="11" fill="#0E0E0E" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
              <rect x="0.5" y="0.5" width="21" height="11" stroke="#0E0E0E" strokeWidth="1" fill="none" />
              <rect x="2" y="2" width="16" height="8" fill="#0E0E0E" />
              <line x1="23" y1="4.5" x2="23" y2="7.5" stroke="#0E0E0E" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </div>
        </div>

        {/* ── Top bar ── */}
        <header
          style={{
            height: 52,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderBottom: "1px solid rgba(14,14,14,0.12)",
          }}
        >
          <span
            style={{
              ...SERIF,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#0E0E0E",
              lineHeight: 1,
            }}
          >
            Your Lookbook.
          </span>
          <button
            onClick={() => router.push("/outfit")}
            style={{
              ...MONO,
              background: "none",
              border: "none",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "#0E0E0E",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
              fontWeight: 500,
            }}
          >
            BUILD A LOOK →
          </button>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

          {loading ? (
            <div
              style={{
                padding: "64px 20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "#8C8C86",
                }}
              >
                LOADING
              </span>
            </div>
          ) : (
            <div style={{ paddingTop: 28 }}>
              <Section
                kicker="CONFIRMED"
                outfits={confirmed}
                showSuggestedTag={false}
                emptyHeadline="Nothing confirmed yet."
                emptySubline="Start with today's outfit."
              />
              <Section
                kicker="SUGGESTED"
                outfits={suggested}
                showSuggestedTag={true}
                emptyHeadline="No suggestions yet."
                emptySubline="Get today's outfit to start."
              />
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
