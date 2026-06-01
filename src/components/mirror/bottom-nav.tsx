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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#0A0A0A] z-50">
      <div className="flex items-center h-[56px]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex items-center justify-center h-full",
                "font-sans text-[10px] font-semibold uppercase tracking-[0.1em] leading-[14px] transition-colors",
                isActive
                  ? "text-[#0A0A0A]"
                  : "text-[#5C5C5C] hover:text-[#0A0A0A]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
