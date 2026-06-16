-- ==============================================
-- AL-QURAN APP - Complete Database Schema
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- PROFILES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- USER SETTINGS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme                 TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  font_size             TEXT NOT NULL DEFAULT 'md' CHECK (font_size IN ('sm', 'md', 'lg', 'xl', 'xxl')),
  arabic_font_size      TEXT NOT NULL DEFAULT 'xl' CHECK (arabic_font_size IN ('md', 'lg', 'xl', 'xxl', 'xxxl')),
  translation_language  TEXT NOT NULL DEFAULT 'bangla' CHECK (translation_language IN ('bangla', 'english')),
  bangla_translation    TEXT NOT NULL DEFAULT 'bn.muhiuddinkhan',
  show_transliteration  BOOLEAN NOT NULL DEFAULT FALSE,
  show_tafsir           BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_qari        TEXT NOT NULL DEFAULT 'ar.alafasy',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ==============================================
-- BOOKMARKS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number  INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
  ayah_number   INTEGER NOT NULL CHECK (ayah_number > 0),
  surah_name    TEXT NOT NULL,
  ayah_text     TEXT,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, surah_number, ayah_number)
);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_surah ON public.bookmarks(user_id, surah_number);

-- ==============================================
-- FAVORITES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number  INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
  ayah_number   INTEGER NOT NULL CHECK (ayah_number > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, surah_number, ayah_number)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

-- ==============================================
-- NOTES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number  INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
  ayah_number   INTEGER NOT NULL CHECK (ayah_number > 0),
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, surah_number, ayah_number)
);

CREATE INDEX idx_notes_user_id ON public.notes(user_id);

-- ==============================================
-- READING PROGRESS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah_number  INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
  ayah_number   INTEGER NOT NULL CHECK (ayah_number > 0),
  surah_name    TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ==============================================
-- RECENT SEARCHES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.recent_searches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recent_searches_user_id ON public.recent_searches(user_id, created_at DESC);

-- ==============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ==============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
