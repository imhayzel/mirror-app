"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import BottomNav from "@/components/BottomNav";

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

// ─── static data ──────────────────────────────────────────────────────────────

const PALETTE = [
  { hex: "#0E0E0E", name: "COAL" },
  { hex: "#3A3A38", name: "GRAPHITE" },
  { hex: "#C2B89A", name: "ECRU" },
  { hex: "#8C8876", name: "STONE" },
  { hex: "#DEDDD8", name: "ASH" },
];

const OCCASIONS = ["CASUAL", "WORK", "WEEKEND"];

// ─── profile type ─────────────────────────────────────────────────────────────

type StyleProfile = {
  archetype: string;
  descriptors: string[];
};
const SETTINGS_ROWS: { label: string; href: string }[] = [
  { label: "Account",       href: "/settings" },
  { label: "Notifications", href: "/settings" },
  { label: "About Mirror",  href: "/settings" },
];

// ─── types ────────────────────────────────────────────────────────────────────

type Stats = {
  pieces: number;
  outfits: number;
  confirmed: number;
};

// ─── SettingsRow ──────────────────────────────────────────────────────────────

function SettingsRow({ label, href, isLast }: { label: string; href: string; isLast?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
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
        borderBottom: isLast ? "none" : "1px solid rgba(14,14,14,0.08)",
        cursor: "pointer",
        transition: "background 0.14s cubic-bezier(0.22,1,0.36,1)",
        textDecoration: "none",
      }}
    >
      <span
        style={{
          ...MONO,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#0E0E0E",
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
    </Link>
  );
}

// ─── OccasionRow ─────────────────────────────────────────────────────────────

