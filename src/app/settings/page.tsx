"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const HAIRLINE = "1px solid rgba(14,14,14,0.12)";
const SLATE = "#6B6B66";
const SLATE_LIGHT = "#ABABA4";
const CRITICAL = "#B23A33";

function SectionHeader({ label, color }: { label: string; color?: string }) {
  return (
    <div
      className="font-mono-label"
      style={{
        fontSize: "10px",
        color: color ?? SLATE,
        padding: "28px 20px 10px",
        borderBottom: HAIRLINE,
      }}
    >
      {label}
    </div>
  );
}

function TappableRow({
  label,
  right,
  labelColor,
  onClick,
}: {
  label: string;
  right?: React.ReactNode;
  labelColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between"
      style={{
        height: "52px",
        padding: "0 20px",
        borderBottom: HAIRLINE,
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        className="font-mono-label"
        style={{ fontSize: "11px", color: labelColor ?? "#0E0E0E" }}
      >
        {label}
      </span>
      {right}
    </button>
  );
}

function StaticRow({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ height: "52px", padding: "0 20px", borderBottom: HAIRLINE }}
    >
      <span
        className="font-mono-label"
        style={{ fontSize: "11px", color: "#0E0E0E" }}
      >
        {label}
      </span>
      {right}
    </div>
  );
}

const Arrow = ({ color }: { color?: string }) => (
  <span style={{ color: color ?? SLATE_LIGHT, fontSize: "20px", lineHeight: 1, marginTop: "-2px" }}>
    ›
  </span>
);

const RowValue = ({ text }: { text: string }) => (
  <span style={{ fontSize: "13px", color: SLATE, marginRight: "8px" }}>{text}</span>
);

export default function SettingsPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [outfitReminder, setOutfitReminder] = useState(false);
  const [newFeatures, setNewFeatures] = useState(false);

  const MonoToggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="font-mono-label transition-colors duration-200"
      style={{
        fontSize: "10px",
        color: on ? "#0E0E0E" : SLATE_LIGHT,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        letterSpacing: "0.14em",
        padding: "8px 0",
      }}
    >
      {on ? "ON" : "OFF"}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F3F2EF", paddingBottom: "80px" }}>

      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10"
        style={{
          background: "#F3F2EF",
          borderBottom: HAIRLINE,
          height: "56px",
        }}
      >
        <Link
          href="/you"
          className="font-mono-label transition-colors duration-150 hover:text-[#0E0E0E]"
          style={{ fontSize: "11px", color: "#6B6B66", textDecoration: "none" }}
        >
          ← YOU
        </Link>
        <h1
          className="font-display"
          style={{
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#0E0E0E",
            lineHeight: 1,
          }}
        >
          Settings.
        </h1>
        <span style={{ width: "48px" }} />
      </header>

      {/* ── ACCOUNT ── */}
      <SectionHeader label="ACCOUNT" />
      <TappableRow label="PROFILE" onClick={() => {}} right={<Arrow />} />
      <TappableRow
        label="EMAIL"
        onClick={() => {}}
        right={
          <div className="flex items-center gap-2">
            <RowValue text="hayzelchoo@gmail.com" />
            <Arrow />
          </div>
        }
      />
      <TappableRow label="PASSWORD" onClick={() => {}} right={<Arrow />} />

      {/* ── PREFERENCES ── */}
      <SectionHeader label="PREFERENCES" />
      <TappableRow
        label="DEFAULT OCCASION"
        onClick={() => {}}
        right={
          <div className="flex items-center gap-2">
            <RowValue text="Casual" />
            <Arrow />
          </div>
        }
      />
      <StaticRow
        label="TEMPERATURE UNIT"
        right={
          <div className="flex items-center gap-3">
            {(["C", "F"] as const).map((unit, i) => (
              <>
                {i === 1 && (
                  <span key="sep" style={{ color: "#DEDDD8", fontSize: "12px" }}>/</span>
                )}
                <button
                  key={unit}
                  onClick={() => setTempUnit(unit)}
                  className="font-mono-label transition-colors duration-200"
                  style={{
                    fontSize: "11px",
                    color: tempUnit === unit ? "#0E0E0E" : SLATE_LIGHT,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "0.14em",
                  }}
                >
                  °{unit}
                </button>
              </>
            ))}
          </div>
        }
      />

      {/* ── NOTIFICATIONS ── */}
      <SectionHeader label="NOTIFICATIONS" />
      <StaticRow
        label="DAILY OUTFIT REMINDER"
        right={
          <MonoToggle on={outfitReminder} onToggle={() => setOutfitReminder((v) => !v)} />
        }
      />
      <StaticRow
        label="NEW FEATURES"
        right={
          <MonoToggle on={newFeatures} onToggle={() => setNewFeatures((v) => !v)} />
        }
      />

      {/* ── ABOUT ── */}
      <SectionHeader label="ABOUT" />
      <TappableRow label="ABOUT MIRROR" onClick={() => {}} right={<Arrow />} />
      <TappableRow label="PRIVACY POLICY" onClick={() => {}} right={<Arrow />} />
      <TappableRow label="TERMS OF SERVICE" onClick={() => {}} right={<Arrow />} />
      <StaticRow
        label="VERSION"
        right={
          <span
            className="font-mono-label"
            style={{ fontSize: "11px", color: SLATE_LIGHT }}
          >
            0.1.0
          </span>
        }
      />

      {/* ── DANGER ZONE ── */}
      <SectionHeader label="DANGER ZONE" color={CRITICAL} />
      <TappableRow
        label="SIGN OUT"
        labelColor={CRITICAL}
        onClick={() => signOut(() => router.push("/sign-in"))}
        right={<Arrow color={CRITICAL} />}
      />
      <TappableRow
        label="DELETE ACCOUNT"
        labelColor={CRITICAL}
        onClick={() => {}}
        right={<Arrow color={CRITICAL} />}
      />

      <BottomNav />
    </div>
  );
}
