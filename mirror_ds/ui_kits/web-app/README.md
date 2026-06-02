# Mirror — Web App UI Kit

High-fidelity interactive recreation of the **Mirror** desktop web app, in a browser-window frame. Same editorial system as the mobile kit: Newsreader serif, IBM Plex Mono utility labels, Archivo body + wide-tracked uppercase buttons, off-white paper, B&W imagery.

## Run it
Open `index.html`. Left rail navigates:
- **Today** — split editorial hero (statement + B&W plate) with the day's pieces and a 7-day strip.
- **Closet** — 4-up wardrobe grid with working filter pills + stats.
- **Planner** — weekly outfit planner; empty days invite planning.
- **Saved** — saved fits grid.
- **Add items** — opens the drag-photos capture modal.

## Architecture
Authored as small JSX sources, **bundled inline into `index.html`** (same rationale as the mobile kit — avoids the multi-external-babel-script race). Edit sources, then rebundle.

| File | Contents |
|---|---|
| `browser-window.jsx` | Browser chrome frame (starter component) |
| `web-ui.jsx` | Primitives (`W*` prefixed) + `Sidebar`, `PageBar` |
| `screen-today.jsx` | Dashboard / daily look + week strip |
| `screen-closet.jsx` | Wardrobe grid |
| `screen-planner.jsx` | Weekly planner |
| `app.jsx` | Controller + Saved + Add modal + mount |

## Notes
- Imagery = grayscale + grain placeholder plates (`WPlate`). Swap in real B&W photography.
- Icons via [Lucide](https://lucide.dev) CDN; fonts via Google Fonts CDN.
- The frame is 1240×780; the Design-System card previews it scaled to fit.
