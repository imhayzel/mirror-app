"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

// ─── types ────────────────────────────────────────────────────────────────────

type LastOutfit = {
  id: string;
  items: string[] | null;
  created_at: string;
};

type OutfitItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  image_url: string | null;
};

type TodaysOutfitData = {
  outfit_name: string;
  reasoning: string;
  items: OutfitItem[];
};

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

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDateKicker(date: Date): string {
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "long" }).toUpperCase();
  const year = date.getFullYear();
  return `${weekday} · ${day} ${month} ${year}`;
}

function formatShortDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();
}

function outfitLabel(items: string[] | null): string {
  if (!items || items.length === 0) return "Untitled look";
  if (items.length === 1) return items[0];
  return `${items[0]} × ${items[1]}`;
}

// ─── ChoiceRow ────────────────────────────────────────────────────────────────

function ChoiceRow({
  label,
  isLast,
  onTap,
}: {
  label: string;
  isLast?: boolean;
  onTap: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onTap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: hovered ? "rgba(14,14,14,0.04)" : "transparent",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid rgba(14,14,14,0.08)",
        cursor: "pointer",
        transition: "background 0.14s cubic-bezier(0.22,1,0.36,1)",
        textAlign: "left",
      }}
    >
      <span
        className="font-display italic"
        style={{
          fontSize: 17,
          fontWeight: 500,
          lineHeight: 1.2,
          color: "#0E0E0E",
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...MONO,
          fontSize: 13,
          color: "#8C8C86",
          flexShrink: 0,
          marginLeft: 12,
        }}
      >
        →
      </span>
    </button>
  );
}

// ─── VibeSheet ────────────────────────────────────────────────────────────────

