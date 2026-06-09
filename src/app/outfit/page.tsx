"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

// ─── types ────────────────────────────────────────────────────────────────────

type OutfitItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  image_url: string | null;
};

type OutfitData = {
  outfit_name: string;
  reasoning: string;
  items: OutfitItem[];
};

// ─── fallback placeholder ─────────────────────────────────────────────────────

const FALLBACK_NAME = "The quiet confidence.";
const FALLBACK_REASONING =
  "A considered combination built around restraint. The ivory crew reads effortless against the charcoal weight below — clean contrast, no aggression.";
const FALLBACK_ITEMS: OutfitItem[] = [
  { id: "a", name: "Camel wool coat",    type: "OUTERWEAR", color: "Camel",  image_url: null },
  { id: "b", name: "Ivory ribbed crew",  type: "KNITWEAR",  color: "Ivory",  image_url: null },
  { id: "c", name: "Pleated wide-leg",   type: "TROUSERS",  color: "Slate",  image_url: null },
];

const TILE_GRADS = [
  "linear-gradient(158deg,#3a3a38 0%,#8c8b85 50%,#c8c7c0 100%)",
  "linear-gradient(148deg,#2a2a28 0%,#6a6a65 48%,#aeada7 100%)",
  "linear-gradient(162deg,#1e1e1c 0%,#57564f 46%,#9e9d97 100%)",
];

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

// ─── OutfitPage ───────────────────────────────────────────────────────────────

