"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'SFMono-Regular', monospace",
};

const NAV: { label: string; href: string }[] = [
  { label: "TODAY",   href: "/" },
  { label: "CLOSET",  href: "/closet" },
  { label: "OUTFITS", href: "/outfits" },
  { label: "YOU",     href: "/you" },
];

export default function BottomNav({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();

  const bg = dark ? "#0E0E0E" : "#F3F2EF";
  const border = dark ? "rgba(255,255,255,0.1)" : "rgba(14,14,14,0.12)";
  const activeColor = dark ? "#FFFFFF" : "#0E0E0E";
  const inactiveColor = dark ? "rgba(255,255,255,0.38)" : "#8C8C86";

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 390,
        height: 64,
        background: bg,
        borderTop: `1px solid ${border}`,
        display: "flex",
      }}
      aria-label="Main navigation"
    >
      {NAV.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                background: isActive ? activeColor : "transparent",
              }}
            />
            <span
              style={{
                ...MONO,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isActive ? activeColor : inactiveColor,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
