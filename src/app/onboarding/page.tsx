"use client";

import { useState } from "react";
import Link from "next/link";

const STYLE_OPTIONS = [
  { id: "minimal", label: "MINIMAL", desc: "Clean lines, neutral palette, nothing unnecessary." },
  { id: "classic", label: "CLASSIC", desc: "Timeless pieces, polished fits, enduring elegance." },
  { id: "streetwear", label: "STREETWEAR", desc: "Bold graphics, relaxed silhouettes, cultural edge." },
  { id: "avant-garde", label: "AVANT-GARDE", desc: "Experimental shapes, unexpected combinations." },
  { id: "bohemian", label: "BOHEMIAN", desc: "Layered textures, earthy tones, free-spirited." },
  { id: "preppy", label: "PREPPY", desc: "Collegiate references, clean colours, tailored." },
];

const OCCASION_OPTIONS = ["EVERYDAY", "WORK", "CASUAL", "EVENING", "ALL OF THE ABOVE"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F2EF" }}>

      {/* Nav */}
      <header
        className="flex items-center justify-between px-5 md:px-10"
        style={{
          height: "56px",
          background: "#F3F2EF",
          borderBottom: "1px solid rgba(14,14,14,0.12)",
        }}
      >
        <span
          className="font-display italic"
          style={{ fontSize: "22px", fontWeight: 500, color: "#0E0E0E" }}
        >
          Mirror
        </span>
        <Link
          href="/"
          className="font-mono-label hover:text-[#0E0E0E] transition-colors duration-200"
          style={{ fontSize: "11px", color: "#6B6B66" }}
        >
          EXIT
        </Link>
      </header>

      <div
        className="flex-1 w-full mx-auto px-5 md:px-10 py-12"
        style={{ maxWidth: "600px" }}
      >

        {/* ── Step 0: Style ── */}
        {step === 0 && (
          <div>
            {/* Progress */}
            <p className="font-mono-label" style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "32px" }}>
              1 OF 2
            </p>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(28px, 5vw, 40px)",
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "#0E0E0E",
                marginBottom: "8px",
              }}
            >
              What describes your style?
            </h1>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#6B6B66", marginBottom: "40px" }}>
              Select all that apply. Mirror uses this to tailor your outfit suggestions.
            </p>

            {/* Option rows */}
            <div style={{ borderTop: "1px solid rgba(14,14,14,0.12)" }}>
              {STYLE_OPTIONS.map((opt) => {
                const selected = selectedStyles.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleStyle(opt.id)}
                    className="w-full text-left transition-colors duration-150"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      padding: "20px 0",
                      borderBottom: "1px solid rgba(14,14,14,0.12)",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p
                        className="font-mono-label"
                        style={{
                          fontSize: "12px",
                          color: selected ? "#0E0E0E" : "#0E0E0E",
                          marginBottom: "4px",
                        }}
                      >
                        {opt.label}
                      </p>
                      <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#6B6B66" }}>
                        {opt.desc}
                      </p>
                    </div>
                    {/* Selection indicator */}
                    <span
                      className="font-mono-label shrink-0"
                      style={{
                        fontSize: "11px",
                        color: selected ? "#0E0E0E" : "transparent",
                        marginLeft: "16px",
                        marginTop: "2px",
                        transition: "color 150ms",
                      }}
                    >
                      ✕
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={selectedStyles.length === 0}
              className="w-full transition-colors duration-200"
              style={{
                marginTop: "32px",
                height: "56px",
                background: selectedStyles.length === 0 ? "#ABABA4" : "#0E0E0E",
                color: "#FFFFFF",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                border: "none",
                cursor: selectedStyles.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* ── Step 1: Occasion ── */}
        {step === 1 && (
          <div>
            {/* Progress */}
            <p className="font-mono-label" style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "32px" }}>
              2 OF 2
            </p>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(28px, 5vw, 40px)",
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "#0E0E0E",
                marginBottom: "8px",
              }}
            >
              What do you dress for most?
            </h1>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#6B6B66", marginBottom: "40px" }}>
              Mirror will prioritise outfit suggestions for this context.
            </p>

            {/* Option rows */}
            <div style={{ borderTop: "1px solid rgba(14,14,14,0.12)" }}>
              {OCCASION_OPTIONS.map((occ) => {
                const selected = selectedOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className="w-full text-left transition-colors duration-150"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "60px",
                      borderBottom: "1px solid rgba(14,14,14,0.12)",
                      background: selected ? "#0E0E0E" : "transparent",
                      padding: "0",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="font-mono-label"
                      style={{
                        fontSize: "12px",
                        color: selected ? "#FFFFFF" : "#0E0E0E",
                        paddingLeft: selected ? "20px" : "0",
                        transition: "padding 150ms, color 150ms",
                      }}
                    >
                      {occ}
                    </span>
                    {selected && (
                      <span
                        className="font-mono-label"
                        style={{ fontSize: "11px", color: "#FFFFFF", paddingRight: "20px" }}
                      >
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "32px" }}>
              <button
                onClick={() => setStep(0)}
                className="transition-colors duration-200"
                style={{
                  flex: 1,
                  height: "56px",
                  background: "transparent",
                  color: "#0E0E0E",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  border: "1px solid rgba(14,14,14,0.24)",
                  cursor: "pointer",
                }}
              >
                BACK
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedOccasion}
                className="transition-colors duration-200"
                style={{
                  flex: 1,
                  height: "56px",
                  background: selectedOccasion ? "#0E0E0E" : "#ABABA4",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  border: "none",
                  cursor: selectedOccasion ? "pointer" : "not-allowed",
                }}
              >
                FINISH
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Done ── */}
        {step === 2 && (
          <div style={{ textAlign: "center", paddingTop: "48px" }}>
            <p className="font-mono-label" style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "24px" }}>
              YOU&apos;RE ALL SET
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(36px, 7vw, 56px)",
                fontWeight: 500,
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                color: "#0E0E0E",
                marginBottom: "16px",
              }}
            >
              Welcome to Mirror.
            </h1>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#6B6B66", marginBottom: "48px" }}>
              Start by adding items to your wardrobe. Mirror will get to work.
            </p>
            <Link
              href="/closet/add"
              className="w-full inline-flex items-center justify-center transition-colors duration-200 hover:bg-[#1A1A1A]"
              style={{
                height: "56px",
                background: "#0E0E0E",
                color: "#FFFFFF",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                textDecoration: "none",
              }}
            >
              ADD YOUR FIRST ITEM
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
