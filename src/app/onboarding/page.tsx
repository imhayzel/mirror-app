"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// White-on-dark opacity palette
const W60 = "rgba(255,255,255,0.60)";  // sublines, kickers
const W40 = "rgba(255,255,255,0.40)";  // captions, bottom wordmark
const W18 = "rgba(255,255,255,0.18)";  // hairline borders on dark

const addOptions = [
  {
    label: "UPLOAD AN OOTD PHOTO →",
    caption: "Mirror identifies every piece automatically",
  },
  {
    label: "UPLOAD A SINGLE ITEM →",
    caption: "One piece at a time",
  },
  {
    label: "PASTE A PRODUCT LINK →",
    caption: "From any online store",
  },
];

export default function OnboardingPage() {
  const [screen, setScreen] = useState(0);
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0E0E0E", color: "#FFFFFF" }}
    >
      {/* ─────────────────────────────────────────
          SCREEN 1 — The Promise
      ───────────────────────────────────────── */}
      {screen === 0 && (
        <div className="flex-1 flex flex-col justify-between px-5 py-12 md:px-10" style={{ minHeight: "100svh" }}>
          {/* Spacer */}
          <div />

          {/* Centre content */}
          <div className="flex flex-col items-center text-center">
            <h1
              className="font-display italic text-white text-balance"
              style={{
                fontSize: "clamp(36px, 8vw, 72px)",
                fontWeight: 500,
                lineHeight: 1.0,
                letterSpacing: "-0.015em",
                marginBottom: "28px",
              }}
            >
              Your wardrobe,
              <br />
              finally working
              <br />
              for you.
            </h1>

            <p
              className="font-mono-label text-center"
              style={{
                fontSize: "11px",
                color: W60,
                lineHeight: 1.8,
                marginBottom: "48px",
                maxWidth: "280px",
              }}
            >
              MIRROR LEARNS HOW YOU DRESS.
              <br />
              THE MORE YOU ADD, THE SMARTER IT GETS.
            </p>

            <button
              onClick={() => setScreen(1)}
              className="w-full transition-colors duration-200 hover:bg-[#F3F2EF]"
              style={{
                height: "56px",
                background: "#FFFFFF",
                color: "#0E0E0E",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                border: "none",
                cursor: "pointer",
                maxWidth: "480px",
                width: "100%",
              }}
            >
              LET&apos;S START →
            </button>
          </div>

          {/* Bottom wordmark */}
          <p
            className="font-mono-label text-center"
            style={{ fontSize: "11px", color: W40, letterSpacing: "0.22em" }}
          >
            MIRROR
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────
          SCREEN 2 — Add Your First Piece
      ───────────────────────────────────────── */}
      {screen === 1 && (
        <div className="flex-1 flex flex-col px-5 py-12 md:px-10" style={{ minHeight: "100svh" }}>

          {/* Kicker */}
          <p
            className="font-mono-label"
            style={{ fontSize: "11px", color: W60, marginBottom: "32px" }}
          >
            STEP 1 OF 1
          </p>

          {/* Headline */}
          <h1
            className="font-display italic text-white text-balance"
            style={{
              fontSize: "clamp(32px, 7vw, 60px)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
              marginBottom: "16px",
            }}
          >
            Start with something
            <br />
            you already love.
          </h1>

          {/* Subline */}
          <p
            className="font-mono-label"
            style={{
              fontSize: "11px",
              color: W60,
              lineHeight: 1.8,
              marginBottom: "48px",
            }}
          >
            AN OUTFIT PHOTO, A SINGLE ITEM, OR A LINK.
            <br />
            MIRROR WILL DO THE REST.
          </p>

          {/* Options */}
          <div className="flex flex-col" style={{ gap: "1px", marginBottom: "auto" }}>
            {addOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => setScreen(2)}
                className="w-full text-left transition-colors duration-150"
                style={{
                  padding: "20px 0",
                  borderTop: i === 0 ? `1px solid ${W18}` : "none",
                  borderBottom: `1px solid ${W18}`,
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: "#FFFFFF",
                    marginBottom: "6px",
                  }}
                >
                  {opt.label}
                </p>
                <p
                  className="font-mono-label"
                  style={{ fontSize: "10px", color: W40, letterSpacing: "0.12em" }}
                >
                  {opt.caption}
                </p>
              </button>
            ))}
          </div>

          {/* Skip */}
          <div className="text-center" style={{ marginTop: "40px" }}>
            <button
              onClick={() => setScreen(2)}
              className="font-mono-label transition-colors duration-200"
              style={{
                fontSize: "11px",
                color: W40,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.14em",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = W60)}
              onMouseOut={(e) => (e.currentTarget.style.color = W40)}
            >
              I&apos;LL ADD ITEMS LATER →
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          SCREEN 3 — Mirror is Ready
      ───────────────────────────────────────── */}
      {screen === 2 && (
        <div
          className="flex-1 flex flex-col items-center justify-center text-center px-5 py-12 md:px-10"
          style={{ minHeight: "100svh" }}
        >
          <h1
            className="font-display italic text-white text-balance"
            style={{
              fontSize: "clamp(40px, 9vw, 80px)",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              marginBottom: "24px",
            }}
          >
            Mirror is ready.
          </h1>

          <p
            className="font-mono-label"
            style={{
              fontSize: "11px",
              color: W60,
              lineHeight: 1.8,
              marginBottom: "48px",
            }}
          >
            ADD MORE PIECES TO GET YOUR FIRST OUTFIT.
          </p>

          <button
            onClick={() => router.push("/closet")}
            className="w-full transition-colors duration-200 hover:bg-[#F3F2EF]"
            style={{
              height: "56px",
              background: "#FFFFFF",
              color: "#0E0E0E",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              border: "none",
              cursor: "pointer",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            GO TO MY WARDROBE →
          </button>

          <p
            className="font-mono-label"
            style={{
              fontSize: "10px",
              color: W40,
              marginTop: "20px",
              letterSpacing: "0.12em",
            }}
          >
            YOUR STYLE PROFILE BUILDS AS YOU ADD MORE.
          </p>
        </div>
      )}
    </div>
  );
}
