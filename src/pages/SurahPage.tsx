import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useSurah } from '@/hooks/useQuran'
import { useReadingStore } from '@/stores/readingStore'
import { useAudioStore } from '@/stores/audioStore'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { pushProgressToSupabase } from '@/hooks/useReadingProgress'
import { SURAHS } from '@/data/surahs'
import { AyahCard } from '@/components/quran/AyahCard'
import { PageLoader, LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { formatBanglaNumber } from '@/lib/utils'

export function SurahPage() {
  const { surahId } = useParams<{ surahId: string }>()
  const navigate = useNavigate()
  const surahNumber = parseInt(surahId || '1')
  const surah = SURAHS[surahNumber - 1]

  const { arabic, translation, transliteration, isLoading, error } = useSurah(surahNumber)
  const { setLastRead, addRecentSurah } = useReadingStore()
  const { isPlaying, currentSurah, setSurah, setPlaying } = useAudioStore()
  const { user } = useAuthStore()
  const { autoSaveProgress } = useSettingsStore()

  const isSurahPlaying = isPlaying && currentSurah === surahNumber

  useEffect(() => {
    if (surah) {
      addRecentSurah(surahNumber)
      document.title = `${surah.banglaName} - আল-কুরআন`
    }
  }, [surahNumber, surah, addRecentSurah])

  // Reading progress callback — passed to each AyahCard via onVisible
  const handleAyahVisible = useCallback(
    (sNum: number, aNum: number) => {
      if (!autoSaveProgress || !surah) return
      const pos = {
        surahNumber: sNum,
        ayahNumber: aNum,
        surahName: surah.banglaName,
        timestamp: Date.now(),
      }
      setLastRead(pos)
      if (user) pushProgressToSupabase(user.id, pos)
    },
    [surah, setLastRead, user, autoSaveProgress]
  )

  const observerRef = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    // Scroll-to-last-read ayah on initial load (from URL hash)
    const hash = window.location.hash
    if (hash.startsWith('#ayah-')) {
      const el = document.getElementById(hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
    }
    return () => observerRef.current?.disconnect()
  }, [arabic])

  const handlePlaySurah = () => {
    if (isSurahPlaying) {
      setPlaying(false)
    } else {
      // Always start from ayah 1 when playing full surah from header
      setSurah(surahNumber, surah?.numberOfAyahs || 7)
      // Small delay so state settles before play triggers
      setTimeout(() => setPlaying(true), 50)
    }
  }

  if (!surah) return <div className="p-4 text-center">সূরা পাওয়া যায়নি</div>
  if (isLoading) return <PageLoader />
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">ডেটা লোড করতে সমস্যা হয়েছে</p>
      <Button onClick={() => window.location.reload()}>আবার চেষ্টা করুন</Button>
    </div>
  )

  const ayahs = arabic?.ayahs || []
  const translations = translation?.ayahs || []
  const transliterations = transliteration?.ayahs || []

  // Build global ayah offset
  const globalOffset = SURAHS.slice(0, surahNumber - 1).reduce((sum, s) => sum + s.numberOfAyahs, 0)

  return (
    <div className="mx-auto max-w-3xl">
      {/* Surah Header */}
      <div className="sticky top-16 z-30 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quran')} aria-label="পেছনে">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <p className="font-arabic text-xl text-green-600 dark:text-green-400">{surah.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {surah.banglaName} • {formatBanglaNumber(surah.numberOfAyahs)} আয়াত
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handlePlaySurah} aria-label="তিলাওয়াত">
              {isSurahPlaying ? (
                <Pause className="h-5 w-5 text-green-500" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bismillah (except Surah 9 and Surah 1's first ayah) */}
      {surahNumber !== 9 && (
        <div className="text-center py-8 px-4">
          <p className="font-arabic text-3xl text-green-700 dark:text-amber-200 leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="divide-y divide-[var(--color-border)]">
        {ayahs.map((ayah, idx) => (
          <AyahCard
            key={ayah.number}
            surahNumber={surahNumber}
            ayahNumber={ayah.numberInSurah}
            globalAyahNumber={globalOffset + ayah.numberInSurah}
            arabicText={ayah.text}
            translation={translations[idx]?.text}
            transliteration={transliterations[idx]?.text}
            juz={ayah.juz}
            page={ayah.page}
            onVisible={handleAyahVisible}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-6 border-t border-[var(--color-border)]">
        <Button
          variant="outline"
          disabled={surahNumber <= 1}
          onClick={() => navigate(`/quran/${surahNumber - 1}`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {surahNumber > 1 ? SURAHS[surahNumber - 2].banglaName : '—'}
        </Button>

        <LoadingSpinner size="sm" className="opacity-0" />

        <Button
          variant="outline"
          disabled={surahNumber >= 114}
          onClick={() => navigate(`/quran/${surahNumber + 1}`)}
          className="gap-2"
        >
          {surahNumber < 114 ? SURAHS[surahNumber].banglaName : '—'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
