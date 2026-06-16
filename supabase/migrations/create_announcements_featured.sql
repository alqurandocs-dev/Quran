-- ============================================================
-- Announcements & Featured Content Tables
-- Run in Supabase SQL Editor
-- ============================================================

-- ── Announcements ─────────────────────────────────────────────

create table if not exists public.announcements (
  id          text        primary key default gen_random_uuid()::text,
  message     text        not null,
  type        text        not null default 'info' check (type in ('info', 'success', 'warning', 'ramadan')),
  icon        text,                     -- emoji e.g. '🌙'
  link_text   text,                     -- optional CTA text
  link_url    text,                     -- optional CTA link
  is_active   boolean     not null default true,
  starts_at   timestamptz default now(),
  ends_at     timestamptz,              -- null = no expiry
  created_at  timestamptz default now()
);

alter table public.announcements enable row level security;

create policy "Public can read active announcements"
  on public.announcements for select
  using (is_active = true and (ends_at is null or ends_at > now()));

create policy "Authenticated can manage announcements"
  on public.announcements for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ── Featured Content ───────────────────────────────────────────

create table if not exists public.featured_content (
  id          text        primary key default gen_random_uuid()::text,
  type        text        not null check (type in ('surah', 'dua', 'juz')),
  ref_id      text        not null,     -- surah number, dua id, or juz number
  title       text        not null,
  subtitle    text,
  badge       text,                     -- e.g. 'রমজান বিশেষ'
  is_active   boolean     not null default true,
  sort_order  integer     default 0,
  created_at  timestamptz default now()
);

alter table public.featured_content enable row level security;

create policy "Public can read active featured"
  on public.featured_content for select
  using (is_active = true);

create policy "Authenticated can manage featured"
  on public.featured_content for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
