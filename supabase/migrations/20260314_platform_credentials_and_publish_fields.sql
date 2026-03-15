-- Migration: Platform credentials table + publish fields on content_posts
-- Run date: 2026-03-14

-- 1. CREATE platform_credentials TABLE
create table if not exists public.platform_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  platform text not null,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  platform_user_id text,
  platform_username text,
  connected_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, platform)
);

-- 2. ENABLE ROW LEVEL SECURITY
alter table public.platform_credentials enable row level security;

-- 3. RLS POLICIES
create policy "Users can view own platform credentials"
  on public.platform_credentials for select using (auth.uid() = user_id);
create policy "Users can insert own platform credentials"
  on public.platform_credentials for insert with check (auth.uid() = user_id);
create policy "Users can update own platform credentials"
  on public.platform_credentials for update using (auth.uid() = user_id);
create policy "Users can delete own platform credentials"
  on public.platform_credentials for delete using (auth.uid() = user_id);

-- 4. INDEXES
create index if not exists idx_platform_credentials_user_id_platform
  on public.platform_credentials(user_id, platform);

-- 5. AUTO-UPDATE updated_at TRIGGER (reuses existing handle_updated_at function)
create trigger set_platform_credentials_updated_at
  before update on public.platform_credentials
  for each row execute function public.handle_updated_at();

-- 6. ADD PUBLISH FIELDS TO content_posts
alter table public.content_posts
  add column if not exists platform_post_id text;

alter table public.content_posts
  add column if not exists published_at timestamptz;

alter table public.content_posts
  add column if not exists publish_error text;
