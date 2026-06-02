"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'SFMono-Regular', monospace",
};
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-display), Georgia, serif",
};
const SANS: React.CSSProperties = {
  fontFamily: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
};

const steps = [
  {
    num: "01",
    headline: "Build your closet.",
    body: "Photograph what you own. Mirror catalogues every piece — colour, cut, occasion.",
  },
  {
    num: "02",
    headline: "Mirror learns your taste.",
    body: "AI studies the silhouettes you reach for and the combinations that actually work.",
  },
  {
    num: "03",
    headline: "Get dressed, decided.",
    body: "Each morning, a finished outfit — no deliberating, no second-guessing.",
  },
];

const features = [
  {
    headline: "Daily outfit.",
    body: "AI suggests a complete look every morning, drawn from what you actually own.",
  },
  {
    headline: "Buy smarter.",
    body: "Paste any link. Mirror tells you buy or skip — based on what's already in your wardrobe.",
  },
  {
    headline: "Know your style.",
    body: "An auto-generated style profile that updates as your wardrobe grows.",
  },
];

// ─── BetaGate ─────────────────────────────────────────────────────────────────

function BetaGate({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || checking) return;
    setChecking(true);
    setError(false);
    try {
      const res = await fetch("/api/beta-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const { valid } = await res.json();
      if (valid) {
        router.push("/sign-up");
      } else {
        setError(true);
        setChecking(false);
      }
    } catch {
      setError(true);
      setChecking(false);
    }
  }, [code, checking, router]);

  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14,14,14,0.6)",
          zIndex: 100,
        }}
      />
      {/* sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "#0E0E0E",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          zIndex: 101,
          padding: "0 32px 52px",
        }}
      >
        {/* drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 28px" }}>
          <div style={{ width: 32, height: 3, background: "rgba(255,255,255,0.18)" }} />
        </div>

        <p
          style={{
            ...SERIF,
            fontSize: 28,
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
            margin: "0 0 8px",
          }}
        >
          Beta access.
        </p>
        <p
          style={{
            ...MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.38)",
            textTransform: "uppercase",
            margin: "0 0 32px",
          }}
        >
          ENTER YOUR ACCESS CODE TO CONTINUE
        </p>

        <input
          type="text"
          autoFocus
          placeholder="Access code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            ...SANS,
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${error ? "#B23A33" : "rgba(255,255,255,0.2)"}`,
            color: "#FFFFFF",
            fontSize: 16,
            padding: "0 0 14px",
            outline: "none",
            marginBottom: error ? 8 : 28,
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p
            style={{
              ...MONO,
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "#B23A33",
              textTransform: "uppercase",
              margin: "0 0 24px",
            }}
          >
            THAT CODE ISN&apos;T RECOGNISED.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!code.trim() || checking}
          style={{
            ...SANS,
            width: "100%",
            height: 52,
            background: code.trim() && !checking ? "#FFFFFF" : "rgba(255,255,255,0.12)",
            color: code.trim() && !checking ? "#0E0E0E" : "rgba(255,255,255,0.25)",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: code.trim() && !checking ? "pointer" : "default",
            transition: "background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s",
          }}
        >
          {checking ? "CHECKING…" : "CONTINUE →"}
        </button>
      </div>
    </>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F2EF] text-[#0E0E0E]">

      {/* ── 1. NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10"
        style={{
          background: "#F3F2EF",
          borderBottom: "1px solid rgba(14,14,14,0.12)",
          height: "56px",
        }}
      >
        <span
          className="font-display italic"
          style={{ fontSize: "22px", fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          Mirror
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="font-mono-label transition-colors duration-200 text-[#6B6B66] hover:text-[#0E0E0E]"
            style={{ ...MONO, fontSize: "11px" }}
          >
            SIGN IN
          </Link>
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="font-mono-label text-[#0E0E0E] hover:text-[#6B6B66] transition-colors duration-200"
            style={{ ...MONO, fontSize: "11px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* ── 2. HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: "#0E0E0E",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #2c2c2c 0%, #1a1a1a 25%, #0f0f0f 55%, #050505 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

        <div
          className="relative z-10 flex flex-col items-center text-center w-full px-5 py-20 md:py-32"
          style={{ maxWidth: "680px", margin: "0 auto" }}
        >
          <h1
            className="font-display italic text-white text-balance"
            style={{
              fontSize: "clamp(42px, 9vw, 92px)",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
              fontWeight: 500,
              marginBottom: "24px",
            }}
          >
            Get dressed,
            <br />
            decided.
          </h1>

          <p
            className="font-mono-label text-center"
            style={{ fontSize: "11px", color: "#ABABA4", marginBottom: "40px" }}
          >
            YOUR AI WARDROBE. EVERY MORNING, A FINISHED LOOK.
          </p>

          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="landing-btn-white w-full md:w-auto flex items-center justify-center md:inline-flex"
            style={{
              ...SANS,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              height: "56px",
              paddingLeft: "40px",
              paddingRight: "40px",
              cursor: "pointer",
              border: "none",
              transition: "background 200ms",
            }}
          >
            GET STARTED →
          </button>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section style={{ background: "#F3F2EF", padding: "80px 0" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px" }}>
          <p
            className="font-mono-label"
            style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "48px" }}
          >
            HOW IT WORKS
          </p>

          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex gap-5 md:gap-8"
              style={{
                padding: "40px 0",
                borderBottom:
                  i < steps.length - 1 ? "1px solid rgba(14,14,14,0.12)" : "none",
              }}
            >
              <span
                className="font-display shrink-0 select-none"
                style={{
                  fontSize: "clamp(64px, 12vw, 96px)",
                  fontWeight: 400,
                  color: "#DEDDD8",
                  lineHeight: 1,
                  minWidth: "72px",
                  textAlign: "right",
                }}
              >
                {step.num}
              </span>

              <div style={{ paddingTop: "6px" }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(22px, 3.5vw, 28px)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                    color: "#0E0E0E",
                    marginBottom: "10px",
                  }}
                >
                  {step.headline}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6B6B66" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURE HIGHLIGHTS ── */}
      <section style={{ background: "#F3F2EF", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px" }}>
          <p
            className="font-mono-label"
            style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "32px" }}
          >
            WHAT MIRROR DOES
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {features.map((card) => (
              <div
                key={card.headline}
                style={{
                  background: "#FAFAF8",
                  border: "1px solid rgba(14,14,14,0.12)",
                  padding: "28px 24px",
                }}
              >
                <h3
                  className="font-display"
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#0E0E0E",
                    marginBottom: "8px",
                    lineHeight: 1.1,
                  }}
                >
                  {card.headline}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#6B6B66" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CLOSING STATEMENT ── */}
      <section
        className="flex items-center justify-center"
        style={{ background: "#0E0E0E", padding: "96px 20px" }}
      >
        <div style={{ maxWidth: "680px", width: "100%", textAlign: "center" }}>
          <h2
            className="font-display italic text-white text-balance"
            style={{
              fontSize: "clamp(32px, 6vw, 72px)",
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              marginBottom: "40px",
            }}
          >
            Your wardrobe, finally working for you.
          </h2>

          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="landing-btn-white w-full md:w-auto inline-flex items-center justify-center"
            style={{
              ...SANS,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              height: "56px",
              paddingLeft: "40px",
              paddingRight: "40px",
              cursor: "pointer",
              border: "none",
              transition: "background 200ms",
            }}
          >
            START FOR FREE →
          </button>
        </div>
      </section>

      {/* ── 6. FOOTER ── */}
      <footer
        className="flex items-center justify-between px-5 md:px-10"
        style={{
          background: "#0E0E0E",
          borderTop: "1px solid rgba(255,255,255,0.10)",
          height: "64px",
        }}
      >
        <span
          className="font-display italic text-white"
          style={{ fontSize: "20px", fontWeight: 500 }}
        >
          Mirror
        </span>
        <span className="font-mono-label" style={{ fontSize: "10px", color: "#6B6B66" }}>
          © 2026 MIRROR
        </span>
      </footer>

      {/* ── Beta gate sheet ── */}
      {gateOpen && <BetaGate onClose={() => setGateOpen(false)} />}

    </div>
  );
}
