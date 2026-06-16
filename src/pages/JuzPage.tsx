import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { JUZ_DATA } from '@/data/juz'
import { quranApi } from '@/services/quranApi'
import { useSettingsStore } from '@/stores/settingsStore'
import { useReadingStore } from '@/stores/readingStore'
import { useAuthStore } from '@/stores/authStore'
import { pushProgressToSupabase } from '@/hooks/useReadingProgress'
import { SURAHS } from '@/data/surahs'
import { AyahCard } from '@/components/quran/AyahCard'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { formatBanglaNumber } from '@/lib/utils'

interface JuzAyah {
  number: number
  numberInSurah: number
  text: string
  juz: number
  page: number
  surah: { number: number; name: string; englishName: string; numberOfAyahs: number }
}

export function JuzPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const juzNumber = parseInt(id || '1')
  const juzInfo = JUZ_DATA[juzNumber - 1]

  const { translationLanguage, banglaTranslation } = useSettingsStore()
  const { setLastRead } = useReadingStore()
  const { user } = useAuthStore()

  const edition = translationLanguage === 'bangla' ? banglaTranslation : 'en.sahih'

  const arabicQuery = useQuery({
    queryKey: ['juz', juzNumber, 'arabic'],
    queryFn: () => quranApi.getJuz(juzNumber, 'quran-uthmani'),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  const translationQuery = useQuery({
    queryKey: ['juz', juzNumber, 'translation', edition],
    queryFn: () => quranApi.getJuz(juzNumber, edition),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  const transliterationQuery = useQuery({
    queryKey: ['juz', juzNumber, 'transliteration'],
    queryFn: () => quranApi.getJuz(juzNumber, 'en.transliteration'),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  })

  useEffect(() => {
    document.title = `পারা ${juzNumber} - Nooraya`
  }, [juzNumber])

  if (!juzInfo) return <div className="p-4 text-center">পারা পাওয়া যায়নি</div>
  if (arabicQuery.isLoading || translationQuery.isLoading) return <PageLoader />
  if (arabicQuery.error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">ডেটা লোড করতে সমস্যা হয়েছে</p>
      <Button onClick={() => window.location.reload()}>আবার চেষ্টা করুন</Button>
    </div>
  )

  const arabicAyahs = (arabicQuery.data?.ayahs ?? []) as JuzAyah[]
  const translationAyahs = translationQuery.data?.ayahs ?? []
  const transliterationAyahs = transliterationQuery.data?.ayahs ?? []

  const handleAyahVisible = (surahNum: number, ayahNum: number) => {
    const surah = SURAHS[surahNum - 1]
    if (!surah) return
    const pos = {
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      surahName: surah.banglaName,
      timestamp: Date.now(),
    }
    setLastRead(pos)
    if (user) pushProgressToSupabase(user.id, pos)
  }

  // Group ayahs by surah for section headers
  let lastSurahNum = -1

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/juz')} aria-label="পেছনে">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <p className="font-semibold text-[var(--color-text)]">
              পারা {formatBanglaNumber(juzNumber)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-arabic">{juzInfo.arabicName}</p>
          </div>

          <div className="w-9" />
        </div>
      </div>

      {/* Ayahs */}
      <div className="divide-y divide-[var(--color-border)]">
        {arabicAyahs.map((ayah, idx) => {
          const showSurahHeader = ayah.surah?.number !== lastSurahNum
          if (showSurahHeader) lastSurahNum = ayah.surah?.number

          const surahData = ayah.surah ? SURAHS[ayah.surah.number - 1] : null
          const globalOffset = surahData
            ? SURAHS.slice(0, ayah.surah.number - 1).reduce((s, x) => s + x.numberOfAyahs, 0)
            : 0

          return (
            <div key={ayah.number}>
              {showSurahHeader && surahData && (
                <Link to={`/quran/${surahData.number}`}>
                  <div className="flex items-center justify-between bg-[rgba(20,184,166,0.05)] px-4 py-3 border-b border-[rgba(20,184,166,0.1)]">
                    <div>
                      <p className="font-semibold text-sm text-[#14B8A6]">
                        {surahData.banglaName}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {formatBanglaNumber(surahData.numberOfAyahs)} আয়াত
                      </p>
                    </div>
                    <p className="font-arabic text-xl text-[#F8FAFC]">{surahData.name}</p>
                  </div>
                </Link>
              )}
              <AyahCard
                surahNumber={ayah.surah?.number ?? 1}
                ayahNumber={ayah.numberInSurah}
                globalAyahNumber={globalOffset + ayah.numberInSurah}
                arabicText={ayah.text}
                translation={translationAyahs[idx]?.text}
                transliteration={transliterationAyahs[idx]?.text}
                juz={ayah.juz}
                page={ayah.page}
                onVisible={handleAyahVisible}
              />
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-6 border-t border-[var(--color-border)]">
        <Button
          variant="outline"
          disabled={juzNumber <= 1}
          onClick={() => navigate(`/juz/${juzNumber - 1}`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          পারা {juzNumber > 1 ? formatBanglaNumber(juzNumber - 1) : '—'}
        </Button>

        <span className="text-sm text-[var(--color-text-muted)]">পারা {formatBanglaNumber(juzNumber)}</span>

        <Button
          variant="outline"
          disabled={juzNumber >= 30}
          onClick={() => navigate(`/juz/${juzNumber + 1}`)}
          className="gap-2"
        >
          পারা {juzNumber < 30 ? formatBanglaNumber(juzNumber + 1) : '—'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
