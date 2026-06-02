---
name: mirror-design
description: Use this skill to generate well-branded interfaces and assets for Mirror (an AI-powered wardrobe manager and daily outfit suggestion app), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What's here
- `README.md` — brand context, content fundamentals, visual foundations, iconography, and a file index. **Start here.**
- `colors_and_type.css` — all design tokens (color, type, spacing, radii, shadow, motion) + helper classes. Import or copy this into any deliverable.
- `assets/` — logo wordmark + monogram (SVG).
- `preview/` — design-system specimen cards (type, color, spacing, components, brand).
- `ui_kits/mobile-app/` and `ui_kits/web-app/` — high-fidelity interactive recreations; reusable JSX primitives + screens.
- `slides/` — branded 16:9 deck template.

## The system in one breath
Editorial, monochrome, fashion-forward. **Newsreader** serif for statements/headlines, **IBM Plex Mono** for uppercase utility labels/metadata, **Archivo** for body + wide-tracked uppercase buttons. Off-white paper (`#F3F2EF`), near-black ink (`#0E0E0E`), cool slate neutrals; **no brand accent hue** — drama comes from contrast, type, and high-contrast B&W imagery. Crisp corners, hairline dividers (divide, don't box), whisper-soft shadows, calm motion. Voice: a fashion editor on your side — declarative, spare, period-ended statements, never emoji.

## Conventions worth keeping
- Mono labels are passive (nav, dates, counts); grotesque-uppercase is for actions (buttons).
- Imagery is always grayscale + grain; swap placeholder plates for real B&W photography.
- Icons are [Lucide](https://lucide.dev) via CDN, thin single weight.
- When building multi-file React prototypes in this environment, **bundle JSX inline into one in-page `text/babel` script** rather than many external babel scripts (they race and intermittently fail). See either UI kit's `index.html`.
- Fonts load from Google Fonts CDN (Newsreader, Archivo, IBM Plex Mono).
