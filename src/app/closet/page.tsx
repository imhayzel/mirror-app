"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getItems, deleteItem, WardrobeItem } from "@/lib/wardrobe";
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

function GarmentCard({
  item,
  idx,
  onDelete,
}: {
  item: WardrobeItem;
  idx: number;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startPress = useCallback(() => {
    pressTimer.current = setTimeout(() => setShowDelete(true), 500);
  }, []);

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
      if (touchStartX.current !== null) {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx < -60) setShowDelete(true);
        touchStartX.current = null;
      }
    },
    [cancelPress]
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

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => { if (!showDelete && !deleting) router.push(`/closet/${item.id}`); }}
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
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteItem(id);
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
            <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true" focusable="false">
              <rect x="0" y="7" width="3" height="4" fill="#0E0E0E" />
              <rect x="4.3" y="4.5" width="3" height="6.5" fill="#0E0E0E" />
              <rect x="8.6" y="2" width="3" height="9" fill="#0E0E0E" />
              <rect x="12.9" y="0" width="3" height="11" fill="#0E0E0E" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true" focusable="false">
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
            Closet
          </span>
          <Link
            href="/add"
            aria-label="Add item"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              color: "#0E0E0E",
              textDecoration: "none",
            }}
          >
            {/* Lucide-style plus — 1.5px stroke, square caps */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#0E0E0E"
              strokeWidth="1.5"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <line x1="10" y1="3" x2="10" y2="17" />
              <line x1="3" y1="10" x2="17" y2="10" />
            </svg>
          </Link>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

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
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
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
          )}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                padding: "52px 24px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  ...SERIF,
                  fontSize: 22,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#3A3A38",
                  margin: 0,
                  lineHeight: 1.35,
                  textAlign: "center",
                }}
              >
                Nothing here yet. Your closet is a blank page.
              </p>
              <Link
                href="/add"
                style={{
                  ...SANS,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 32,
                  padding: "16px 36px",
                  background: "#0E0E0E",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                ADD TO CLOSET
              </Link>
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
                />
              ))}
            </div>
          )}

        </main>

        <BottomNav />

      </div>
    </div>
  );
}
