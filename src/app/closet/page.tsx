"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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

const PLATE_GRADS = [
  "linear-gradient(155deg,#2c2c2a 0%,#7e7d78 55%,#cbcac4 100%)",
  "linear-gradient(155deg,#1b1b1a,#525250,#9b9a95)",
  "linear-gradient(150deg,#3a3a37,#86857f,#bdbcb6)",
  "linear-gradient(160deg,#222221,#6d6c67,#a9a8a2)",
  "linear-gradient(145deg,#45443f,#9a9994,#d2d1cb)",
  "linear-gradient(165deg,#2f2f2c,#73726d)",
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

// ─── GarmentCard ─────────────────────────────────────────────────────────────
// Long press (500ms) OR swipe left (≥60px) reveals delete overlay.
// In pick mode: single tap selects the item as an outfit anchor.

function GarmentCard({
  item,
  idx,
  onDelete,
  pickMode,
}: {
  item: WardrobeItem;
  idx: number;
  onDelete: (id: string) => void;
  pickMode: boolean;
}) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startPress = useCallback(() => {
    if (pickMode) return;
    pressTimer.current = setTimeout(() => setShowDelete(true), 500);
  }, [pickMode]);

  const cancelPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      startPress();
    },
    [startPress]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      cancelPress();
      if (!pickMode && touchStartX.current !== null) {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx < -60) setShowDelete(true);
        touchStartX.current = null;
      }
    },
    [cancelPress, pickMode]
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setDeleting(true);
      await onDelete(item.id);
    },
    [item.id, onDelete]
  );

  const dismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete(false);
  }, []);

  const handleClick = useCallback(() => {
    if (deleting) return;
    if (pickMode) {
      router.push(`/outfit?anchor=${item.id}`);
      return;
    }
    if (!showDelete) router.push(`/closet/${item.id}`);
  }, [deleting, pickMode, showDelete, item.id, router]);

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        opacity: deleting ? 0.4 : 1,
        transition: "opacity 0.24s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* image plate */}
      <div
        style={{
          width: "100%",
          aspectRatio: "0.8",
          position: "relative",
          overflow: "hidden",
          background: item.image_url
            ? undefined
            : PLATE_GRADS[idx % PLATE_GRADS.length],
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "52%",
              width: 1,
              background: "rgba(255,255,255,0.14)",
            }}
          />
        )}

        {/* delete overlay */}
        {showDelete && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(14,14,14,0.76)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <button
              onClick={handleDelete}
              style={{
                ...SANS,
                background: "#B23A33",
                color: "#FFFFFF",
                border: "none",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "12px 0",
                cursor: "pointer",
                width: "72%",
              }}
            >
              REMOVE
            </button>
            <button
              onClick={dismiss}
              style={{
                ...MONO,
                background: "transparent",
                color: "rgba(255,255,255,0.56)",
                border: "1px solid rgba(255,255,255,0.22)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "10px 0",
                cursor: "pointer",
                width: "72%",
              }}
            >
              CANCEL
            </button>
          </div>
        )}
      </div>

      {/* item metadata */}
      <div style={{ paddingTop: 9 }}>
        <span
          style={{
            ...MONO,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "#8C8C86",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          {item.type}
        </span>
        <p
          style={{
            ...SERIF,
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: "#0E0E0E",
            margin: "3px 0 0",
          }}
        >
          {item.name}
        </p>
        {item.color && (
          <span
            style={{
              ...MONO,
              fontSize: 9.5,
              letterSpacing: "0.1em",
              color: "#ABABA4",
              textTransform: "uppercase",
              display: "block",
              marginTop: 4,
            }}
          >
            {item.color}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ClosetPage ───────────────────────────────────────────────────────────────

export default function ClosetPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [loading, setLoading] = useState(true);
  const [pickMode, setPickMode] = useState(false);

  useEffect(() => {
    setPickMode(new URLSearchParams(window.location.search).get("mode") === "pick");
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch('/api/wardrobe')
      .then(async r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await fetch(`/api/wardrobe/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const filtered =
    filter === "ALL"
      ? items
      : items.filter((i) => i.type === FILTER_TO_TYPE[filter]);

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
            Closet
          </span>
          <Link
            href="/checker"
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: "0.16em",
              color: "#6B6B66",
              textDecoration: "none",
            }}
          >
            BUY?
          </Link>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 144 }}>

          {/* stats */}
          <div style={{ padding: "20px 20px 14px" }}>
            <p
              style={{
                ...SERIF,
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "#0E0E0E",
                margin: 0,
              }}
            >
              {loading ? "—" : `${items.length} piece${items.length !== 1 ? "s" : ""}.`}
            </p>
            {!loading && items.length > 0 && (
              <span
                style={{
                  ...MONO,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#8C8C86",
                  display: "block",
                  marginTop: 7,
                }}
              >
                YOUR WARDROBE
              </span>
            )}
          </div>

          {/* pick-mode banner */}
          {pickMode && (
            <div
              style={{
                padding: "12px 20px",
                background: "#0E0E0E",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  flex: 1,
                }}
              >
                Tap any piece to build an outfit around it
              </span>
            </div>
          )}

          {/* filter pills — horizontal scroll, pill shape exempt via rounded-full */}
          <div
            style={{
              display: "flex",
              gap: 9,
              overflowX: "auto",
              padding: "4px 20px 18px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...MONO,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  border: "1px solid",
                  padding: "9px 17px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s cubic-bezier(0.22,1,0.36,1)",
                  background: filter === f ? "#0E0E0E" : "transparent",
                  color: filter === f ? "#F3F2EF" : "#0E0E0E",
                  borderColor: "#0E0E0E",
                  textTransform: "uppercase",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* loading */}
          {loading && (
            <div style={{ padding: "0 20px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 14, rowGap: 24 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: "100%", aspectRatio: "0.8", border: "1px solid #0E0E0E", background: "transparent" }} />
              ))}
            </div>
          )}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "24px 20px 0" }}>
              <span
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "#ABABA4",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                NOTHING HERE YET.
              </span>
            </div>
          )}

          {/* 2-column grid */}
          {!loading && filtered.length > 0 && (
            <div
              style={{
                padding: "0 20px 28px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 14,
                rowGap: 24,
              }}
            >
              {filtered.map((item, idx) => (
                <GarmentCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  onDelete={handleDelete}
                  pickMode={pickMode}
                />
              ))}
            </div>
          )}

        </main>

        {/* Pinned CTA — add in normal mode, cancel in pick mode */}
        {pickMode ? (
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              ...SANS,
              position: "fixed",
              bottom: 64,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 390,
              height: 56,
              background: "transparent",
              color: "#0E0E0E",
              border: "1px solid rgba(14,14,14,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              zIndex: 40,
            }}
          >
            CANCEL
          </button>
        ) : (
          <Link
            href="/add"
            style={{
              ...SANS,
              position: "fixed",
              bottom: 64,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 390,
              height: 56,
              background: "#0E0E0E",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              zIndex: 40,
            }}
          >
            ADD TO CLOSET →
          </Link>
        )}

        <BottomNav />

      </div>
    </div>
  );
}
