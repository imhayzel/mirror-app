---
version: alpha
name: Mirror
description: A bold, fashion-forward AI wardrobe and outfit suggestion app. High contrast, editorial, and sharp.
colors:
  primary: "#0A0A0A"
  on-primary: "#FFFFFF"
  secondary: "#FFFFFF"
  on-secondary: "#0A0A0A"
  accent: "#C8F000"
  on-accent: "#0A0A0A"
  surface: "#F5F5F0"
  surface-dim: "#E8E8E3"
  surface-container: "#FFFFFF"
  surface-container-high: "#F0F0EB"
  on-surface: "#0A0A0A"
  on-surface-variant: "#5C5C5C"
  outline: "#0A0A0A"
  outline-variant: "#D4D4CF"
  error: "#D4000F"
  on-error: "#FFFFFF"
  inverse-surface: "#0A0A0A"
  inverse-on-surface: "#F5F5F0"
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 80px
    fontWeight: "700"
    lineHeight: 84px
    letterSpacing: -0.03em
  display-md:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: "700"
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: "600"
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  none: 0px
  sm: 2px
  DEFAULT: 0px
  md: 0px
  lg: 0px
  full: 0px
spacing:
  unit: 8px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-padding: 24px
  card-gap: 2px
  section-margin: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    height: 52px
    padding: 0 32px
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    height: 52px
    padding: 0 32px
  button-secondary-hover:
    backgroundColor: "{colors.surface-dim}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    height: 52px
    padding: 0 32px
  input-field:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 52px
  input-field-focus:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
  card-wardrobe-item:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "0"
  card-wardrobe-item-hover:
    backgroundColor: "{colors.surface-dim}"
  card-outfit-result:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  card-style-profile:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  tag-item-type:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: 4px 10px
  badge-free:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
  badge-premium:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-lg}"
  nav-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
---

## Overview

Mirror is an AI-powered wardrobe and daily outfit suggestion app. The visual identity is bold, editorial, and fashion-forward — drawing from the aesthetic language of high-end fashion magazines like Vogue and System Magazine.

The UI is built on extreme contrast: near-black on warm off-white, with a single electric accent (Voltage Yellow-Green) reserved exclusively for key interactions and premium moments. Sharp edges replace all curves. Serif headlines create editorial gravitas while Inter provides crisp, functional readability for UI copy.

Mirror should feel like holding a premium fashion magazine that is also an intelligent interface. Every screen should feel considered, composed, and confident — never generic.

## Colors

The palette is deliberately restrained: two neutrals, one accent, and semantic utility colors.

