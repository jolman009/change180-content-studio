-- Migration: Create base tables (brand_profiles, content_posts, performance_logs)
-- These tables were originally created manually in hosted Supabase.
-- This migration ensures they exist for local dev via `supabase start`.

create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default '',
  target_audience text not null default '',
  mission text not null default '',
  tone_rules text not null default '',
  preferred_ctas text not null default '',
  banned_phrases text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.content_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null default '',
  content_type text not null default '',
  pillar text not null default '',
  goal text not null default '',
  tone text not null default '',
  topic text not null default '',
  context text default '',
  status text not null default 'draft',
  hook text default '',
  body text default '',
  cta text default '',
  hashtags text[] default '{}',
  visual_direction text default '',
  scheduled_for date,
  created_at timestamptz default now()
);

create table if not exists public.performance_logs (
  id uuid primary key default gen_random_uuid(),
  post_title text not null default '',
  platform text not null default '',
  outcome text default '',
  insight text default '',
  next_move text default '',
  logged_at timestamptz default now()
);
