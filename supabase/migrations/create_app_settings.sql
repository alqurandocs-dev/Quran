-- ============================================================
-- App Settings Table (generic key-value store)
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists public.app_settings (
  key         text        primary key,
  value       jsonb       not null,
  updated_at  timestamptz default now()
);

alter table public.app_settings enable row level security;

-- Anyone can read settings
create policy "Public can read settings"
  on public.app_settings for select
  using (true);

-- Only authenticated users can write
create policy "Authenticated can manage settings"
  on public.app_settings for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Auto-update updated_at
create trigger app_settings_updated_at
  before update on public.app_settings
  for each row execute function update_updated_at();

-- Default values
insert into public.app_settings (key, value) values
  ('hero', '{"greeting":"আস-সালামু আলাইকুম","arabicText":"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ","translation":"পরম করুণাময়, অতিদয়ালু আল্লাহর নামে","btn1Label":"কুরআন পড়ুন","btn2Label":"দোয়া দেখুন"}'::jsonb),
  ('popular_surahs', '[36, 67, 18, 55, 56, 1]'::jsonb),
  ('daily_dua_override', '{"active":false,"duaId":null}'::jsonb)
on conflict (key) do nothing;
