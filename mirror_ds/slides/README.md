# Mirror — Slide Template

A branded 16:9 deck (1280×720) in the Mirror editorial system. Open `index.html`; navigate with **← / →** (or space), or the bottom control. Position persists across reloads.

## Slide types (one of each, as a template)
1. **Title** — dark full-bleed, soft radial light + grain, wordmark, big serif statement.
2. **Statement** — light, oversized serif with an italic emphasis word.
3. **Stats** — three big serif figures divided by hairlines.
4. **Image split** — half serif copy / half full-bleed B&W plate with caption.
5. **Comparison** — two hairline-ruled columns (without / with).
6. **Closing** — dark, serif call-to-action with a paper button.

## System
- **Backgrounds:** light = flat paper; dark = black with one soft radial + grain. Two background modes only.
- **Type:** Newsreader serif for all headlines/statements; IBM Plex Mono for kickers, footers, captions; Archivo for body + the wide-tracked uppercase button.
- **Footer:** wordmark left, `NN / NN` right, in mono.
- Swap the placeholder B&W plate on slide 4 for real photography.

> Each slide is a `<section class="slide">` inside `#deck`. Duplicate a section and bump the page numbers to extend. To make more decks, copy this file and edit the sections — the scaling/nav script needs no changes.
