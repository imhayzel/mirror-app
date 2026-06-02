# Mirror
> *Get dressed, decided.*

AI-powered wardrobe manager and daily outfit suggestion app.
**Beta launch: weekend of 7–8 June 2026.**

---

## Critical Context

We are in active beta launch sprint. Every session should move toward launch. Build fast, commit often, test in browser after every feature.

**Current phase:** Pre-launch — wiring up Clerk auth, Anthropic API, Supabase Storage, Telegram agent, then deploying to Vercel.

---

## Design System

Read `mirror_ds/README.md` and `mirror_ds/colors_and_type.css` before ANY UI work. Read `mirror_ds/ui_kits/mobile-app/` for screen references.

### Typography (strict roles — never mix)
- **Newsreader** — all headlines, display, editorial statements, wordmark
- **Archivo** — body copy + ALL buttons/CTAs (UPPERCASE, weight 500–600, 0.22em tracking)
- **IBM Plex Mono** — passive labels ONLY: nav, dates, counts, metadata, kickers (UPPERCASE, 0.14em). NEVER for buttons.

### Colors
- Paper `#F3F2EF` — all page backgrounds
- Ink `#0E0E0E` — primary text, buttons, borders
- Card `#FAFAF8` — raised surfaces
- Slate scale — secondary/tertiary text
- **No brand accent** — no #C8F000, no blue, no color accents
- Positive `#2F7D5B` — confirmations only
- Critical `#B23A33` — errors/destructive only
- Lines: `rgba(14,14,14,0.12)` hairlines

### Rules (non-negotiable)
- Zero border radius everywhere (pill 999px for filter chips only)
- No shadows except `--shadow-sheet` on bottom sheets
- No gradients, no blur, no glassmorphism
- No emoji anywhere in UI
- Mobile-first always — 390px base, then md: lg: overrides
- Spec before building — brief → constraints → layout → build → self-review

---

## Stack

- Next.js 14, TypeScript, Tailwind CSS
- Supabase (Postgres + Storage)
- Clerk (auth — email + password, beta access code gate)
- Anthropic API / Claude Sonnet (all AI features)
- Telegram Bot API + Vercel cron (daily metrics digest)
- Replicate (post-beta, illustrated renders)
- Vercel (deployment)

---

## All Screens (complete)

| Screen | Route |
|---|---|
| Landing | /landing |
| Onboarding | /onboarding |
| Home / Today | / |
| Closet | /closet |
| Add Item | /add |
| Item Detail | /closet/[id] |
| Outfit Result | /outfit |
| Outfits Lookbook | /outfits |
| You / Style Profile | /you |
| Item Checker | /checker |
| Settings | /settings |

---

## Navigation

4-tab bottom nav: TODAY / CLOSET / OUTFITS / YOU
Shared component: `src/components/BottomNav.tsx`
Settings accessible from YOU screen via gear icon.

---

## Database

Supabase project: `xzbqcjfpsumujnbuiyph.supabase.co`

```sql
wardrobe_items (id, user_id, name, type, color, image_url, descriptors[], created_at)
outfit_suggestions (id, user_id, items jsonb, reasoning text, worn bool, created_at)
style_profiles (id, user_id, archetype text, descriptors text[], updated_at)
ai_usage (id, user_id, feature text, created_at)
nps_responses (id, user_id, score int, best_feature text, improvement text, created_at)
events (id, user_id, event_type text, metadata jsonb, created_at)
```

RLS currently disabled for dev. Re-enable with proper Clerk user policies after auth is wired.

---

## AI Features to Build

1. **Auto-categorize** (`src/app/api/categorize/route.ts`)
   - Input: image file OR product URL
   - Claude Vision extracts: name, type, color, best image URL
   - Returns: pre-filled wardrobe item, user confirms

2. **Outfit of the Day** (`src/app/api/outfit/route.ts`)
   - Input: user's wardrobe items + weather + occasion context
   - Claude suggests: 3–4 items that work together
   - Returns: item IDs + outfit name + styling reasoning

3. **Build around a piece** (same outfit API, anchor param)
   - Input: one locked item + rest of wardrobe
   - Claude fills: complementary items

4. **Vibe/Occasion suggestion** (same outfit API, context param)
   - Input: text description of vibe or occasion
   - Claude interprets and suggests from wardrobe

5. **Item Checker** (`src/app/api/checker/route.ts`)
   - Input: product URL or image
   - Claude advises: BUY or SKIP + reasoning + wardrobe pairings

6. **Style Profile** (`src/app/api/style-profile/route.ts`)
   - Input: all wardrobe items (5+ required)
   - Claude generates: archetype name + descriptors + colour palette

---

## Daily Limit

5 AI calls per user per day. Tracked in `ai_usage` table.

```typescript
// Check before every AI call
const today = new Date().toISOString().split('T')[0]
const { count } = await supabase
  .from('ai_usage')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .gte('created_at', today)

if (count >= 5) {
  return { error: 'daily_limit_reached' }
}
```

Limit message in Mirror voice:
> "You've had five looks today. Come back tomorrow."
> IBM Plex Mono caption: "RESETS DAILY AT MIDNIGHT"

---

## NPS Survey

Triggers after user's 3rd confirmed outfit (next app open).
Tracked via `events` table (event_type: 'outfit_confirmed').

3 questions:
1. "How likely are you to recommend Mirror to a friend?" (0–10)
2. "What's the one thing Mirror does best for you?" (text)
3. "What's the one thing you'd want Mirror to do better?" (text)

Saves to `nps_responses` table.

---

## Telegram Daily Digest

Vercel cron job runs at 8am daily.
Queries Supabase metrics → Claude formats digest → Telegram Bot API sends.

Env vars needed: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

---

## Beta Access Code

Simple env var check on landing page before signup:
```typescript
if (enteredCode !== process.env.BETA_ACCESS_CODE) {
  // show error
}
```

---

## User IDs

Currently using `demo-user` hardcoded everywhere.
After Clerk is wired: replace with `userId` from Clerk session.

```typescript
// Pattern to use after Clerk setup
import { auth } from '@clerk/nextjs'
const { userId } = auth()
```

---

## Build Order This Week

```
Tuesday:   Clerk auth + beta access code + Anthropic API key
Wednesday: AI features (outfit, auto-categorize, item checker, style profile)
Thursday:  Supabase Storage + daily limit + NPS UI + Telegram agent
Friday:    Vercel deploy + end-to-end test + launch
```

---

## Commit Convention

Commit after every working feature. Tell Claude Code "commit and push this" — it handles git add, commit message, and push.

Format: `add [feature]` / `fix [issue]` / `update [thing]`

---

## Anti-patterns (never do these)

- Rounded corners except pill filter chips
- Brand accent colors or any color other than ink/paper/slate/semantic
- Box shadows or glassmorphism
- Emoji in UI
- Lowercase nav or metadata labels
- IBM Plex Mono for buttons (Archivo only)
- Desktop-first layouts
- Colored photography or gradients
- Committing .env.local (always in .gitignore)
