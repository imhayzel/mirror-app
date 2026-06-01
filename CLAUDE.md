# Mirror

AI-powered wardrobe manager and daily outfit suggestion web app.

## Design System

This project uses `DESIGN.md` (Google Labs format) as the single source of truth for all visual decisions. Read `DESIGN.md` before writing any UI code.

Key rules:
- Fonts: Playfair Display (headlines) + Inter (body/labels)
- Zero border radius on everything except circular profile images
- Accent color #C8F000 used max once per screen
- No shadows, no blur, no gradients
- All labels and tags in UPPERCASE
- **Always design for mobile-first.** Build and spec every screen at 390px width first. Scale up to desktop after mobile is complete and approved.

## Design Agent

This project uses a Senior Product Designer agent at `.claude/skills/product-designer/SKILL.md`. Invoke it for any UI task:
- "Design the [screen name] using the Mirror designer agent"
- "Review this component against Mirror's design system"
- "Does this match Mirror's taste profile?"

The agent reads `DESIGN.md` first, specs before building, and self-reviews against anti-slop rules before output.

## Stack

- Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- Supabase (database + image storage)
- Clerk (auth)
- Anthropic API / Claude Sonnet (AI features)
- Replicate API (illustrated outfit renders — Phase 2)

## MVP Screens

1. Landing
2. Onboarding (style quiz)
3. Wardrobe (grid)
4. Add Item
5. Home / Today
6. Outfit Result
7. Style Profile
8. Item Checker ("Should I Buy This?")
9. Upgrade (freemium gate)
10. Settings

## AI Features

1. **Outfit of the Day** — Claude Vision analyzes wardrobe items, suggests outfit combination
2. **Should I Buy This?** — user pastes URL or uploads image, Claude advises if item fits their wardrobe
3. **Style Profile** — auto-generated from wardrobe, updates as items are added

## Visual Render (Tiered)

- **Free:** Flat lay composition (instant, no AI cost)
- **Premium:** Illustrated outfit render via Replicate / fal.ai (~$0.03–0.05 per render)
- **Phase 2:** Virtual try-on with user's own photo

## Freemium Model

- 3 free AI generations + 1 free illustrated render
- Paid tier: unlimited generations (~$7–9/month via Stripe)
- Track usage in Supabase per user

## Build Order

1. Auth + Wardrobe (upload, grid, delete)
2. Outfit suggestion + flat lay render
3. Style profile + item checker
4. Illustrated render + freemium gate
5. Polish + landing page + deploy

## Phase 2 (NOT in MVP)

- Pinterest / social board sync
- Weather-based suggestions
- Calendar integration
- Virtual try-on with user's own photo
- Daily push / email outfit delivery

## Environment Variables

All API keys go in `.env.local`. Never commit this file.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=        # not set up yet
REPLICATE_API_TOKEN=      # not set up yet
```

## Notes

- Anthropic Console API key: not set up yet
- Replicate API key: not set up yet
- Vercel deployment: not set up yet
- Mobile-first means: write Tailwind classes for mobile base, then `md:` and `lg:` overrides for larger screens