export default function OutfitPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<OutfitData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(false);

  useEffect(() => {
    const anchor = new URLSearchParams(window.location.search).get("anchor");

    if (anchor) {
      // Anchor flow: generate outfit built around the selected item
      setGenerating(true);
      setOutfit(null);
      fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anchor_item_id: anchor }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) { setGenerateError(true); return; }
          sessionStorage.setItem("mirror_outfit", JSON.stringify(data));
          setOutfit(data as OutfitData);
        })
        .catch(() => setGenerateError(true))
        .finally(() => setGenerating(false));
    } else {
      // Normal flow: read from sessionStorage
      const stored = sessionStorage.getItem("mirror_outfit");
      if (stored) {
        try {
          setOutfit(JSON.parse(stored));
        } catch { /* use fallback */ }
      }
    }
  }, []);

  const isLoading = generating && !outfit;
  const displayName = outfit?.outfit_name || FALLBACK_NAME;
  const displayReasoning = outfit?.reasoning || FALLBACK_REASONING;
  const displayItems = outfit?.items?.length ? outfit.items : FALLBACK_ITEMS;

  const handleWearingThis = useCallback(async () => {
    if (saving || confirmed || !userId) return;
    setSaving(true);
    setError(null);
    try {
      const { error: sbError } = await supabase
        .from("outfit_suggestions")
        .insert({
          user_id: userId,
          items: displayItems.map((p) => p.name),
          reasoning: displayReasoning,
          worn: true,
        });
      if (sbError) throw sbError;
      setConfirmed(true);
      sessionStorage.removeItem("mirror_outfit");
    } catch {
      setError("Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }, [saving, confirmed, userId, displayItems, displayReasoning]);

  const handleShuffle = useCallback(async () => {
    sessionStorage.removeItem("mirror_outfit");
    setOutfit(null);
    setConfirmed(false);
    setError(null);
    try {
      const res = await fetch("/api/outfit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!data.error) {
        sessionStorage.setItem("mirror_outfit", JSON.stringify(data));
        setOutfit(data);
      }
    } catch { /* silent */ }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0E0E",
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
          background: "#0E0E0E",
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
          <span style={{ ...MONO, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>
            9:41
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
              <rect x="0" y="7" width="3" height="4" fill="rgba(255,255,255,0.65)" />
              <rect x="4.3" y="4.5" width="3" height="6.5" fill="rgba(255,255,255,0.65)" />
              <rect x="8.6" y="2" width="3" height="9" fill="rgba(255,255,255,0.65)" />
              <rect x="12.9" y="0" width="3" height="11" fill="rgba(255,255,255,0.65)" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
              <rect x="0.5" y="0.5" width="21" height="11" stroke="rgba(255,255,255,0.65)" strokeWidth="1" fill="none" />
              <rect x="2" y="2" width="16" height="8" fill="rgba(255,255,255,0.65)" />
              <line x1="23" y1="4.5" x2="23" y2="7.5" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="square" />
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
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => router.push("/")}
            aria-label="Back"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="13,4 7,10 13,16" />
            </svg>
          </button>
          <span style={{ ...MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
            TODAY&apos;S LOOK
          </span>
          <button
            aria-label="More options"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 2px", display: "flex", alignItems: "center" }}
          >
            <svg width="20" height="4" viewBox="0 0 20 4" fill="rgba(255,255,255,0.6)" aria-hidden="true">
              <circle cx="2"  cy="2" r="1.5" />
              <circle cx="10" cy="2" r="1.5" />
              <circle cx="18" cy="2" r="1.5" />
            </svg>
          </button>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

          {/* Anchor-flow loading state */}
          {isLoading && (
            <div style={{ padding: "64px 20px 0", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* skeleton name line */}
              <div style={{ height: 44, width: "70%", border: "1px solid rgba(255,255,255,0.18)", background: "transparent" }} />
              {/* skeleton tiles */}
              <div style={{ display: "flex", gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ flex: 1, aspectRatio: "0.75", border: "1px solid rgba(255,255,255,0.18)", background: "transparent" }} />
                ))}
              </div>
              <div style={{ height: 12, width: "55%", border: "1px solid rgba(255,255,255,0.18)", background: "transparent" }} />
              <span style={{ ...MONO, fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const }}>
                BUILDING YOUR LOOK
              </span>
            </div>
          )}

          {/* Anchor-flow error state */}
          {generateError && (
            <div style={{ padding: "64px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{ ...SERIF, fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>
                Couldn&apos;t build the outfit. Try again.
              </span>
              <button
                type="button"
                onClick={() => router.back()}
                style={{ ...SANS, background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", height: 48, fontSize: 12, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase" as const, cursor: "pointer", width: "100%" }}
              >
                GO BACK
              </button>
            </div>
          )}

          {/* outfit content */}
          {!isLoading && !generateError && (
          <><div style={{ padding: "28px 20px 0" }}>
            <p
              style={{
                ...SERIF,
                fontSize: 40,
                fontWeight: 500,
                fontStyle: "italic",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              {displayName}
            </p>
          </div>

          {/* ── tile grid ──────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${displayItems.length}, 1fr)`,
              columnGap: 8,
              padding: "24px 20px 0",
            }}
          >
            {displayItems.map((item, i) => (
              <div key={item.id}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "0.75",
                    background: TILE_GRADS[i % TILE_GRADS.length],
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", top: 0, bottom: 0, left: "54%", width: 1, background: "rgba(255,255,255,0.1)" }} />
                  )}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <span style={{ ...MONO, fontSize: 8, letterSpacing: "0.14em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", display: "block" }}>
                    {item.type.toUpperCase()}
                  </span>
                  <p style={{ ...SERIF, fontSize: 13, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.005em", color: "rgba(255,255,255,0.9)", margin: "3px 0 0" }}>
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── styling note ─────────────────────────────────── */}
          <div style={{ padding: "28px 20px 0" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />
            <p
              style={{
                ...SERIF,
                fontSize: 19,
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.45,
                letterSpacing: "-0.005em",
                color: "rgba(255,255,255,0.72)",
                margin: 0,
              }}
            >
              &ldquo;{displayReasoning}&rdquo;
            </p>
          </div>

          {/* ── action area ──────────────────────────────────── */}
          <div style={{ padding: "28px 20px 0" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />

            {confirmed ? (
              <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.16)" }}>
                <span style={{ ...MONO, fontSize: 13, fontWeight: 500, letterSpacing: "0.18em", color: "#2F7D5B", textTransform: "uppercase" }}>
                  Noted.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleWearingThis}
                disabled={saving}
                style={{
                  ...SANS,
                  width: "100%",
                  height: 56,
                  background: saving ? "rgba(255,255,255,0.55)" : "#FFFFFF",
                  color: "#0E0E0E",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: saving ? "default" : "pointer",
                  transition: "background 0.18s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {saving ? "SAVING…" : "WEARING THIS"}
              </button>
            )}

            {error && (
              <p style={{ ...MONO, fontSize: 10, color: "#B23A33", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 10, marginBottom: 0 }}>
                {error}
              </p>
            )}

            <p style={{ ...MONO, fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", textAlign: "center", margin: "14px 0 16px", lineHeight: 1.5 }}>
              Each outfit you confirm helps Mirror dress you better.
            </p>

            <button
              type="button"
              onClick={handleShuffle}
              style={{
                ...SANS,
                width: "100%",
                height: 52,
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "border-color 0.18s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
                <polyline points="10,1 13,4 10,7" />
                <path d="M1 4h8a4 4 0 0 1 4 4" />
                <polyline points="4,13 1,10 4,7" />
                <path d="M13 10H5a4 4 0 0 1-4-4" />
              </svg>
              SHUFFLE
            </button>

            <div style={{ height: 20 }} />
          </div>
          </>)}
        </main>

        <BottomNav dark />
      </div>
    </div>
  );
}
