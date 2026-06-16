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
import { formatBanglaNumber, cn } from '@/lib/utils'

export function SurahPage() {
  const { surahId } = useParams<{ surahId: string }>()
  const navigate = useNavigate()
  const surahNumber = parseInt(surahId || '1')
  const surah = SURAHS[surahNumber - 1]

  const { arabic, translation, transliteration, isLoading, error } = useSurah(surahNumber)
  const { setLastRead, addRecentSurah } = useReadingStore()
  const { isPlaying, currentSurah, setPlaying, playSurahWithBismillah } = useAudioStore()
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
      playSurahWithBismillah(surahNumber, surah?.numberOfAyahs || 7)
    }
  }

  if (!surah) return <div className="p-4 text-center">সূরা পাওয়া যায়নি</div>
  if (isLoading) return <PageLoader />
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">ডেটা লোড করতে সমস্যা হয়েছে</p>
      <button onClick={() => window.location.reload()} className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-sm text-[#CBD5E1] hover:bg-[#1E293B] transition-colors">আবার চেষ্টা করুন</button>
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
      <div className="sticky top-16 z-30 backdrop-blur-md border-b px-4 py-3"
        style={{ background: 'rgba(2,8,23,0.92)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/quran')} aria-label="পেছনে" className="flex h-9 w-9 items-center justify-center rounded-xl text-[#94A3B8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F8FAFC] transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="font-arabic text-xl" style={{ color: '#F8FAFC' }}>{surah.name}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>
              {surah.banglaName} • {formatBanglaNumber(surah.numberOfAyahs)} আয়াত
            </p>
          </div>

          <button
            onClick={handlePlaySurah}
            aria-label="তিলাওয়াত"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
              isSurahPlaying
                ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]'
                : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F8FAFC]'
            )}
          >
            {isSurahPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 9 && (
        <div className="text-center py-10 px-4">
          <p className="font-arabic text-3xl leading-loose" style={{ color: '#F8FAFC' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: '#334155' }}>﷽</span>
            <div className="h-px w-16" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>
      )}

      {/* Ayahs */}
      <div className="py-2">
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
      <div className="flex items-center justify-between px-4 py-8 mt-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          disabled={surahNumber <= 1}
          onClick={() => navigate(`/quran/${surahNumber - 1}`)}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: '#334155', color: '#CBD5E1', background: '#111827' }}
        >
          <ChevronLeft className="h-4 w-4" />
          {surahNumber > 1 ? SURAHS[surahNumber - 2].banglaName : '—'}
        </button>

        <LoadingSpinner size="sm" className="opacity-0" />

        <button
          disabled={surahNumber >= 114}
          onClick={() => navigate(`/quran/${surahNumber + 1}`)}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: '#334155', color: '#CBD5E1', background: '#111827' }}
        >
          {surahNumber < 114 ? SURAHS[surahNumber].banglaName : '—'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
