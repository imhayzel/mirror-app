"use client";

const OUTFIT_ITEMS = [
  { id: 1, name: "IVORY LINEN SHIRT", type: "TOP", bg: "#DDD8CC" },
  { id: 2, name: "CHARCOAL TROUSERS", type: "BOTTOM", bg: "#4A4A4A" },
  { id: 3, name: "TAN LOAFERS", type: "SHOES", bg: "#C4A882" },
] as const;

const REASONING =
  "A considered combination built around restraint. The ivory linen shirt reads effortless against the charcoal weight below — clean contrast, no aggression. Tan loafers ground the palette with warmth. This works for a day that could go either way.";

const NAV = ["TODAY", "WARDROBE", "STYLE", "SHOP", "PROFILE"] as const;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export default function HomePage() {
  const today = formatDate(new Date());

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative bg-[#F5F5F0]">

        {/* Status bar */}
        <div className="h-[44px] px-6 flex items-center justify-between shrink-0">
          <span className="font-sans text-[15px] font-semibold text-[#0A0A0A]">
            9:41
          </span>
          <div className="flex items-center gap-[6px]">
            <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true" focusable="false">
              <rect x="0" y="7" width="3" height="4" fill="#0A0A0A" />
              <rect x="4.3" y="4.5" width="3" height="6.5" fill="#0A0A0A" />
              <rect x="8.6" y="2" width="3" height="9" fill="#0A0A0A" />
              <rect x="12.9" y="0" width="3" height="11" fill="#0A0A0A" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true" focusable="false">
              <rect x="0.5" y="0.5" width="21" height="11" stroke="#0A0A0A" strokeWidth="1" fill="none" />
              <rect x="2" y="2" width="16" height="8" fill="#0A0A0A" />
              <line x1="23" y1="4.5" x2="23" y2="7.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </div>
        </div>

        {/* Top bar */}
        <header className="h-[56px] px-6 flex items-center justify-between border-b border-[#0A0A0A] shrink-0">
          <span className="font-display text-[24px] font-semibold leading-none text-[#0A0A0A]">
            Mirror
          </span>
          {/* Profile avatar — rounded-full is the sole permitted exception in the design system */}
          <div className="w-[36px] h-[36px] rounded-full bg-[#0A0A0A] flex items-center justify-center" aria-label="Profile">
            <span className="font-sans text-[13px] font-semibold text-white uppercase">
              H
            </span>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto pb-[80px]">

          {/* Date + primary CTA */}
          <div className="px-6 pt-8">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-6">
              {today}
            </p>
            <button
              type="button"
              className="w-full h-[52px] bg-[#0A0A0A] text-white font-sans text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-[#C8F000] hover:text-[#0A0A0A] transition-colors"
            >
              GET TODAY&apos;S OUTFIT
            </button>
          </div>

          {/* Last outfit — flat lay */}
          <div className="px-6 mt-8">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-4">
              LAST OUTFIT
            </p>

            {/* 3 clothing item cards — 2px gap, contact-sheet density */}
            <div className="flex gap-[2px]">
              {OUTFIT_ITEMS.map((item) => (
                <div key={item.id} className="flex-1 border border-[#0A0A0A] bg-white">
                  <div
                    className="w-full aspect-[3/4]"
                    style={{ backgroundColor: item.bg }}
                    role="img"
                    aria-label={item.name}
                  />
                  <div className="border-t border-[#0A0A0A] px-2 py-2">
                    <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[#0A0A0A] leading-[13px] truncate">
                      {item.name}
                    </p>
                    <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] leading-[13px]">
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outfit result card — inverted, black background */}
          <div className="mx-6 mt-[2px] bg-[#0A0A0A] p-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-4">
              CLAUDE&apos;S NOTES
            </p>
            <h2 className="font-display text-[24px] font-semibold leading-[30px] text-white mb-4">
              Today&apos;s Look
            </h2>
            <p className="font-sans text-[14px] leading-[22px] text-white/70">
              {REASONING}
            </p>
          </div>

        </main>

        {/* Bottom nav — accent dot is the ONE #C8F000 use on this screen */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[64px] bg-[#F5F5F0] border-t border-[#0A0A0A] flex"
          aria-label="Main navigation"
        >
          {NAV.map((label) => {
            const isActive = label === "TODAY";
            return (
              <button
                key={label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                className="flex-1 flex flex-col items-center justify-center gap-1"
              >
                <div
                  className="w-[5px] h-[5px]"
                  style={{ backgroundColor: isActive ? "#C8F000" : "transparent" }}
                />
                <span
                  className="font-sans text-[9px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: isActive ? "#0A0A0A" : "#5C5C5C" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
