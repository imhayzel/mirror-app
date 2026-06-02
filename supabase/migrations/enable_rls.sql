-- Mirror — Enable RLS for Clerk auth
-- Run this in Supabase SQL Editor after setting up the Clerk JWT template.
--
-- PREREQUISITE: In Clerk Dashboard → JWT Templates → create a template named
-- "supabase" with the following claims:
--   { "sub": "{{user.id}}", "role": "authenticated" }
-- Then copy the signing key and add it to Supabase:
--   Dashboard → Settings → API → JWT Settings → JWT Secret
--
-- The policy uses (auth.jwt() ->> 'sub') which equals the Clerk user ID.

-- ─── wardrobe_items ───────────────────────────────────────────────────────────

ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wardrobe items"
  ON wardrobe_items FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON wardrobe_items FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON wardrobe_items FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON wardrobe_items FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- ─── outfit_suggestions ──────────────────────────────────────────────────────

ALTER TABLE outfit_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own outfit suggestions"
  ON outfit_suggestions FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own outfit suggestions"
  ON outfit_suggestions FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own outfit suggestions"
  ON outfit_suggestions FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own outfit suggestions"
  ON outfit_suggestions FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- ─── style_profiles ──────────────────────────────────────────────────────────

ALTER TABLE style_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own style profile"
  ON style_profiles FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own style profile"
  ON style_profiles FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own style profile"
  ON style_profiles FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- ─── ai_usage ─────────────────────────────────────────────────────────────────

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai usage"
  ON ai_usage FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own ai usage"
  ON ai_usage FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- ─── nps_responses ───────────────────────────────────────────────────────────

ALTER TABLE nps_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own nps response"
  ON nps_responses FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- ─── events ──────────────────────────────────────────────────────────────────

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
