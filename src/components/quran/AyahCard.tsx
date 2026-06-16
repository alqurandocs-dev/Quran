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

  useEffect(() => {
    if (!onVisible || !autoSaveProgress) return
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(surahNumber, ayahNumber) },
      { threshold: 0.5, rootMargin: '-40% 0px -40% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [surahNumber, ayahNumber, onVisible, autoSaveProgress])

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
      if (currentSurah !== surahNumber) setSurah(surahNumber, surah.numberOfAyahs)
      setAyah(ayahNumber)
      setPlaying(true)
    }
  }

  const handleBookmark = () => {
    if (!user) return
    if (bookmarked) removeBookmark({ surahNumber, ayahNumber })
    else addBookmark({ surahNumber, ayahNumber, surahName: surah.banglaName, ayahText: arabicText })
  }

  const handleFavorite = () => {
    if (favorited) removeFavorite({ surahNumber, ayahNumber })
    else addFavorite({ surahNumber, ayahNumber, surahName: surah.banglaName, ayahText: arabicText })
  }

  const handleShare = () => {
    openShare({ surahNumber, ayahNumber, surahNameBn: surah.banglaName, surahNameAr: surah.name, arabicText, transliteration, translation })
  }

  const lhClass = lineHeight === 'normal' ? 'leading-normal' : lineHeight === 'loose' ? 'leading-loose' : 'leading-relaxed'

  return (
    <div
      ref={cardRef}
      id={`ayah-${ayahNumber}`}
      className={cn(
        'ayah-card group mx-4 my-3 rounded-2xl border transition-all duration-200',
        highlighted || isCurrentlyPlaying
          ? 'border-[rgba(20,184,166,0.25)] bg-[rgba(20,184,166,0.07)] shadow-sm shadow-[#14B8A6]/10'
          : 'border-[#334155]/60 bg-[#111827] hover:border-[#334155]'
      )}
    >
      {/* Ayah Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        {/* Ayah number badge */}
        {showAyahNumbers ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#334155] bg-[#0F172A] text-xs font-bold text-[#94A3B8]">
            {formatBanglaNumber(ayahNumber)}
          </div>
        ) : <div className="w-8" />}

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          {juz && (
            <span className="text-xs text-[#64748B] mr-2 hidden sm:block">
              পারা {formatBanglaNumber(juz)}{page ? ` · পৃ. ${formatBanglaNumber(page)}` : ''}
            </span>
          )}

          <button
            onClick={handlePlayPause}
            aria-label="তিলাওয়াত"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              isCurrentlyPlaying
                ? 'bg-[rgba(20,184,166,0.12)] text-[#14B8A6]'
                : 'text-[#64748B] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#CBD5E1]'
            )}
          >
            {isCurrentlyPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handleFavorite}
            aria-label="প্রিয়"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              favorited
                ? 'bg-[rgba(239,68,68,0.12)] text-red-400'
                : 'text-[#64748B] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#CBD5E1]'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-red-400')} />
          </button>

          <button
            onClick={handleBookmark}
            disabled={!user}
            aria-label="বুকমার্ক"
            title={!user ? 'বুকমার্কের জন্য লগইন করুন' : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              bookmarked
                ? 'bg-[rgba(20,184,166,0.12)] text-[#14B8A6]'
                : 'text-[#64748B] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed'
            )}
          >
            {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>

          {onNoteClick && (
            <button
              onClick={onNoteClick}
              aria-label="নোট"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#CBD5E1] transition-colors"
            >
              <span className="text-xs">✏️</span>
            </button>
          )}

          <button
            onClick={handleShare}
            aria-label="শেয়ার"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#CBD5E1] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="px-5 pb-5 pt-2">
        <p
          className={cn('font-arabic text-right mb-5', `arabic-${arabicFontSize}`, lhClass)}
          style={{ color: '#F8FAFC', letterSpacing: '0.01em' }}
          dir="rtl"
          lang="ar"
        >
          {arabicText}
        </p>

        {/* Transliteration */}
        {showTransliteration && transliteration && (
          <div className="mb-3 rounded-xl bg-[#0F172A] border border-[#334155]/50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#14B8A6] mb-1.5">
              উচ্চারণ
            </p>
            <p className={cn('text-sm italic text-[#E2E8F0]', lhClass)}>
              {latinToBangla(transliteration)}
            </p>
          </div>
        )}

        {/* Translation */}
        {translation && (
          <div className="rounded-xl bg-[#0F172A] border border-[#334155]/50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#14B8A6] mb-1.5">
              অর্থ
            </p>
            <p className={cn('text-sm text-[#E2E8F0]', lhClass)}>
              {translation}
            </p>
          </div>
        )}

        {/* Tafsir Toggle */}
        {showTafsir && (
          <div className="mt-3">
            <button
              onClick={() => setShowTafsirLocal(!showTafsirLocal)}
              className="flex items-center gap-1.5 text-xs text-[#14B8A6] hover:text-[#0d9488] transition-colors"
            >
              {showTafsirLocal ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              তাফসীর {showTafsirLocal ? 'বন্ধ করুন' : 'দেখুন'}
            </button>

            {showTafsirLocal && (
              <div className="mt-2 rounded-xl bg-[#0F172A] border border-[#334155]/50 p-4">
                {tafsirQuery.isLoading ? (
                  <p className="text-sm text-[#64748B]">লোড হচ্ছে...</p>
                ) : tafsirQuery.data ? (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#14B8A6] mb-2">
                      তাফসীর (Maududi)
                    </p>
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">
                      {(tafsirQuery.data as unknown as { text: string }).text}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">তাফসীর পাওয়া যায়নি।</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
