import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────

export interface HeroSettings {
  greeting: string
  arabicText: string
  translation: string
  btn1Label: string
  btn2Label: string
}

export interface DailyDuaOverride {
  active: boolean
  duaId: string | null
}

export const DEFAULT_HERO: HeroSettings = {
  greeting:    'আস-সালামু আলাইকুম',
  arabicText:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  translation: 'পরম করুণাময়, অতিদয়ালু আল্লাহর নামে',
  btn1Label:   'কুরআন পড়ুন',
  btn2Label:   'দোয়া দেখুন',
}

export const DEFAULT_POPULAR_SURAHS = [36, 67, 18, 55, 56, 1]

export const DEFAULT_DAILY_DUA: DailyDuaOverride = { active: false, duaId: null }

// ── Supabase fetch ─────────────────────────────────────────────

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).single()
  if (error || !data) return fallback
  return data.value as T
}

async function setSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase.from('app_settings').upsert({ key, value })
  if (error) throw error
}

// ── Hooks ──────────────────────────────────────────────────────

export function useHeroSettings() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['settings', 'hero'],
    queryFn: SUPABASE_ENABLED ? () => getSetting('hero', DEFAULT_HERO) : async () => DEFAULT_HERO,
    staleTime: 5 * 60 * 1000,
  })
  const mutation = useMutation({
    mutationFn: (v: HeroSettings) => setSetting('hero', v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'hero'] }),
  })
  return { hero: query.data ?? DEFAULT_HERO, isLoading: query.isLoading, save: mutation.mutateAsync, isSaving: mutation.isPending }
}

export function usePopularSurahsSetting() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['settings', 'popular_surahs'],
    queryFn: SUPABASE_ENABLED ? () => getSetting('popular_surahs', DEFAULT_POPULAR_SURAHS) : async () => DEFAULT_POPULAR_SURAHS,
    staleTime: 5 * 60 * 1000,
  })
  const mutation = useMutation({
    mutationFn: (v: number[]) => setSetting('popular_surahs', v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'popular_surahs'] }),
  })
  return { surahNums: query.data ?? DEFAULT_POPULAR_SURAHS, isLoading: query.isLoading, save: mutation.mutateAsync, isSaving: mutation.isPending }
}

export function useDailyDuaOverride() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['settings', 'daily_dua_override'],
    queryFn: SUPABASE_ENABLED ? () => getSetting('daily_dua_override', DEFAULT_DAILY_DUA) : async () => DEFAULT_DAILY_DUA,
    staleTime: 5 * 60 * 1000,
  })
  const mutation = useMutation({
    mutationFn: (v: DailyDuaOverride) => setSetting('daily_dua_override', v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'daily_dua_override'] }),
  })
  return { override: query.data ?? DEFAULT_DAILY_DUA, isLoading: query.isLoading, save: mutation.mutateAsync, isSaving: mutation.isPending }
}
