# Mirror — Mobile App UI Kit

A high-fidelity, interactive recreation of the **Mirror** iOS app: photograph your wardrobe, get a finished outfit each morning, browse your closet, and save fits. Built in the Mirror editorial system — Newsreader serif, IBM Plex Mono utility labels, Archivo body, off-white paper, black blocks, B&W imagery.

## Run it
Open `index.html`. It's an interactive click-through:
- **Today** — the daily outfit hero; *Shuffle* re-rolls the look; *See the full look* opens the outfit detail.
- **Closet** — wardrobe grid with working filter pills + stats.
- **Add** — dark immersive capture flow; the shutter "captures" thumbnails, then *Add items*.
- **Saved** — your saved fits grid.
- **You** — style identity, stats, settings.

## Architecture
The app is authored as small, well-factored JSX source files (below) and **bundled inline into `index.html`** as a single in-page Babel script. This avoids a race where multiple external `text/babel` scripts intermittently fail to execute in this preview environment.

> **Editing:** change a source `.jsx` file, then re-bundle into `index.html` (concatenate the files in the order listed, between the `<script type="text/babel">` markers). The source files are the canonical, editable units.

| File | Contents |
|---|---|
| `ios-frame.jsx` | Device bezel / status bar (starter component) |
| `mirror-ui.jsx` | Primitives: `Icon`, `Mono`, `Kicker`, `Serif`, `Button`, `Pill`, `Plate`, `GarmentTile`, `FieldRow`, `TopBar`, `TabBar`, `Screen`, `Divider` |
| `screen-today.jsx` | Daily outfit hero + `TODAY_LOOKS` data |
| `screen-closet.jsx` | Wardrobe grid + filters + `CLOSET` data |
| `screen-add.jsx` | Dark capture flow |
| `screen-outfit.jsx` | Outfit detail overlay |
| `screen-you.jsx` | Profile / settings |
| `app.jsx` | Controller + Saved screen + mount |

## Notes
- **Imagery** is represented by grayscale gradient + grain placeholder plates (`Plate`). Swap in real B&W garment photography to finish.
- **Icons** are [Lucide](https://lucide.dev) via CDN.
- Fonts via Google Fonts CDN.
