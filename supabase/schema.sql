-- Mirror — database schema
-- Run this in the Supabase SQL editor to initialise all tables.

create table if not exists wardrobe_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  name        text not null,
  type        text not null,         -- e.g. top, bottom, shoes, outerwear, accessory
  color       text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists wardrobe_items_user_id_idx on wardrobe_items (user_id);

-- -----------------------------------------------------------------

create table if not exists outfit_suggestions (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  items       jsonb not null,        -- array of wardrobe_item ids
  reasoning   text,
  created_at  timestamptz not null default now()
);

create index if not exists outfit_suggestions_user_id_idx on outfit_suggestions (user_id);

-- Migration: track whether a suggestion was actually worn
ALTER TABLE outfit_suggestions ADD COLUMN IF NOT EXISTS worn boolean DEFAULT false;

-- -----------------------------------------------------------------

create table if not exists style_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null unique,
  archetype   text,                  -- e.g. "Minimal", "Classic", "Eclectic"
  descriptors jsonb,                 -- string array of style words
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------

create table if not exists ai_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  feature     text not null,         -- outfit_suggestion | item_checker | style_profile
  created_at  timestamptz not null default now()
);

create index if not exists ai_usage_user_id_idx on ai_usage (user_id);

-- -----------------------------------------------------------------
-- Migration: add style descriptors to wardrobe items
ALTER TABLE wardrobe_items ADD COLUMN IF NOT EXISTS descriptors text[] DEFAULT '{}';
