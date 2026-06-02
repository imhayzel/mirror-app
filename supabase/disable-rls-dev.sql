-- Dev only: disable RLS so demo-user can read/write without auth.
-- Run this in the Supabase SQL editor. Do NOT apply in production.
ALTER TABLE wardrobe_items       DISABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_suggestions   DISABLE ROW LEVEL SECURITY;
ALTER TABLE style_profiles       DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage             DISABLE ROW LEVEL SECURITY;
/