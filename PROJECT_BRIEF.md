# Mirror — Project Brief
> *Get dressed, decided.*

AI-powered wardrobe manager and daily outfit suggestion app.
Built by a product designer using Claude Code.
Target: Beta launch weekend of 7–8 June 2026.

---

## Product Vision

Mirror is a smart wardrobe that learns how you dress. Users photograph or link what they own — Mirror catalogues it, learns their taste, and hands them a finished outfit every morning. Getting dressed becomes a decision already made.

Two cognitive streams:
- **Stream 1 (Blank slate):** Mirror decides completely. Zero input required.
- **Stream 2 (Partial intent):** User anchors with a piece, a vibe, or an occasion. Mirror fills the gaps.

---

## Beta Scope (Launch this weekend)

### What's in
- Email + password auth (Clerk)
- Beta access code on landing page
- AI outfit suggestion (Claude Vision)
- AI auto-categorize wardrobe items (OOTD photo, single item, product URL)
- AI item checker "Should I buy this?"
- Style profile auto-generation (5+ items)
- Daily limit: 5 AI calls per user per day
- Graceful limit message in Mirror voice
- NPS survey (triggers after 3rd confirmed outfit)
- Metrics tracking → Telegram daily digest
- Vercel deployment

### What's out (post-beta)
- Stripe / freemium gate
- Illustrated renders (Replicate)
- Virtual try-on (user's own photo)
- Google / Apple login
- Usage-based billing
- Public signup (invite-only beta)

---

## Beta Success Metrics (4-week review)

| Metric | Target | Meaning |
|---|---|---|
| DAU | >50% of users | People want this |
| Outfit confirmation rate | >40% | AI is good enough |
| Avg items per user | 10+ after 2 weeks | Wardrobe is growing |
| Week 2 retention | >60% | People come back |
| NPS score | >40 | Worth launching publicly |

Go/no-go decision after 4 weeks. All green → full product launch.

---

## Full Product Launch (post-beta)

Unlocked when beta metrics are proven:
- Stripe freemium ($7–9/month, 5 free AI calls then paid)
- Illustrated renders (Replicate) as premium feature
- Public signup (remove beta access code)
- Google / Apple login
- Virtual try-on research (Phase 2)
- Marketing / growth

---

## NPS Survey

Triggers after user's 3rd confirmed outfit (next app open, not immediately).

**Q1:** "How likely are you to recommend Mirror to a friend?" (0–10)
**Q2:** "What's the one thing Mirror does best for you?" (text)
**Q3:** "What's the one thing you'd want Mirror to do better?" (text)

Responses saved to `nps_responses` table. Included in Telegram daily digest.

---

## Telegram Daily Digest

Sends at 8am daily to founder's Telegram chat.
Claude API formats the digest from Supabase metrics.

```
MIRROR DAILY DIGEST
━━━━━━━━━━━━━━━━━━━━
📅 [Date]

USERS
Total signed up: X
Active today: X (X%) 
Active this week: X (X%)

WARDROBE
Avg items per user: X
New items added today: X

AI USAGE
Outfit suggestions today: X
Confirmation rate: X%
Item checker uses: X
Avg calls remaining: X/user

NPS
Responses: X/X users
Score: X
Latest feedback: "..."

ALERTS
⚠️ Any anomalies or issues
━━━━━━━━━━━━━━━━━━━━
```

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Auth:** Clerk (email + password, beta access code gate)
- **Database:** Supabase (Postgres + Storage)
- **AI:** Anthropic API / Claude Sonnet (vision + reasoning)
- **Renders:** Replicate / fal.ai (post-beta)
- **Notifications:** Telegram Bot API + Vercel cron
- **Deployment:** Vercel

---

## Design System

Full system in `mirror_ds/`. Always read `mirror_ds/README.md` and import `mirror_ds/colors_and_type.css` before any UI work.

- **Newsreader** — headlines, display, editorial statements
- **Archivo** — body copy, buttons/CTAs (UPPERCASE, 0.22em tracking)
- **IBM Plex Mono** — passive labels, nav, metadata (UPPERCASE, 0.14em)
- **Paper** `#F3F2EF` — primary surface
- **Ink** `#0E0E0E` — near-black
- **No brand accent** — drama from contrast + type + B&W imagery
- Zero border radius (except pill chips)
- No shadows, blur, or gradients
- Mobile-first at 390px always

---

## Screens (all built)

| Screen | Route | Status |
|---|---|---|
| Landing | /landing | ✅ |
| Onboarding | /onboarding | ✅ |
| Home / Today | / | ✅ |
| Closet | /closet | ✅ |
| Add Item | /add | ✅ |
| Item Detail | /closet/[id] | ✅ |
| Outfit Result | /outfit | ✅ |
| Outfits / Lookbook | /outfits | ✅ |
| You / Style Profile | /you | ✅ |
| Item Checker | /checker | ✅ |
| Settings | /settings | ✅ |

---

## Database Schema

```sql
wardrobe_items (id, user_id, name, type, color, image_url, descriptors[], created_at)
outfit_suggestions (id, user_id, items, reasoning, worn bool, created_at)
style_profiles (id, user_id, archetype, descriptors, updated_at)
ai_usage (id, user_id, feature, created_at)
nps_responses (id, user_id, score, best_feature, improvement, created_at)
events (id, user_id, event_type, metadata jsonb, created_at)
```

---

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://xzbqcjfpsumujnbuiyph.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
REPLICATE_API_TOKEN=         # post-beta
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
BETA_ACCESS_CODE=
```

---

## AI Features (all pre-launch)

1. **Auto-categorize** — OOTD photo / single item / product URL → Claude Vision extracts name, type, color, image. Zero manual entry.
2. **Outfit of the Day** — Claude Vision analyses wardrobe → suggests complete outfit for weather + occasion context
3. **Build around a piece** — user anchors one item → Claude fills the rest
4. **Vibe-based suggestion** — user describes feeling → Claude interprets from wardrobe
5. **Occasion-based suggestion** — user states occasion → Claude dresses them for it
6. **Item Checker** — paste URL or upload image → Claude advises buy or skip based on wardrobe
7. **Style Profile** — auto-generated after 5+ items, updates as wardrobe grows

---

## Build Order (this week)

```
Tuesday:   Clerk auth + beta access code + Anthropic API setup
Wednesday: AI features (outfit, auto-categorize, item checker)
Thursday:  Storage + daily limit + NPS + Telegram agent
Friday:    Vercel deploy + end-to-end testing + launch
```

---

## Agent System

- `CLAUDE.md` — briefs Claude Code on Mirror every session
- `.claude/skills/product-designer/SKILL.md` — Senior Product Designer agent
- `mirror_ds/SKILL.md` — design system agent entry point

---

## Committed Decisions

- Beta access code instead of public signup
- 5 AI calls per day per user limit
- No Stripe in beta — full access for all beta users
- NPS after 3rd confirmed outfit
- Telegram daily digest at 8am
- demo-user replaced with real Clerk user IDs after auth
- RLS re-enabled with proper policies after Clerk is wired
