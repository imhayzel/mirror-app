# Mirror — Design System

**Mirror** is an AI-powered wardrobe manager and daily outfit suggestion app. You photograph what you own; Mirror catalogues it, learns the silhouettes you actually reach for, and hands you a finished outfit every morning — so getting dressed becomes a decision already made.

The brand voice is that of a **fashion editor crossed with a quietly confident personal stylist**: declarative, spare, a little wry. The visual world is **editorial and monochrome** — refined serif headlines, monospace utility labels, clean grotesque body copy, gallery whitespace, and black-and-white imagery. Think the typographic discipline of *Co-Star* meeting the fashion-editorial gravity of a *JUUN.J* lookbook.

> **Tagline:** *Get dressed, decided.*

---

## Sources & provenance

This system was built **from scratch** — there was no existing codebase, Figma, or brand kit. Direction was set by the user and by reference screenshots they supplied:

- **Co-Star** (mobile app, via Mobbin) — the dominant reference. Establishes the serif-display + monospace-label + grotesque-body trio, off-white paper, black/white blocks, hairline dividers, pill tags, full-width mono buttons, and dark full-bleed immersive onboarding screens. *Translate Co-Star's cosmic B&W imagery → fashion / fabric / runway B&W imagery for Mirror.*
- **JUUN.J** (fashion brand website) — establishes the big bold uppercase grotesque headlines, B&W editorial photography, generous gallery whitespace, marquee text strips, and dark footer.

Stated preferences: vibe = *editorial & fashion-forward (Vogue-like, gallery whitespace)*; audience = *style-conscious women 25–40*; color = *cool & minimal (off-white, slate, charcoal)*; surfaces = *mobile app + web app*; sample slides = *yes*.

Reference screenshots are stored in `uploads/`.

---

## Content Fundamentals

How Mirror writes. Copy is a core part of the brand — it should always feel composed, never chatty.

**Voice** — A fashion editor who is on your side. Confident, declarative, economical. Never bubbly, never salesy, never uses exclamation marks. A dry wit is welcome; cuteness is not.

**Person** — Address the user as **you**. Mirror refers to itself rarely and never as "I" — it's an instrument, not a personality. Prefer "Today, the camel coat." over "I think you should wear…".

**Casing**
- **Headlines & statements:** sentence case, in the serif. End full-sentence statements with a period — the period is part of the look (*"Get dressed, decided."*, *"Today, the camel coat."*).
- **Labels, nav, metadata:** UPPERCASE in monospace with wide tracking (*WARDROBE*, *WED · MAY 29*). **Buttons / CTAs:** UPPERCASE in the grotesque sans (Archivo 600, ~0.1em tracking) — a distinct, fashion-CTA voice that separates *actions* from passive mono labels (*GET DRESSED*, *ADD TO CLOSET*).
- **Body:** sentence case, grotesque sans.

**Length** — Short. A headline is one line, maybe two. A supporting line is one sentence. Lists beat paragraphs. White space does the talking.

**Numbers as drama** — Use real counts to make a point, sparingly: *"Your closet holds 84 pieces. You reach for 11."* Never decorate with invented stats.

