import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bookmark, BookmarkCheck, Play, Pause, Share2, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, formatBanglaNumber } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAudioStore } from '@/stores/audioStore'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuthStore } from '@/stores/authStore'
import { useShareStore } from '@/stores/shareStore'
import { SURAHS } from '@/data/surahs'
import { Button } from '@/components/ui/Button'
import { quranApi } from '@/services/quranApi'
import { latinToBangla } from '@/lib/transliterate'

interface AyahCardProps {
  surahNumber: number
  ayahNumber: number
  globalAyahNumber: number
  arabicText: string
  translation?: string
  transliteration?: string
  juz?: number
  page?: number
  highlighted?: boolean
  onNoteClick?: () => void
  onVisible?: (surahNumber: number, ayahNumber: number) => void
}

export function AyahCard({
  surahNumber,
  ayahNumber,
  globalAyahNumber: _globalAyahNumber,
  arabicText,
  translation,
  transliteration,
  juz,
  page,
  highlighted,
  onNoteClick,
  onVisible,
}: AyahCardProps) {
  const { arabicFontSize, showTransliteration, showTafsir, showAyahNumbers, autoSaveProgress, lineHeight } = useSettingsStore()
  const { isPlaying, currentSurah, currentAyah, setPlaying, setAyah, setSurah } = useAudioStore()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { user } = useAuthStore()
  const { openShare } = useShareStore()
  const [showTafsirLocal, setShowTafsirLocal] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const surah = SURAHS[surahNumber - 1]
  const isCurrentlyPlaying = isPlaying && currentSurah === surahNumber && currentAyah === ayahNumber
  const bookmarked = isBookmarked(surahNumber, ayahNumber)
  const favorited = isFavorite(surahNumber, ayahNumber)

  // IntersectionObserver for visibility callback (reading progress)
  useEffect(() => {
    if (!onVisible || !autoSaveProgress) return
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(surahNumber, ayahNumber)
      },
      { threshold: 0.5, rootMargin: '-40% 0px -40% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [surahNumber, ayahNumber, onVisible, autoSaveProgress])

  // Tafsir (lazy fetch when expanded)
  const tafsirQuery = useQuery({
    queryKey: ['tafsir', surahNumber, ayahNumber],
    queryFn: () => quranApi.getAyah(`${surahNumber}:${ayahNumber}`, 'en.maududi'),
    enabled: showTafsirLocal,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      setPlaying(false)
    } else {
      if (currentSurah !== surahNumber) {
        setSurah(surahNumber, surah.numberOfAyahs)
      }
      setAyah(ayahNumber)
      setPlaying(true)
    }
  }

  const handleBookmark = () => {
    if (!user) return
    if (bookmarked) {
      removeBookmark({ surahNumber, ayahNumber })
    } else {
      addBookmark({
        surahNumber,
        ayahNumber,
        surahName: surah.banglaName,
        ayahText: arabicText,
      })
    }
  }

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite({ surahNumber, ayahNumber })
    } else {
      addFavorite({
        surahNumber,
        ayahNumber,
        surahName: surah.banglaName,
        ayahText: arabicText,
      })
    }
  }

  const handleShare = () => {
    openShare({
      surahNumber,
      ayahNumber,
      surahNameBn: surah.banglaName,
      surahNameAr: surah.name,
      arabicText,
      transliteration,
      translation,
    })
  }

  const lhClass = lineHeight === 'normal' ? 'leading-normal' : lineHeight === 'loose' ? 'leading-loose' : 'leading-relaxed'

  return (
    <div
      ref={cardRef}
      id={`ayah-${ayahNumber}`}
      className={cn(
        'ayah-card group border-b border-[var(--color-border)] px-4 py-5 last:border-b-0',
        highlighted && 'bg-green-500/5 active',
        isCurrentlyPlaying && 'bg-green-500/8'
      )}
    >
      {/* Ayah Header */}
      <div className="flex items-center justify-between mb-4">
        {showAyahNumbers ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/10 text-green-600 dark:text-green-400 text-xs font-bold">
            {formatBanglaNumber(ayahNumber)}
          </div>
        ) : <div className="w-8" />}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {juz && (
            <span className="text-xs text-[var(--color-text-muted)] mr-1 hidden sm:block">
              পারা {formatBanglaNumber(juz)} • পৃ. {page && formatBanglaNumber(page)}
            </span>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayPause} aria-label="তিলাওয়াত">
            {isCurrentlyPlaying ? (
              <Pause className="h-4 w-4 text-green-500" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Favorite */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleFavorite}
            aria-label="প্রিয়"
          >
            <Heart
              className={cn('h-4 w-4 transition-colors', favorited ? 'fill-red-500 text-red-500' : '')}
            />
          </Button>

          {/* Bookmark (authenticated only) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBookmark}
            disabled={!user}
            aria-label="বুকমার্ক"
            title={!user ? 'বুকমার্কের জন্য লগইন করুন' : undefined}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          {onNoteClick && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNoteClick} aria-label="নোট">
              <span className="text-xs">✏️</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} aria-label="শেয়ার">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Arabic Text */}
      <p
        className={cn(
          'font-arabic text-right text-[var(--color-arabic,#1a1a2e)] dark:text-amber-100 mb-4',
          `arabic-${arabicFontSize}`,
          lhClass
        )}
        dir="rtl"
        lang="ar"
      >
        {arabicText}
      </p>

      {/* Transliteration — DuaPage-এর মতো styled box */}
      {showTransliteration && transliteration && (
        <div className="mb-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-green-700 dark:text-green-500 mb-1">
            উচ্চারণ
          </p>
          <p className={cn('text-sm italic text-[var(--color-text)]', lhClass)}>
            {latinToBangla(transliteration)}
          </p>
        </div>
      )}

      {/* Translation */}
      {translation && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-500 mb-1">
            অর্থ
          </p>
          <p className={cn('text-sm text-[var(--color-text)]', lhClass)}>
            {translation}
          </p>
        </div>
      )}

      {/* Tafsir Toggle */}
      {showTafsir && (
        <>
          <button
            onClick={() => setShowTafsirLocal(!showTafsirLocal)}
            className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            {showTafsirLocal ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            তাফসীর {showTafsirLocal ? 'বন্ধ করুন' : 'দেখুন'}
          </button>

          {showTafsirLocal && (
            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4">
              {tafsirQuery.isLoading ? (
                <p className="text-sm text-[var(--color-text-muted)]">তাফসীর লোড হচ্ছে...</p>
              ) : tafsirQuery.data ? (
                <>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wide">
                    তাফসীর (Maududi)
                  </p>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {(tafsirQuery.data as unknown as { text: string }).text}
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">
                  তাফসীর পাওয়া যায়নি।
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