- **Primary (#0A0A0A):** Near-black. The dominant ink color for all headlines, borders, buttons, and primary UI. Not pure black — slightly warm to avoid harshness on screen.
- **On-Primary (#FFFFFF):** Pure white. Used for text and elements placed on top of the primary color.
- **Secondary (#FFFFFF):** Pure white. Used for inverted surfaces and high-contrast moments.
- **Accent (#C8F000):** Voltage Yellow-Green. The sole expressive color in the system. Used sparingly and purposefully — hover states on primary buttons, active selections, style profile card backgrounds, and premium unlock moments. Its use should feel like a camera flash: rare, powerful, intentional.
- **Surface (#F5F5F0):** Warm off-white. The default page background. Slightly warm to feel editorial rather than clinical.
- **Surface Container (#FFFFFF):** Pure white. Used for cards and elevated surfaces to create subtle lift against the warm background.
- **On-Surface Variant (#5C5C5C):** Mid-grey for secondary text, captions, and metadata.
- **Outline (#0A0A0A):** All borders use the primary color at full weight — sharp and visible.
- **Error (#D4000F):** Deep editorial red for error states only.

**Rules:**
- Never use the accent color for more than one element per screen
- All borders are 1px solid `{colors.outline}` — no soft borders
- No gradients. No drop shadows. Separation is achieved through border lines and spacing alone.

## Typography

Mirror uses a dual-typeface system: **Playfair Display** for editorial presence, **Inter** for functional clarity.

- **Playfair Display** (serif): All headlines, display text, and screen titles. Conveys editorial authority and fashion heritage. Use Bold (700) and SemiBold (600) weights only.
- **Inter** (sans-serif): All body copy, labels, tags, navigation, and UI copy. Keeps the interface legible and modern. Use uppercase with wide tracking for all labels to reinforce the fashion editorial feel.

**Hierarchy rules:**
- Page titles always use `display-md` or `headline-lg` in Playfair Display
- Section labels always use `label-lg` in Inter, UPPERCASE, with `0.08em` letter spacing
- Body descriptions use `body-md` in Inter
- Never use Playfair Display below 24px
- Never mix both typefaces in the same text element

## Layout & Spacing

The layout follows a strict editorial grid. Content is dense but deliberately spaced — like a well-laid magazine spread.

- **Grid:** 12-column grid, 24px gutters on desktop, 16px on mobile
- **Base unit:** 8px. All spacing values are multiples of 8
- **Card gaps:** 2px gap between wardrobe item cards — intentionally tight, like a contact sheet
- **Section margins:** 64px between major page sections
- **Container padding:** 24px on all sides
- **No decorative dividers** — borders between sections use `1px solid {colors.outline}` only where structurally necessary

The wardrobe grid should feel like a fashion lookbook or editorial contact sheet: tight, precise, photographic.

## Elevation & Depth

Mirror uses zero shadow and zero blur effects. Depth is achieved through:

- **Border lines:** 1px solid borders define all card and container edges
- **Background contrast:** Surface containers (#FFFFFF) sit on the warm surface (#F5F5F0), creating subtle but clean separation
- **Color inversion:** The outfit result card inverts to dark (#0A0A0A background, white text) to create a strong focal moment
- **Accent pops:** The style profile card uses the accent background (#C8F000) to create hierarchy through color, not shadow

No `box-shadow`. No `backdrop-filter`. No elevation tokens needed.

## Shapes

Mirror uses a zero-radius shape language throughout. Every corner is sharp (0px border-radius).

- **All cards:** Sharp corners
- **All buttons:** Sharp corners
- **All inputs:** Sharp corners
- **All tags and badges:** Sharp corners

The only permitted exception is avatar/profile images, which may use `border-radius: 50%` for circular crop — but should be framed within a sharp-cornered container.

This sharp geometry references the precision of high-fashion editorial layouts and reinforces the bold, uncompromising character of the brand.

## Components

### Buttons

Three button variants — Primary, Secondary, and Accent. All are 52px height, sharp-cornered, with uppercase label typography. Primary is black fill. Secondary is outlined (1px border, transparent fill). Accent uses the Voltage Yellow-Green fill and is reserved for the single most important action on any given screen.

Hover state on Primary swaps to Accent fill — the only moment of yellow-green energy on dark surfaces.

### Cards

**Wardrobe Item Card:** White background, 1px black border, no padding — the clothing image fills the card edge to edge. Item name and type tag appear below the image in a 12px bottom strip.

**Outfit Result Card:** Inverted — black background, white text. Contains the flat lay image or illustrated render, Claude's outfit reasoning in body copy, and an optional "Get illustrated render" CTA in accent color.

**Style Profile Card:** Accent (#C8F000) background, black text. Contains the user's inferred style archetype as a large Playfair Display headline and supporting descriptors in Inter label type.

### Inputs

All inputs are 52px height, sharp-cornered, with a 1px black border. Focus state thickens the border to 2px — no color change, no glow. Placeholder text uses `on-surface-variant`.

### Tags & Badges

Item type tags (e.g. "TOP", "OUTERWEAR") use the surface-dim background in uppercase Inter label-sm. Premium badges use primary (black) background with white text. Free tier badges use surface-dim with black text.

### Navigation

Top navigation bar: white background, 1px black bottom border. Nav items in uppercase Inter label-lg. Active item switches to primary color. No underline indicators — weight and color carry the active state.

## Do's and Don'ts

**Do:**
- Use Playfair Display for all headlines — it is the editorial soul of Mirror
- Keep accent (#C8F000) use to one element per screen maximum
- Maintain tight 2px gaps in the wardrobe grid — density is intentional
- Use ALL CAPS for every label, tag, and navigation item
- Keep borders at exactly 1px — never thicker except for focused inputs

**Don't:**
- Never round any corner except profile image crops
- Never use drop shadows or blur effects
- Never use the accent color for error states or warning states — it must remain joyful and premium
- Never use Playfair Display below 24px — it loses legibility and character
- Never add decorative elements, illustrations, or gradients — the clothing photography is the art