function OccasionRow({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "18px 24px",
        borderTop: "1px solid rgba(14,14,14,0.08)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          ...MONO,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.18em",
          color: "#0E0E0E",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── YouPage ──────────────────────────────────────────────────────────────────

export default function YouPage() {
  const { userId } = useAuth();
  const [stats, setStats] = useState<Stats>({ pieces: 0, outfits: 0, confirmed: 0 });
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [generatingProfile, setGeneratingProfile] = useState(false);

  useEffect(() => {
    if (!userId) return;
    async function fetchAll() {
      const statsRes = await fetch('/api/stats');
      if (!statsRes.ok) return;
      const { pieces, outfits, confirmed, profile: existingProfile } = await statsRes.json();
      setStats({ pieces, outfits, confirmed });
      if (existingProfile) {
        setProfile(existingProfile as StyleProfile);
      } else if (pieces >= 5) {
        // Auto-generate profile when user has 5+ items and no profile yet
        setGeneratingProfile(true);
        try {
          const res = await fetch("/api/style-profile", { method: "POST" });
          const data = await res.json();
          if (!data.error) setProfile({ archetype: data.archetype, descriptors: data.descriptors });
        } catch { /* silent */ }
        finally { setGeneratingProfile(false); }
      }
    }
    fetchAll();
  }, [userId]);

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

        {/* ── Status bar ─────────────────────────────────────── */}
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

        {/* ── Top bar ────────────────────────────────────────── */}
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
            You.
          </span>

          <span style={{ width: 20 }} />
        </header>

        {/* ── Scrollable body ─────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

          {/* ══ STYLE PROFILE CARD ════════════════════════════════ */}
          <div
            style={{
              background: "#0E0E0E",
              padding: "28px 24px 36px",
            }}
          >
            {/* kicker */}
            <span
              style={{
                ...MONO,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.20em",
                color: "rgba(255,255,255,0.36)",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 16,
              }}
            >
              YOUR STYLE
            </span>

            {/* archetype headline */}
            {generatingProfile ? (
              <p style={{ ...MONO, fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: "0 0 28px" }}>
                BUILDING YOUR PROFILE…
              </p>
            ) : (
              <p
                style={{
                  ...SERIF,
                  fontSize: 42,
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.06,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  margin: "0 0 28px",
                }}
              >
                {profile ? `${profile.archetype}.` : "Add 5 items to unlock."}
              </p>
            )}

            {/* descriptor tags */}
            {profile && !generatingProfile && (
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                {profile.descriptors.map((tag, i, arr) => (
                  <span key={tag} style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        ...MONO,
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.16em",
                        color: "rgba(255,255,255,0.55)",
                        textTransform: "uppercase",
                      }}
                    >
                      {tag}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ ...MONO, fontSize: 10, color: "rgba(255,255,255,0.20)", margin: "0 10px" }}>·</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ══ WARDROBE STATS ════════════════════════════════════ */}
          <div
            style={{
              background: "#F3F2EF",
              borderTop: "1px solid rgba(14,14,14,0.0)",
              padding: "28px 24px 32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {[
                { value: stats.pieces, label: "PIECES" },
                { value: stats.outfits, label: "OUTFITS" },
                { value: stats.confirmed, label: "CONFIRMED" },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    paddingLeft: i > 0 ? 20 : 0,
                    paddingRight: i < 2 ? 20 : 0,
                    borderLeft: i > 0 ? "1px solid rgba(14,14,14,0.10)" : "none",
                  }}
                >
                  <span
                    style={{
                      ...SERIF,
                      fontSize: 48,
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      color: "#0E0E0E",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 8,
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      color: "#8C8C86",
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ DOMINANT COLOURS ══════════════════════════════════ */}
          <div
            style={{
              borderTop: "1px solid rgba(14,14,14,0.10)",
              padding: "28px 24px 32px",
              background: "#F3F2EF",
            }}
          >
            {/* kicker */}
            <span
              style={{
                ...MONO,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.20em",
                color: "#8C8C86",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 20,
              }}
            >
              YOUR PALETTE
            </span>

            {/* swatches */}
            <div style={{ display: "flex", gap: 16, flexWrap: "nowrap" }}>
              {PALETTE.map(({ hex, name }) => (
                <div
                  key={hex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: hex,
                      border:
                        hex === "#F3F2EF" || hex === "#DEDDD8"
                          ? "1px solid rgba(14,14,14,0.14)"
                          : "none",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      ...MONO,
                      fontSize: 7.5,
                      letterSpacing: "0.10em",
                      color: "#8C8C86",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ TOP OCCASIONS ═════════════════════════════════════ */}
          <div
            style={{
              borderTop: "1px solid rgba(14,14,14,0.10)",
              background: "#F3F2EF",
            }}
          >
            {/* kicker */}
            <div style={{ padding: "28px 24px 0" }}>
              <span
                style={{
                  ...MONO,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.20em",
                  color: "#8C8C86",
                  textTransform: "uppercase",
                }}
              >
                YOU DRESS FOR
              </span>
            </div>

            {/* occasion rows */}
            <div style={{ marginTop: 16 }}>
              {OCCASIONS.map((occ) => (
                <OccasionRow key={occ} label={occ} />
              ))}
            </div>
          </div>

          {/* ══ SETTINGS ══════════════════════════════════════════ */}
          <div
            style={{
              borderTop: "1px solid rgba(14,14,14,0.10)",
              background: "#F3F2EF",
              marginTop: 8,
            }}
          >
            {/* kicker */}
            <div style={{ padding: "28px 24px 0" }}>
              <span
                style={{
                  ...MONO,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.20em",
                  color: "#8C8C86",
                  textTransform: "uppercase",
                }}
              >
                SETTINGS
              </span>
            </div>

            {/* settings rows */}
            <div
              style={{
                marginTop: 16,
                borderTop: "1px solid rgba(14,14,14,0.08)",
              }}
            >
              {SETTINGS_ROWS.map(({ label, href }, i) => (
                <SettingsRow
                  key={label}
                  label={label}
                  href={href}
                  isLast={i === SETTINGS_ROWS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* bottom breathing room */}
          <div style={{ height: 32 }} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
