-- ============================================================
-- Duas CMS Table
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.duas (
  id            text        primary key,
  category      text        not null,
  title_bangla  text        not null,
  arabic        text        not null,
  transliteration text      not null,
  meaning       text        not null,
  reference     text        not null,
  authenticity  text        check (authenticity in ('sahih', 'hasan', 'quran')),
  sort_order    integer     default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Enable RLS
alter table public.duas enable row level security;

-- Anyone can read
create policy "Public can read duas"
  on public.duas for select
  using (true);

-- Only authenticated users (admin) can insert/update/delete
create policy "Authenticated users can manage duas"
  on public.duas for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger duas_updated_at
  before update on public.duas
  for each row execute function update_updated_at();
