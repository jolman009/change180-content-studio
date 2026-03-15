-- Migration: Add user_id + RLS to existing tables
-- Run date: 2026-03-14

-- 1. ADD user_id COLUMN TO EXISTING TABLES
alter table public.brand_profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.content_posts
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.performance_logs
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2. SET DEFAULT for future inserts
alter table public.brand_profiles
  alter column user_id set default auth.uid();

alter table public.content_posts
  alter column user_id set default auth.uid();

alter table public.performance_logs
  alter column user_id set default auth.uid();

-- 3. ENABLE ROW LEVEL SECURITY
alter table public.brand_profiles enable row level security;
alter table public.content_posts enable row level security;
alter table public.performance_logs enable row level security;

-- 4. RLS POLICIES
create policy "Users can view own brand profiles"
  on public.brand_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own brand profiles"
  on public.brand_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own brand profiles"
  on public.brand_profiles for update using (auth.uid() = user_id);
create policy "Users can delete own brand profiles"
  on public.brand_profiles for delete using (auth.uid() = user_id);

create policy "Users can view own content posts"
  on public.content_posts for select using (auth.uid() = user_id);
create policy "Users can insert own content posts"
  on public.content_posts for insert with check (auth.uid() = user_id);
create policy "Users can update own content posts"
  on public.content_posts for update using (auth.uid() = user_id);
create policy "Users can delete own content posts"
  on public.content_posts for delete using (auth.uid() = user_id);

create policy "Users can view own performance logs"
  on public.performance_logs for select using (auth.uid() = user_id);
create policy "Users can insert own performance logs"
  on public.performance_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own performance logs"
  on public.performance_logs for update using (auth.uid() = user_id);
create policy "Users can delete own performance logs"
  on public.performance_logs for delete using (auth.uid() = user_id);

-- 5. INDEXES
create index if not exists idx_brand_profiles_user_id on public.brand_profiles(user_id);
create index if not exists idx_content_posts_user_id on public.content_posts(user_id);
create index if not exists idx_content_posts_status on public.content_posts(status);
create index if not exists idx_content_posts_created_at on public.content_posts(created_at desc);
create index if not exists idx_performance_logs_user_id on public.performance_logs(user_id);
create index if not exists idx_performance_logs_logged_at on public.performance_logs(logged_at desc);

-- 6. AUTO-UPDATE updated_at TRIGGER
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_brand_profiles_updated_at on public.brand_profiles;
create trigger set_brand_profiles_updated_at
  before update on public.brand_profiles
  for each row execute function public.handle_updated_at();