**Emoji** — **Never.** Not in product, not in marketing. (Co-Star uses occasional astrological glyphs; Mirror's equivalent is a small set of line icons and the multiplication-sign motif `✕`, never emoji.)

**Examples**
- Daily hero: *"Today, you're wearing the camel coat."*
- Empty state: *"Nothing here yet. Your closet is a blank page."*
- Add flow: *"A few photos. We'll handle the rest."*
- Button labels: `GET DRESSED` · `ADD TO CLOSET` · `SHUFFLE` · `SAVE THIS FIT` · `SKIP`
- Kicker → headline: `TODAY ▸` over *"The wool overcoat."*
- Wry aside: *"You've worn this three Tuesdays running. Bold."*

---

## Visual Foundations

**Palette** — Essentially monochrome. Off-white **Paper** `#F3F2EF` is the world; near-black **Ink** `#0E0E0E` is type and the solid blocks. A cool **slate** neutral scale carries secondary/tertiary text. Color is *functional only* — muted forest `#2F7D5B` for confirmations, muted brick `#B23A33` for destructive/errors — and appears in tiny doses. There is **no brand accent hue**; the drama comes from contrast, type, and imagery, not color.

**Typography** — Three families, each with a strict job:
- **Newsreader** (modern editorial serif, *moderate even contrast*) — display, headlines, editorial statements, large field values, the wordmark. This is the brand's voice. Chosen over a true Didone (Bodoni/Didot) for far better readability at text sizes and broad multi-language glyph coverage, while keeping the high-end editorial feel.
- **Archivo** (grotesque sans) — body copy, UI labels, and big bold uppercase graphic headlines (the JUUN.J move).
- **IBM Plex Mono** — passive utility text: kickers, nav, dates, weather, counts, metadata. Wide tracking (`0.14em`), uppercase. *(Buttons use Archivo uppercase, not mono — see Buttons below.)*
See `colors_and_type.css` for the full token set and `preview/type-*` cards.

**Spacing** — 4px base unit. Generous. Gallery whitespace is a feature: hero moments get `--space-9/10` of breathing room. Density is reserved for metadata lists.

**Backgrounds** — Two modes. **Light:** flat Paper, no gradients, no texture; structure comes from hairline rules and type. **Dark:** full-bleed black with a single soft radial light and a fine grain overlay, used for onboarding, covers, and hero moments. Never use decorative gradients on light surfaces.

**Imagery** — Always **black & white**, high contrast, with a fine film grain. Cool, never warm; never colored filters or duotones in hue. Fashion/fabric/runway subjects. Imagery is often full-bleed and treated as a gallery plate. *(No real photography ships in this kit — garment imagery is represented by neutral grayscale placeholder tiles with a grain overlay. See Caveats.)*

**Corners** — Crisp. `--radius-0` (square) is the default — buttons, cards, fields, image plates are all sharp-cornered, which reads editorial. The **pill** (`999px`) is reserved exclusively for filter tags / chips. Inputs may take a 2px softening at most.

**Buttons** — Full-width primary on mobile; auto-width on web. Typeset in **Archivo (grotesque), uppercase, weight 500, ~0.22em tracking** — restraint over boldness: the wide letter-spacing carries the elegance, not the weight. Deliberately *not* monospace, so CTAs read as composed fashion-house actions distinct from the mono utility labels. Variants: solid ink (primary), white w/ hairline (secondary), outline-ink (tertiary), translucent-white on dark. Square corners.

**Borders & dividers** — Hairlines do the structural work: `--line` (12% ink) divides content; Mirror **divides, it does not box**. Cards use a single hairline border, not heavy outlines. Full-width dividers separate field rows and list items.

**Elevation / shadows** — Whisper-soft and cool (`--shadow-1/2/3`). Cards barely lift. Bottom sheets and modals get the only real shadow. Most of the UI is flat; hierarchy is typographic, not shadow-driven.

**Motion** — Calm and settled. Primary easing `cubic-bezier(0.22,1,0.36,1)` (a gentle out-settle), `240ms` default. Fades and short slide-ups for sheets; no bounce, no spring, no playful overshoot. Marquee strips scroll linearly and slowly.

**Hover states** — Light surfaces darken with a 4% ink wash (`--fill-hover`); links and mono labels move from slate toward full Ink. On dark, controls brighten via opacity. No color shifts.

**Press states** — Deepen the wash to 8% (`--fill-press`); solid black buttons invert toward `--ink-soft`. A subtle `0.99` scale at most — restraint over playfulness.

**Transparency & blur** — Used sparingly: translucent white-on-dark for secondary controls (e.g. `SKIP`), and a light scrim under bottom sheets. No heavy glassmorphism.

**Layout rules** — Bottom tab bar fixed on mobile (mono labels). Sticky lightweight top bar with the wordmark centered or left. Generous outer gutters (`--gutter`, clamps 20–80px). Content sits on a single column on mobile; the web app uses a left rail + content canvas.

---

## Iconography

Mirror's icon language is **thin, single-weight line icons** — minimal, geometric, never filled, never playful. This matches the hairline-and-type aesthetic.

- **Set:** [**Lucide**](https://lucide.dev) (1.5–2px stroke, rounded joins), linked from CDN:
  `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>` then `lucide.createIcons()`.
  This is a **substitution** — the brand has no proprietary icon set yet. Lucide was chosen because its even, thin stroke and restraint suit the editorial tone. *Flag for the user if a bespoke set is desired.*
- **Common icons:** `shirt`, `camera`, `plus`, `search`, `sparkles` (use sparingly for "AI"), `heart`, `calendar`, `chevron-left`, `x`, `shuffle`, `cloud-sun`.
- **Glyphs as motif:** the multiplication sign `✕` is the brand's punctuation mark — it separates marquee phrases and dates. Used typographically, not as an icon.
- **Emoji / unicode as icons:** never emoji. Occasional typographic unicode (`·` `—` `▸` `✕`) for separators and kickers only.
- **Icon + serif pairing:** section headers pair a small (18–20px) Lucide line icon with a serif title (see `preview/comp-section-header`).

No icons are drawn by hand; Lucide is loaded from CDN. The wordmark and monogram in `assets/` are the only bespoke vector marks.

---

## Index / manifest

**Root**
- `README.md` — this file.
- `colors_and_type.css` — all design tokens (color, type families + semantic roles, spacing, radii, shadow, motion) and helper classes (`.display`, `.h1`, `.title`, `.body`, `.label`, `.caption`). Import this in any deliverable.
- `SKILL.md` — Agent-Skills-compatible entry point.

**`assets/`** — brand marks
- `logo-wordmark.svg` — "Mirror" wordmark (Newsreader) with reflection.
- `logo-monogram.svg` — black-tile "M" app-icon monogram.

**`preview/`** — 25 Design-System tab cards (Type, Colors, Spacing, Components, Brand). Self-contained; tokens inlined.

**`ui_kits/`** — high-fidelity interactive recreations
- `mobile-app/` — the iOS app: Today, Closet, Add item, Outfit detail, Profile. Open `index.html`.
- `web-app/` — the desktop web app: dashboard, wardrobe grid, outfit planner. Open `index.html`.

**`slides/`** — branded 16:9 deck template (single `index.html`, six editorial slide types). 1280×720. See `slides/README.md`.

**`uploads/`** — source reference screenshots.

---

## Caveats

- **Fonts** are loaded from **Google Fonts CDN** (Newsreader, Archivo, IBM Plex Mono), not bundled as local files — flagged for the user; supply licensed files for `fonts/` if a self-hosted build is needed.
- **Icons** use **Lucide** as a substitute for a (non-existent) bespoke set — flagged above.
- **Photography** is represented by **grayscale placeholder tiles with grain**, since no real imagery exists yet. Drop real B&W fashion photos in to finish the look.
- Everything here is an **original brand created for this brief**, informed by the reference apps' *visual grammar* — not a copy of Co-Star or JUUN.J.
