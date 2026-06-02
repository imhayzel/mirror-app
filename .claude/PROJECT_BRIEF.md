# Mirror App — Project Context

## What is Mirror
AI-powered wardrobe manager and daily outfit suggestion web app.
Live production project built by a product designer using Claude Code.
**Tagline:** *Get dressed, decided.*

## Core Features (MVP)
1. **Closet** — add items via photo/URL, view in grid with filters, stats
2. **Outfit of the Day** — on-demand AI outfit suggestion (Claude Vision)
3. **Should I Buy This?** — paste URL or upload image, AI advises if item fits wardrobe
4. **Style Profile** — auto-generated from wardrobe, updates as items added
5. **Visual Render (tiered):**
   - Free: flat lay composition (CSS, no AI cost)
   - Premium: illustrated render via Replicate/fal.ai (~$0.03–0.05/render)
   - Phase 2: virtual try-on with user's own photo

## Freemium Model
- 3 free AI generations + 1 free illustrated render
- Paid: ~$7–9/month via Stripe (unlimited generations)
- Usage tracked in Supabase per user

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS
- Supabase (database + image storage)
- Clerk (auth — email + Google)
- Anthropic API / Claude Sonnet (AI features)
- Replicate API (illustrated renders — Phase 2)
- Vercel (deployment)

## Design System (mirror_ds/)
Editorial, monochrome, fashion-forward. Full system in `mirror_ds/`.
Always read `mirror_ds/README.md` and import `mirror_ds/colors_and_type.css` before any UI work.

### Typography
- **Newsreader** (serif) — headlines, display, editorial statements, wordmark
- **Archivo** (grotesque) — body copy + buttons/CTAs (UPPERCASE, 500–600wt, 0.22em tracking)
- **IBM Plex Mono** — passive labels only: nav, dates, counts, metadata (UPPERCASE, 0.14em tracking). Never for buttons.

### Colors
- Paper `#F3F2EF` — primary surface
- Ink `#0E0E0E` — near-black, primary text
- Card `#FAFAF8` — raised card surface
- Slate scale `--slate-900` to `--slate-100` — secondary/tertiary text
- **No brand accent hue** — drama from contrast + type + B&W imagery
- Semantic only: Positive `#2F7D5B`, Critical `#B23A33`
- Lines: `rgba(14,14,14,0.12)` hairlines — Mirror divides, does not box

### Key Rules
- Zero border radius (default) — pill `999px` for filter chips only
- Shadows: whisper-soft (`--shadow-1/2/3`), most UI flat
- Imagery: always B&W, high contrast, film grain
- Icons: Lucide thin line, never filled, never emoji
- Copy: declarative, spare, period-ended serif statements. Never emoji.
- Mobile-first always — 390px base, `md:` / `lg:` overrides after
- Spec before building — brief → constraints → layout → component spec → build → self-review

### Voice
Fashion editor on your side. Declarative, spare, dry wit.
- Headlines: sentence case serif, period-ended (*"Today, the camel coat."*)
- Labels/nav: UPPERCASE mono
- Buttons: UPPERCASE Archivo grotesque
- Body: sentence case Archivo
- Never emoji, never exclamation marks

## 10 MVP Screens
1. Landing
2. Onboarding (dark immersive, full-bleed)
3. Closet / Wardrobe (grid, filter pills, stats)
4. Add Item (dark capture flow)
5. Home / Today (daily outfit hero) ← currently being built
6. Outfit Detail (full look overlay)
7. Style Profile / You (style identity, stats)
8. Item Checker ("Should I buy this?")
9. Upgrade (freemium gate)
10. Settings

## Bottom Navigation (5 tabs — IBM Plex Mono labels)
Today / Closet / Add / Saved / You

## Phase 2 (not MVP)
Pinterest/social sync, weather-based suggestions, calendar integration,
virtual try-on with user photo, daily push/email delivery

## Design System Files
- `mirror_ds/README.md` — full brand context, visual rules, iconography
- `mirror_ds/colors_and_type.css` — all design tokens
- `mirror_ds/ui_kits/mobile-app/` — reference mobile screens (JSX)
- `mirror_ds/ui_kits/web-app/` — reference web screens (JSX)
- `mirror_ds/assets/` — logo wordmark + monogram SVG
- `CLAUDE.md` — project briefing for Claude Code
- `mirror_ds/SKILL.md` — design agent entry point

## Setup Status
✅ Homebrew, Node.js, GitHub (imhayzel), Claude Code installed and logged in
✅ mirror-app folder created at ~/mirror-app
✅ mirror_ds/ design system placed in project
⚠️ Next.js scaffold — in progress (Home/Today screen being built)
⚠️ Anthropic Console API key — not set up yet
⚠️ Replicate API key — not set up yet
⚠️ Vercel deployment — not set up yet
⚠️ Supabase, Clerk — accounts created, not yet wired up

## Anti-patterns (never)
- Any brand accent hue (no blue, purple, color accents)
- Rounded corners except pill chips and 2px input softening
- Heavy shadows or glassmorphism
- Emoji anywhere
- Lowercase nav/metadata labels
- Newsreader below 24px
- IBM Plex Mono for buttons
- Desktop-first layouts
- Colored photography filters
- Decorative gradients on light surfaces
