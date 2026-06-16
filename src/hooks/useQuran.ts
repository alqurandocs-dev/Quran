import { useQuery } from '@tanstack/react-query'
import { quranApi } from '@/services/quranApi'
import { useSettingsStore } from '@/stores/settingsStore'

export function useSurah(surahNumber: number) {
  const { translationLanguage, banglaTranslation } = useSettingsStore()

  const edition = translationLanguage === 'bangla' ? banglaTranslation : 'en.sahih'

  const arabicQuery = useQuery({
    queryKey: ['surah', surahNumber, 'arabic'],
    queryFn: () => quranApi.getSurah(surahNumber),
    enabled: surahNumber >= 1 && surahNumber <= 114,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  const translationQuery = useQuery({
    queryKey: ['surah', surahNumber, 'translation', edition],
    queryFn: () => quranApi.getSurahTranslation(surahNumber, edition),
    enabled: surahNumber >= 1 && surahNumber <= 114,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  const transliterationQuery = useQuery({
    queryKey: ['surah', surahNumber, 'transliteration'],
    queryFn: () => quranApi.getSurahTranslation(surahNumber, 'en.transliteration'),
    enabled: surahNumber >= 1 && surahNumber <= 114,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  return {
    arabic: arabicQuery.data,
    translation: translationQuery.data,
    transliteration: transliterationQuery.data,
    isLoading: arabicQuery.isLoading || translationQuery.isLoading,
    error: arabicQuery.error || translationQuery.error,
  }
}

export function useSearch(query: string) {
  const { translationLanguage } = useSettingsStore()
  const lang = translationLanguage === 'bangla' ? 'bn' : 'en'

  return useQuery({
    queryKey: ['search', query, lang],
    queryFn: () => quranApi.search(query, 'all', lang),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  })
}
