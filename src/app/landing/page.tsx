import Link from "next/link";

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

export default function LandingPage() {
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
            style={{ fontSize: "11px" }}
          >
            SIGN IN
          </Link>
          <Link
            href="/onboarding"
            className="font-mono-label text-[#0E0E0E] hover:text-[#6B6B66] transition-colors duration-200"
            style={{ fontSize: "11px" }}
          >
            GET STARTED
          </Link>
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
        {/* B&W placeholder — editorial fashion image stand-in */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #2c2c2c 0%, #1a1a1a 25%, #0f0f0f 55%, #050505 100%)",
          }}
        />
        {/* Film grain overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        {/* Scrim */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

        {/* Content */}
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

          <Link
            href="/onboarding"
            className="landing-btn-white w-full md:w-auto flex items-center justify-center md:inline-flex"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              height: "56px",
              paddingLeft: "40px",
              paddingRight: "40px",
              textDecoration: "none",
              transition: "background 200ms",
            }}
          >
            GET STARTED →
          </Link>
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

          <Link
            href="/onboarding"
            className="landing-btn-white w-full md:w-auto inline-flex items-center justify-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              height: "56px",
              paddingLeft: "40px",
              paddingRight: "40px",
              textDecoration: "none",
              transition: "background 200ms",
            }}
          >
            START FOR FREE →
          </Link>
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
    </div>
  );
}
