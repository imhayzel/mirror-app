"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import BottomNav from "@/components/BottomNav";

// ─── constants ────────────────────────────────────────────────────────────────

type ItemType = "top" | "bottom" | "outerwear" | "shoes" | "accessory";

const TYPE_OPTIONS: { label: string; value: ItemType }[] = [
  { label: "TOP", value: "top" },
  { label: "BOTTOM", value: "bottom" },
  { label: "OUTERWEAR", value: "outerwear" },
  { label: "SHOES", value: "shoes" },
  { label: "ACCESSORY", value: "accessory" },
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

const FIELD_LABEL: React.CSSProperties = {
  ...MONO,
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.45)",
  display: "block",
  marginBottom: 10,
};

const FIELD_INPUT: React.CSSProperties = {
  ...SANS,
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: 400,
  padding: "0 0 12px",
  outline: "none",
  borderRadius: 0,
  boxSizing: "border-box" as const,
};

// ─── AddPage ──────────────────────────────────────────────────────────────────

export default function AddPage() {
  const router = useRouter();
  const { userId } = useAuth();

  // image state
  const [imageMode, setImageMode] = useState<"upload" | "url" | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  // form state
  const [name, setName] = useState("");
  const [type, setType] = useState<ItemType | null>(null);
  const [color, setColor] = useState("");

  // ai state
  const [categorizing, setCategorizing] = useState(false);

  // submission state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── handlers ──────────────────────────────────────────────────────────────

  const runCategorize = useCallback(async (base64?: string, mime?: string, url?: string) => {
    setCategorizing(true);
    setError(null);
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(base64 ? { imageBase64: base64, mimeType: mime } : { imageUrl: url }),
      });
      const data = await res.json();
      if (data.error === 'daily_limit_reached') {
        setError("You've had five looks today. Come back tomorrow.");
      } else {
        // Fill whatever fields we got back
        if (data.name) setName(data.name);
        if (data.type) setType(data.type as ItemType);
        if (data.color) setColor(data.color);
        // Update preview with the resolved product image URL
        if (data.image_url) {
          setImagePreview(data.image_url);
          setImageUrl(data.image_url);
        }
        // Only show an error if we got nothing useful at all
        if (!data.name && !data.image_url) {
          setError("Couldn't analyse image. Fill in the details manually.");
        }
      }
    } catch {
      setError("Couldn't analyse image. Fill in the details manually.");
    } finally {
      setCategorizing(false);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      const base64 = result.split(',')[1];
      runCategorize(base64, file.type);
    };
    reader.readAsDataURL(file);
  }, [runCategorize]);

  const handleUrlCommit = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImagePreview(trimmed);
    setImageUrl(trimmed);
    setError(null);
    runCategorize(undefined, undefined, trimmed);
  }, [urlInput, runCategorize]);

  const handleClearImage = useCallback(() => {
    setImagePreview(null);
    setImageUrl(null);
    setUrlInput("");
    setImageMode(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !type || !userId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/wardrobe/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          type,
          color: color.trim() || null,
          image_url: imageUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('[add page] save error:', data);
        throw new Error(data.error || 'Save failed');
      }
      router.push("/closet");
    } catch (err) {
      console.error('[add page] save failed:', err);
      setError("Failed to save. Check your connection and try again.");
      setSaving(false);
    }
  }, [name, type, color, imageUrl, userId, router]);

  const canSave = name.trim().length > 0 && type !== null && !saving && !categorizing && !!userId;

  return (
    <div style={{ minHeight: "100vh", background: "#0E0E0E", display: "flex", justifyContent: "center" }}>
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
          <span style={{ ...MONO, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", color: "rgba(255,255,255,0.7)" }}>
            9:41
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
              <rect x="0" y="7" width="3" height="4" fill="rgba(255,255,255,0.75)" />
              <rect x="4.3" y="4.5" width="3" height="6.5" fill="rgba(255,255,255,0.75)" />
              <rect x="8.6" y="2" width="3" height="9" fill="rgba(255,255,255,0.75)" />
              <rect x="12.9" y="0" width="3" height="11" fill="rgba(255,255,255,0.75)" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
              <rect x="0.5" y="0.5" width="21" height="11" stroke="rgba(255,255,255,0.75)" strokeWidth="1" fill="none" />
              <rect x="2" y="2" width="16" height="8" fill="rgba(255,255,255,0.75)" />
              <line x1="23" y1="4.5" x2="23" y2="7.5" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="square" />
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
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href="/closet"
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
            }}
          >
            ← BACK
          </Link>
          <span
            style={{
              ...SERIF,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            Add to Closet
          </span>
          {/* spacer matches ← BACK width */}
          <span style={{ width: 48 }} />
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

          {/* headline */}
          <div style={{ padding: "32px 24px 0" }}>
            <span
              style={{
                ...MONO,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              ADD TO CLOSET
            </span>
            <p
              style={{
                ...SERIF,
                fontSize: 36,
                fontWeight: 500,
                fontStyle: "italic",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                margin: "10px 0 0",
              }}
            >
              A few details.<br />We'll do the rest.
            </p>
          </div>

          {/* ── image section ─────────────────────────────────────────────── */}
          <div style={{ padding: "28px 24px 0" }}>

            {/* two equal-weight input options */}
            {!imagePreview && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

                {/* Upload */}
                <button
                  type="button"
                  onClick={() => { setImageMode("upload"); fileInputRef.current?.click(); }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    padding: "30px 16px",
                    background: imageMode === "upload" ? "rgba(255,255,255,0.07)" : "transparent",
                    border: `1px solid ${imageMode === "upload" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.16)"}`,
                    cursor: "pointer",
                    transition: "border-color 0.18s cubic-bezier(0.22,1,0.36,1), background 0.18s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
                    <rect x="1" y="5" width="20" height="16" />
                    <polyline points="6,5 6,1 16,1 16,5" />
                    <line x1="11" y1="10" x2="11" y2="17" />
                    <polyline points="7.5,13 11,9.5 14.5,13" />
                  </svg>
                  <span style={{ ...MONO, fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                    UPLOAD IMAGE
                  </span>
                </button>

                {/* Paste URL */}
                <button
                  type="button"
                  onClick={() => setImageMode(imageMode === "url" ? null : "url")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    padding: "30px 16px",
                    background: imageMode === "url" ? "rgba(255,255,255,0.07)" : "transparent",
                    border: `1px solid ${imageMode === "url" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.16)"}`,
                    cursor: "pointer",
                    transition: "border-color 0.18s cubic-bezier(0.22,1,0.36,1), background 0.18s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
                    <path d="M9 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="square" />
                    <path d="M13 9a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="square" />
                  </svg>
                  <span style={{ ...MONO, fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                    PASTE URL
                  </span>
                </button>
              </div>
            )}

            {/* URL input — shown inline below the buttons */}
            {imageMode === "url" && !imagePreview && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 12,
                    borderBottom: "1px solid rgba(255,255,255,0.22)",
                    paddingBottom: 12,
                  }}
                >
                  <input
                    type="url"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !categorizing && handleUrlCommit()}
                    autoFocus
                    disabled={categorizing}
                    style={{
                      ...SANS,
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: 14,
                      padding: 0,
                      outline: "none",
                      opacity: categorizing ? 0.4 : 1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleUrlCommit}
                    disabled={categorizing}
                    style={{
                      ...MONO,
                      background: "transparent",
                      border: "none",
                      color: categorizing ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.55)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: categorizing ? "default" : "pointer",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {categorizing ? "LOADING..." : "LOAD →"}
                  </button>
                </div>
              </div>
            )}

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* image preview */}
            {imagePreview && (
              <div style={{ marginBottom: 4 }}>
                {categorizing && (
                  <div
                    style={{
                      padding: "10px 0 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        ...MONO,
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        color: "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                      }}
                    >
                      ANALYSING ITEM...
                    </span>
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "0.82",
                    overflow: "hidden",
                    background: "#1A1A1A",
                    position: "relative",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Item preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(1) contrast(1.06)",
                      display: "block",
                    }}
                    onError={() => {
                      setImagePreview(null);
                      setImageUrl(null);
                      setError("Couldn't load image from that URL.");
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
                  style={{
                    ...MONO,
                    marginTop: 12,
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.38)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    padding: 0,
                    display: "block",
                  }}
                >
                  ✕ CHANGE IMAGE
                </button>
              </div>
            )}
          </div>

          {/* ── form fields ───────────────────────────────────────────────── */}
          <div style={{ padding: "32px 24px 0" }}>

            {/* section divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              <span
                style={{
                  ...MONO,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}
              >
                DETAILS
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Item name */}
            <div style={{ marginBottom: 28 }}>
              <label style={FIELD_LABEL}>ITEM NAME</label>
              <input
                type="text"
                placeholder="e.g. Camel wool coat"
                value={name}
                onChange={e => setName(e.target.value)}
                style={FIELD_INPUT}
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: 28 }}>
              <label style={FIELD_LABEL}>TYPE</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TYPE_OPTIONS.map(opt => {
                  const active = type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      style={{
                        ...MONO,
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "9px 16px",
                        background: active ? "#FFFFFF" : "transparent",
                        color: active ? "#0E0E0E" : "rgba(255,255,255,0.55)",
                        border: `1px solid ${active ? "#FFFFFF" : "rgba(255,255,255,0.2)"}`,
                        cursor: "pointer",
                        transition: "background 0.18s cubic-bezier(0.22,1,0.36,1), color 0.18s cubic-bezier(0.22,1,0.36,1), border-color 0.18s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colour */}
            <div style={{ marginBottom: 36 }}>
              <label style={FIELD_LABEL}>COLOUR</label>
              <input
                type="text"
                placeholder="e.g. Camel, Navy, Ivory"
                value={color}
                onChange={e => setColor(e.target.value)}
                style={FIELD_INPUT}
              />
            </div>

            {/* status / error */}
            {(categorizing || error) && (
              <p
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: categorizing ? "rgba(255,255,255,0.45)" : "#B23A33",
                  textTransform: "uppercase",
                  margin: "0 0 16px",
                }}
              >
                {categorizing ? "ANALYSING..." : error}
              </p>
            )}

            {/* Save CTA */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              style={{
                ...SANS,
                width: "100%",
                height: 56,
                background: canSave ? "#FFFFFF" : "rgba(255,255,255,0.1)",
                color: canSave ? "#0E0E0E" : "rgba(255,255,255,0.25)",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: canSave ? "pointer" : "default",
                transition: "background 0.24s cubic-bezier(0.22,1,0.36,1), color 0.24s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {saving ? "SAVING…" : categorizing ? "ANALYSING…" : "ADD TO CLOSET"}
            </button>

            <div style={{ height: 16 }} />
          </div>

        </main>

        <BottomNav dark />

      </div>
    </div>
  );
}
