"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "TODAY",    href: "/home" },
  { label: "WARDROBE", href: "/wardrobe" },
  { label: "STYLE",    href: "/style" },
  { label: "CHECKER",  href: "/checker" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link
          href="/home"
          className="font-display text-[24px] font-semibold leading-[30px] text-[#0A0A0A] shrink-0"
        >
          Mirror
        </Link>

        {/* Nav items — hidden on mobile, shown md+ */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-sans text-[13px] font-semibold uppercase tracking-[0.08em] leading-[16px] transition-colors",
                  isActive
                    ? "text-[#0A0A0A]"
                    : "text-[#5C5C5C] hover:text-[#0A0A0A]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings — hidden on mobile (accessible via bottom nav) */}
        <Link
          href="/settings"
          className="hidden md:block font-sans text-[13px] font-semibold uppercase tracking-[0.08em] leading-[16px] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          SETTINGS
        </Link>

        {/* Mobile: settings link as a minimal text link */}
        <Link
          href="/settings"
          className="md:hidden font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          SETTINGS
        </Link>
      </div>
    </header>
  );
}
