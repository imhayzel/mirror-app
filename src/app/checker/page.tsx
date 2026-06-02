"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const HAIRLINE = "1px solid rgba(14,14,14,0.12)";
const HAIRLINE_STRONG = "1px solid rgba(14,14,14,0.28)";
const W60 = "rgba(255,255,255,0.60)";
const W40 = "rgba(255,255,255,0.40)";

type Mode = "url" | "upload";
type Stage = "idle" | "loading" | "verdict";
type Verdict = "buy" | "skip";

// Mock verdict data — replace with real Claude API response
const MOCK_VERDICT: { verdict: Verdict; headline: string; reasoning: string; pairs: string[] } = {
  verdict: "buy",
  headline: "Buy it.",
  reasoning:
    "This fits your wardrobe well. The relaxed silhouette echoes the pieces you already reach for, and the neutral colour sits naturally beside your existing palette. You'll wear it.",
  pairs: ["Wool overcoat", "Wide-leg trousers", "Leather loafer"],
};

export default function CheckerPage() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAnalyse() {
    if (mode === "url" && !url.trim()) return;
    if (mode === "upload" && !fileName) return;
    setStage("loading");
    // Simulate API call — swap for real Claude Vision call
    setTimeout(() => setStage("verdict"), 2200);
  }

  function reset() {
    setStage("idle");
    setUrl("");
    setFileName(null);
    setMode("url");
  }

  const canSubmit = mode === "url" ? url.trim().length > 0 : !!fileName;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F2EF" }}>

      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10"
        style={{
          background: "#F3F2EF",
          borderBottom: HAIRLINE,
          height: "56px",
          flexShrink: 0,
        }}
      >
        <Link
          href="/closet"
          className="font-mono-label transition-colors duration-150"
          style={{ fontSize: "11px", color: "#6B6B66", textDecoration: "none" }}
        >
          ← CLOSET
        </Link>
        <h1
          className="font-display italic"
          style={{ fontSize: "20px", fontWeight: 500, letterSpacing: "-0.01em", color: "#0E0E0E", lineHeight: 1 }}
        >
          Should I buy this?
        </h1>
        {/* spacer to balance the back link */}
        <span style={{ width: "64px" }} />
      </header>

      {/* ══════════════════════════════════════════
          IDLE — Input state
      ══════════════════════════════════════════ */}
      {stage === "idle" && (
        <main className="flex-1 flex flex-col px-5 md:px-10 py-10" style={{ maxWidth: "600px", width: "100%", margin: "0 auto", paddingBottom: "96px" }}>

          {/* Kicker */}
          <p
            className="font-mono-label"
            style={{ fontSize: "11px", color: "#6B6B66", marginBottom: "32px" }}
          >
            PASTE A LINK OR UPLOAD A PHOTO. MIRROR DECIDES.
          </p>

          {/* Mode tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: HAIRLINE_STRONG,
              marginBottom: "32px",
            }}
          >
            {(["url", "upload"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="font-mono-label transition-colors duration-150"
                style={{
                  fontSize: "11px",
                  padding: "0 0 12px",
                  marginRight: "24px",
                  background: "transparent",
                  border: "none",
                  borderBottom: mode === m ? "2px solid #0E0E0E" : "2px solid transparent",
                  color: mode === m ? "#0E0E0E" : "#ABABA4",
                  cursor: "pointer",
                  letterSpacing: "0.14em",
                  marginBottom: "-1px",
                }}
              >
                {m === "url" ? "PASTE URL" : "UPLOAD IMAGE"}
              </button>
            ))}
          </div>

          {/* URL input */}
          {mode === "url" && (
            <div style={{ marginBottom: "32px" }}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyse()}
                placeholder="https://store.com/product/..."
                className="w-full"
                style={{
                  height: "56px",
                  padding: "0 16px",
                  border: HAIRLINE_STRONG,
                  background: "#FAFAF8",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  color: "#0E0E0E",
                  outline: "none",
                  borderRadius: "2px",
                }}
                onFocus={(e) => (e.currentTarget.style.border = "2px solid #0E0E0E")}
                onBlur={(e) => (e.currentTarget.style.border = HAIRLINE_STRONG)}
              />
              <p
                className="font-mono-label"
                style={{ fontSize: "10px", color: "#ABABA4", marginTop: "8px" }}
              >
                FROM ANY ONLINE STORE — ZARA, SSENSE, NET-A-PORTER, ETC.
              </p>
            </div>
          )}

          {/* Upload area */}
          {mode === "upload" && (
            <div style={{ marginBottom: "32px" }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full transition-colors duration-150"
                style={{
                  height: "140px",
                  border: HAIRLINE_STRONG,
                  background: fileName ? "#F3F2EF" : "#FAFAF8",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                {/* Upload icon — Lucide-style */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ABABA4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span
                  className="font-mono-label"
                  style={{ fontSize: "11px", color: fileName ? "#0E0E0E" : "#ABABA4" }}
                >
                  {fileName ?? "TAP TO SELECT PHOTO"}
                </span>
              </button>
              {fileName && (
                <p className="font-mono-label" style={{ fontSize: "10px", color: "#6B6B66", marginTop: "8px" }}>
                  {fileName.toUpperCase()}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAnalyse}
            disabled={!canSubmit}
            className="w-full transition-colors duration-200"
            style={{
              height: "56px",
              background: canSubmit ? "#0E0E0E" : "#DEDDD8",
              color: canSubmit ? "#FFFFFF" : "#ABABA4",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            ANALYSE →
          </button>
        </main>
      )}

      {/* ══════════════════════════════════════════
          LOADING — Skeleton state
      ══════════════════════════════════════════ */}
      {stage === "loading" && (
        <main className="flex-1 flex flex-col" style={{ paddingBottom: "96px" }}>
          {/* Dark analysis header */}
          <div style={{ background: "#0E0E0E", padding: "40px 20px 48px" }}>
            <p className="font-mono-label" style={{ fontSize: "10px", color: W40, marginBottom: "20px" }}>
              ANALYSING
            </p>
            <div style={{ height: "48px", width: "70%", border: "1px solid rgba(255,255,255,0.10)", marginBottom: "12px" }} />
            <div style={{ height: "16px", width: "45%", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          {/* Skeleton body */}
          <div style={{ padding: "32px 20px", maxWidth: "600px", width: "100%", margin: "0 auto" }}>
            <div style={{ height: "12px", width: "30%", background: "rgba(14,14,14,0.06)", marginBottom: "24px" }} />
            <div style={{ height: "14px", width: "100%", background: "rgba(14,14,14,0.06)", marginBottom: "10px" }} />
            <div style={{ height: "14px", width: "88%", background: "rgba(14,14,14,0.06)", marginBottom: "10px" }} />
            <div style={{ height: "14px", width: "72%", background: "rgba(14,14,14,0.06)", marginBottom: "40px" }} />

            <div style={{ height: "12px", width: "25%", background: "rgba(14,14,14,0.06)", marginBottom: "16px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ flex: 1, aspectRatio: "1", background: "rgba(14,14,14,0.06)", border: HAIRLINE }} />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════
          VERDICT — Result state
      ══════════════════════════════════════════ */}
      {stage === "verdict" && (
        <main className="flex-1 flex flex-col" style={{ paddingBottom: "96px" }}>

          {/* Verdict hero — dark card */}
          <div
            style={{
              background: "#0E0E0E",
              padding: "40px 20px 48px",
            }}
          >
            <p className="font-mono-label" style={{ fontSize: "10px", color: W40, marginBottom: "20px" }}>
              MIRROR&apos;S VERDICT
            </p>

            <h2
              className="font-display italic text-white"
              style={{
                fontSize: "clamp(56px, 14vw, 88px)",
                fontWeight: 500,
                lineHeight: 0.96,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              {MOCK_VERDICT.headline}
            </h2>

            {/* Verdict pill indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: MOCK_VERDICT.verdict === "buy" ? "#2F7D5B" : "#B23A33",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono-label"
                style={{
                  fontSize: "10px",
                  color: MOCK_VERDICT.verdict === "buy" ? "#2F7D5B" : "#B23A33",
                  letterSpacing: "0.18em",
                }}
              >
                {MOCK_VERDICT.verdict === "buy" ? "FITS YOUR WARDROBE" : "DOES NOT FIT YOUR WARDROBE"}
              </span>
            </div>
          </div>

          {/* Reasoning */}
          <div
            style={{
              padding: "32px 20px",
              borderBottom: HAIRLINE,
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <p
              className="font-mono-label"
              style={{ fontSize: "10px", color: "#6B6B66", marginBottom: "16px" }}
            >
              WHY
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0E0E0E" }}>
              {MOCK_VERDICT.reasoning}
            </p>
          </div>

          {/* Pairs with */}
          <div
            style={{
              padding: "32px 20px",
              borderBottom: HAIRLINE,
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <p
              className="font-mono-label"
              style={{ fontSize: "10px", color: "#6B6B66", marginBottom: "20px" }}
            >
              PAIRS WITH WHAT YOU OWN
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              {MOCK_VERDICT.pairs.map((label) => (
                <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Grayscale placeholder thumbnail */}
                  <div
                    style={{
                      aspectRatio: "3/4",
                      background: "linear-gradient(160deg, #2c2c2c 0%, #1a1a1a 60%, #0f0f0f 100%)",
                      border: HAIRLINE,
                    }}
                  />
                  <span
                    className="font-mono-label"
                    style={{ fontSize: "9px", color: "#6B6B66", letterSpacing: "0.12em" }}
                  >
                    {label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              padding: "24px 20px",
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button
              onClick={reset}
              className="w-full transition-colors duration-200"
              style={{
                height: "56px",
                background: "#0E0E0E",
                color: "#FFFFFF",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                border: "none",
                cursor: "pointer",
              }}
            >
              CHECK ANOTHER ITEM →
            </button>
            <button
              className="w-full font-mono-label transition-colors duration-200"
              style={{
                height: "48px",
                background: "transparent",
                color: "#ABABA4",
                fontSize: "10px",
                letterSpacing: "0.14em",
                border: "none",
                cursor: "pointer",
              }}
            >
              SAVE THIS RESULT
            </button>
          </div>
        </main>
      )}

      <BottomNav />
    </div>
  );
}