function VibeSheet({
  prompt,
  placeholder,
  submitLabel,
  onClose,
  onSubmit,
}: {
  prompt: string;
  placeholder: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14,14,14,0.4)",
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 390,
          background: "#FAFAF8",
          borderTop: "1px solid rgba(14,14,14,0.14)",
          zIndex: 50,
          padding: "0 24px 44px",
        }}
      >
        {/* drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 22px" }}>
          <div style={{ width: 32, height: 3, background: "rgba(14,14,14,0.18)" }} />
        </div>

        {/* prompt */}
        <p
          style={{
            ...SERIF,
            fontSize: 26,
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "#0E0E0E",
            margin: "0 0 22px",
          }}
        >
          {prompt}
        </p>

        {/* input */}
        <input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && text.trim() && onSubmit(text)}
          style={{
            ...MONO,
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid rgba(14,14,14,0.18)",
            fontSize: 14,
            letterSpacing: "0.06em",
            color: "#0E0E0E",
            padding: "0 0 14px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 24,
          }}
        />

        {/* submit */}
        <button
          type="button"
          onClick={() => text.trim() && onSubmit(text)}
          style={{
            ...SANS,
            width: "100%",
            height: 52,
            background: text.trim() ? "#0E0E0E" : "rgba(14,14,14,0.12)",
            color: text.trim() ? "#FFFFFF" : "rgba(14,14,14,0.3)",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: text.trim() ? "pointer" : "default",
            transition: "background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const dateKicker = formatDateKicker(new Date());

  useEffect(() => {
    if (isLoaded && !userId) router.replace("/sign-in");
  }, [isLoaded, userId, router]);

  // outfit generation
  const [generatingOutfit, setGeneratingOutfit] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [outfitError, setOutfitError] = useState(false);

  // today's auto-generated outfit
  const [outfitReady, setOutfitReady] = useState(false);
  const [todaysOutfit, setTodaysOutfit] = useState<TodaysOutfitData | null>(null);
  const [wardrobeEmpty, setWardrobeEmpty] = useState(false);
  const autoStarted = useRef(false);

  // sheets
  const [vibeOpen, setVibeOpen] = useState(false);
  const [occasionOpen, setOccasionOpen] = useState(false);

  // last look
  const [lastOutfit, setLastOutfit] = useState<LastOutfit | null>(null);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("outfit_suggestions")
      .select("id, items, created_at")
      .eq("user_id", userId)
      .eq("worn", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setLastOutfit(data[0] as LastOutfit);
      });
  }, [userId]);

  // Auto-generate today's outfit on load
  useEffect(() => {
    if (!userId || autoStarted.current) return;
    autoStarted.current = true;

    const today = new Date().toISOString().split("T")[0];

    // Use cached outfit from this session if it's from today
    const stored = sessionStorage.getItem("mirror_outfit");
    const storedDate = sessionStorage.getItem("mirror_outfit_date");
    if (stored && storedDate === today) {
      try {
        setTodaysOutfit(JSON.parse(stored));
        setOutfitReady(true);
        return;
      } catch { /* corrupt — fall through to re-generate */ }
    }

    // Check wardrobe count before calling AI
    supabase
      .from("wardrobe_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(({ count }) => {
        if ((count ?? 0) === 0) { setWardrobeEmpty(true); return; }

        setGeneratingOutfit(true);
        fetch("/api/outfit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
          .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
          .then(({ ok, data }) => {
            if (data.error === "not_enough_items") { setWardrobeEmpty(true); return; }
            if (data.error === "daily_limit_reached") { setLimitReached(true); return; }
            if (!ok || data.error) { setOutfitError(true); return; }
            const freshToday = new Date().toISOString().split("T")[0];
            sessionStorage.setItem("mirror_outfit", JSON.stringify(data));
            sessionStorage.setItem("mirror_outfit_date", freshToday);
            setTodaysOutfit(data as TodaysOutfitData);
            setOutfitReady(true);
          })
          .catch(() => setOutfitError(true))
          .finally(() => setGeneratingOutfit(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleGenerateOutfit = useCallback(async (context?: string) => {
    if (!userId || generatingOutfit) return;
    setGeneratingOutfit(true);
    setLimitReached(false);
    setOutfitError(false);
    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });
      const data = await res.json();
      if (data.error === "daily_limit_reached") {
        setLimitReached(true);
        return;
      }
      if (data.error === "not_enough_items") {
        router.push("/closet");
        return;
      }
      if (!res.ok || data.error) {
        console.error("[outfit]", data.error);
        setOutfitError(true);
        return;
      }
      sessionStorage.setItem("mirror_outfit", JSON.stringify(data));
      router.push("/outfit");
    } catch (err) {
      console.error("[outfit] fetch failed", err);
      setOutfitError(true);
    } finally {
      setGeneratingOutfit(false);
    }
  }, [userId, generatingOutfit, router]);

  const handleRetry = useCallback(async () => {
    if (generatingOutfit) return;
    setGeneratingOutfit(true);
    setOutfitError(false);
    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.error === "not_enough_items") { setWardrobeEmpty(true); return; }
      if (data.error === "daily_limit_reached") { setLimitReached(true); return; }
      if (!res.ok || data.error) { setOutfitError(true); return; }
      const today = new Date().toISOString().split("T")[0];
      sessionStorage.setItem("mirror_outfit", JSON.stringify(data));
      sessionStorage.setItem("mirror_outfit_date", today);
      setTodaysOutfit(data as TodaysOutfitData);
      setOutfitReady(true);
    } catch { setOutfitError(true); }
    finally { setGeneratingOutfit(false); }
  }, [generatingOutfit]);

  const handleCardTap = useCallback(() => {
    if (wardrobeEmpty) { router.push("/closet"); return; }
    if (outfitReady) { router.push("/outfit"); return; }
    if (outfitError) { handleRetry(); return; }
    if (!generatingOutfit) { handleGenerateOutfit(); }
  }, [wardrobeEmpty, outfitReady, outfitError, generatingOutfit, router, handleRetry, handleGenerateOutfit]);

  const handleVibeSubmit = useCallback((text: string) => {
    setVibeOpen(false);
    handleGenerateOutfit(text);
  }, [handleGenerateOutfit]);

  const handleOccasionSubmit = useCallback((text: string) => {
    setOccasionOpen(false);
    handleGenerateOutfit(text);
  }, [handleGenerateOutfit]);

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
            padding: "0 24px",
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
            Mirror
          </span>
          <span style={{ ...MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "#6B6B66" }}>
            18°
          </span>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

          {/* ── Date kicker ── */}
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid rgba(14,14,14,0.08)",
            }}
          >
            <span
              style={{
                ...MONO,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.14em",
                color: "#8C8C86",
                textTransform: "uppercase",
              }}
            >
              {dateKicker}
            </span>
          </div>

          {/* ══ CARD 1 — Mirror decides ══════════════════════════ */}
          <div style={{ background: "#0E0E0E", padding: "24px 24px 0" }}>

            {/* kicker */}
            <span
              style={{
                ...MONO,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              TODAY&apos;S LOOK
            </span>

            {/* headline */}
            <p
              style={{
                ...SERIF,
                fontSize: 38,
                fontWeight: 500,
                fontStyle: "italic",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                margin: "0 0 20px",
              }}
            >
              Today, the camel coat.
            </p>

            {/* flat lay image / skeleton / obscured preview */}
            {outfitReady && todaysOutfit ? (
              // Obscured preview — item images under dark veil
              <div
                onClick={() => router.push("/outfit")}
                style={{
                  aspectRatio: "4/3",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  marginLeft: -24,
                  marginRight: -24,
                  width: "calc(100% + 48px)",
                } as React.CSSProperties}
              >
                {/* Item tiles */}
                <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                  {todaysOutfit.items.slice(0, 3).map((item, i) => (
                    <div key={item.id} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.05)", display: "block" }}
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${155 + i * 5}deg,#2c2c2a,#7e7d78,#cbcac4)` }} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Dark overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(14,14,14,0.75)" }} />
              </div>
            ) : generatingOutfit ? (
              // Skeleton
              <div style={{ padding: "8px 0 24px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        aspectRatio: "0.75",
                        border: "1px solid #FFFFFF",
                        background: "transparent",
                      }}
                    />
                  ))}
                </div>
                <div style={{ height: 14, width: "68%", border: "1px solid #FFFFFF", background: "transparent", marginBottom: 10 }} />
                <div style={{ height: 10, width: "44%", border: "1px solid #FFFFFF", background: "transparent" }} />
              </div>
            ) : (
              // Default — gradient placeholder
              <div
                style={{
                  aspectRatio: "4/3",
                  position: "relative",
                  overflow: "hidden",
                  marginLeft: -24,
                  marginRight: -24,
                  width: "calc(100% + 48px)",
                } as React.CSSProperties}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(160deg,#3a3a38 0%,#8c8b85 48%,#c8c7c0 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "10px 16px",
                    background: "linear-gradient(to top, rgba(14,14,14,0.55) 0%, transparent 100%)",
                  }}
                >
                  <span
                    style={{
                      ...MONO,
                      fontSize: 9.5,
                      fontWeight: 500,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.92)",
                    }}
                  >
                    TAP TO GENERATE TODAY&apos;S LOOK
                  </span>
                </div>
              </div>
            )}

            {/* Daily limit message or CTA */}
            <div style={{ padding: "16px 0 24px" }}>
              {limitReached ? (
                <div
                  style={{
                    padding: "16px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      ...SERIF,
                      fontSize: 17,
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    You&apos;ve had five looks today. Come back tomorrow.
                  </span>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    RESETS DAILY AT MIDNIGHT
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCardTap}
                  disabled={generatingOutfit}
                  style={{
                    ...SANS,
                    width: "100%",
                    height: 52,
                    background: "#FFFFFF",
                    color: "#0E0E0E",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor: generatingOutfit ? "default" : "pointer",
                    display: "block",
                    opacity: generatingOutfit ? 0.5 : 1,
                    transition: "opacity 0.18s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {wardrobeEmpty
                    ? "ADD ITEMS FIRST"
                    : outfitReady
                    ? "SEE TODAY'S LOOK"
                    : outfitError
                    ? "TRY AGAIN"
                    : generatingOutfit
                    ? "FINDING YOUR LOOK"
                    : "SURPRISE ME"}
                </button>
              )}
            </div>
          </div>

          {/* ══ CARD 2 — You decide ════════════════════════════ */}
          <div
            style={{
              background: "#F3F2EF",
              borderTop: "1px solid rgba(14,14,14,0.12)",
            }}
          >
            {/* kicker */}
            <div style={{ padding: "20px 24px 4px" }}>
              <span
                style={{
                  ...MONO,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: "#8C8C86",
                  textTransform: "uppercase",
                }}
              >
                BUILD YOUR OWN
              </span>
            </div>

            {/* rows */}
            <div style={{ borderTop: "1px solid rgba(14,14,14,0.08)" }}>
              <ChoiceRow
                label="Start with a piece"
                onTap={() => router.push("/closet?mode=pick")}
              />
              <ChoiceRow
                label="I have a vibe"
                onTap={() => setVibeOpen(true)}
              />
              <ChoiceRow
                label="I have an occasion"
                isLast
                onTap={() => setOccasionOpen(true)}
              />
            </div>
          </div>

          {/* ══ LAST LOOK (conditional) ══════════════════════════ */}
          {lastOutfit && (
            <div
              style={{
                background: "#F3F2EF",
                borderTop: "1px solid rgba(14,14,14,0.12)",
                padding: "20px 24px 28px",
              }}
            >
              {/* kicker */}
              <span
                style={{
                  ...MONO,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: "#8C8C86",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 14,
                }}
              >
                LAST LOOK
              </span>

              {/* card — tappable */}
              <button
                type="button"
                onClick={() => router.push("/outfit")}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                }}
              >
                {/* thumb */}
                <div
                  style={{
                    width: 52,
                    height: 66,
                    flexShrink: 0,
                    background: "linear-gradient(155deg,#2c2c2a 0%,#7e7d78 55%,#cbcac4 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "55%",
                      width: 1,
                      background: "rgba(255,255,255,0.14)",
                    }}
                  />
                </div>

                {/* text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      ...SERIF,
                      fontSize: 16,
                      fontWeight: 500,
                      fontStyle: "italic",
                      lineHeight: 1.2,
                      letterSpacing: "-0.005em",
                      color: "#0E0E0E",
                      margin: "0 0 5px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {outfitLabel(lastOutfit.items)}
                  </p>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      color: "#8C8C86",
                      textTransform: "uppercase",
                    }}
                  >
                    {formatShortDate(lastOutfit.created_at)}
                  </span>
                </div>

                {/* arrow */}
                <span style={{ ...MONO, fontSize: 13, color: "#ABABA4", flexShrink: 0 }}>
                  →
                </span>
              </button>
            </div>
          )}

        </main>

        <BottomNav />

        {/* ── Vibe sheet ── */}
        {vibeOpen && (
          <VibeSheet
            prompt="What&apos;s the feeling today?"
            placeholder="relaxed but put together..."
            submitLabel="FIND MY LOOK →"
            onClose={() => setVibeOpen(false)}
            onSubmit={handleVibeSubmit}
          />
        )}

        {/* ── Occasion sheet ── */}
        {occasionOpen && (
          <VibeSheet
            prompt="What&apos;s the occasion?"
            placeholder="dinner, presentation, weekend..."
            submitLabel="DRESS ME FOR THIS →"
            onClose={() => setOccasionOpen(false)}
            onSubmit={handleOccasionSubmit}
          />
        )}

      </div>
    </div>
  );
}
