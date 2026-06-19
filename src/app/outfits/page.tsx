"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// ─── types ────────────────────────────────────────────────────────────────────

type OutfitItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  image_url: string | null;
};

type OutfitSuggestion = {
  id: string;
  items: (OutfitItem | string)[] | null;
  reasoning: string | null;
  worn: boolean | null;
  created_at: string;
};

// ─── helpers ──────────────────────────────────────────────────────────────────

// Handles legacy DB records where items were stored as plain strings
function normalizeItem(item: OutfitItem | string): OutfitItem {
  if (typeof item === 'string') return { id: '', name: item, type: '', color: null, image_url: null };
  return item;
}


function outfitLabel(outfit: OutfitSuggestion): string {
  const items = (outfit.items ?? []).map(normalizeItem);
  if (items.length >= 2) return `${items[0].name} × ${items[1].name}`;
  if (items.length === 1) return items[0].name;
  return "Untitled look";
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();
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

function OutfitCard({ outfit }: { outfit: OutfitSuggestion }) {
  const router = useRouter();
  const items = (outfit.items ?? []).map(normalizeItem);
  // Always show up to 3 columns; pad with empty placeholders if fewer items
  const columns: OutfitItem[] = items.length > 0
    ? items.slice(0, 3)
    : [{ id: "", name: "", type: "", color: null, image_url: null }];

  const handleTap = useCallback(() => {
    const outfitData = {
      outfit_name: outfitLabel(outfit),
      reasoning: outfit.reasoning ?? "",
      items,
    };
    sessionStorage.setItem("mirror_outfit", JSON.stringify(outfitData));
    router.push("/outfit");
  }, [outfit, items, router]);

  return (
    <div onClick={handleTap} style={{ cursor: "pointer" }}>
      {/* image plate — side-by-side columns, no background gradient */}
      <div
        style={{
          width: "100%",
          aspectRatio: "0.75",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {columns.map((item, i) => (
          <div key={item.id || i} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "#F3F2EF", border: "1px solid #0E0E0E" }} />
            )}
          </div>
        ))}

        {/* worn indicator */}
        {outfit.worn && (
          <div style={{ position: "absolute", top: 8, left: 8 }}>
            <span
              style={{
                ...MONO,
                fontSize: 8,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                background: "rgba(14,14,14,0.55)",
                padding: "3px 6px",
                display: "block",
              }}
            >
              WORN
            </span>
          </div>
        )}
      </div>

      {/* metadata */}
      <div style={{ paddingTop: 8 }}>
        <p style={{ ...SANS, fontSize: 13, fontWeight: 500, lineHeight: 1.3, color: "#0E0E0E", margin: "0 0 4px" }}>
          {outfitLabel(outfit)}
        </p>
        <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#8C8C86", textTransform: "uppercase", display: "block" }}>
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
  emptyHeadline,
  emptySubline,
}: {
  kicker: string;
  outfits: OutfitSuggestion[];
  emptyHeadline: string;
  emptySubline: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      {/* kicker + rule */}
      {kicker && (
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
            <div style={{ flex: 1, height: 1, background: "rgba(14,14,14,0.10)" }} />
          </div>
        </div>
      )}

      {outfits.length === 0 ? (
        <div style={{ padding: "4px 20px 0" }}>
          <p
            style={{
              ...SERIF,
              fontSize: 24,
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.2,
              color: "#ABABA4",
              margin: "0 0 8px",
            }}
          >
            {emptyHeadline}
          </p>
          <span
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: "0.12em",
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
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── OutfitsPage ──────────────────────────────────────────────────────────────

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/outfits")
      .then(async (res) => {
        if (!res.ok) { console.error("[outfits] fetch error:", await res.text()); return; }
        const data = await res.json();
        if (Array.isArray(data)) {
          setOutfits(data.map((o: OutfitSuggestion) => ({
            ...o,
            items: (o.items ?? []).map(normalizeItem),
          })));
        }
      })
      .catch((err) => console.error("[outfits] network error:", err))
      .finally(() => setLoading(false));
  }, []);

  const confirmed = outfits.filter((o) => o.worn === true);

  return (
    <div style={{ minHeight: "100vh", background: "#F3F2EF", display: "flex", justifyContent: "center" }}>
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
          <span style={{ ...MONO, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", color: "#0E0E0E" }}>
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
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#0E0E0E",
              lineHeight: 1,
            }}
          >
            Outfits.
          </span>
          {/* CTA in Archivo uppercase — distinct from mono labels */}
          <Link
            href="/"
            style={{
              ...SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0E0E0E",
              textDecoration: "none",
            }}
          >
            GET TODAY&apos;S →
          </Link>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
          {loading ? (
            <div style={{ padding: "64px 20px", display: "flex", justifyContent: "center" }}>
              <span style={{ ...MONO, fontSize: 11, letterSpacing: "0.14em", color: "#8C8C86" }}>
                LOADING
              </span>
            </div>
          ) : (
            <div style={{ paddingTop: 28 }}>
              <Section
                kicker=""
                outfits={confirmed}
                emptyHeadline="Nothing confirmed yet."
                emptySubline="Wear today's outfit to start."
              />
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
