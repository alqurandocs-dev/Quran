import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, BookOpen } from 'lucide-react'
import { DUAS, DUA_CATEGORIES } from '@/data/duas'
import { useDuaFavorites } from '@/hooks/useDuaFavorites'
import { useDuaStore } from '@/stores/duaStore'
import { cn } from '@/lib/utils'

const BADGE_COLOR: Record<string, string> = {
  sahih: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  hasan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  quran: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}
const BADGE_LABEL: Record<string, string> = {
  sahih: 'সহীহ',
  hasan: 'হাসান',
  quran: 'কুরআন',
}

export function DuaDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const dua = useMemo(() => DUAS.find((d) => d.id === id), [id])
  const { isDuaFavorite, toggleFavorite } = useDuaFavorites()
  const { showPronunciation, showMeaning } = useDuaStore()

  if (!dua) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-4xl">🤲</p>
        <p className="text-[var(--color-text-muted)]">দোয়াটি পাওয়া যায়নি।</p>
        <Link to="/dua" className="text-sm text-green-500 hover:underline">
          সব দোয়ায় ফিরুন
        </Link>
      </div>
    )
  }

  const favorited = isDuaFavorite(dua.id)
  const category = DUA_CATEGORIES.find((c) => c.id === dua.category)

  // Related duas from same category
  const related = DUAS.filter((d) => d.category === dua.category && d.id !== dua.id).slice(0, 3)

  const handleShare = async () => {
    const text = `${dua.titleBangla}\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.transliteration}\n\nঅর্থ: ${dua.meaning}\n\nসূত্র: ${dua.reference}`
    if (navigator.share) {
      await navigator.share({ title: dua.titleBangla, text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-green-500 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ফিরুন
      </button>

      {/* Category + Authenticity */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-600/10 rounded-full px-3 py-1">
          {category?.icon} {category?.label}
        </span>
        {dua.authenticity && (
          <span className={cn('text-xs font-semibold rounded-full px-2.5 py-0.5', BADGE_COLOR[dua.authenticity])}>
            {BADGE_LABEL[dua.authenticity]}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{dua.titleBangla}</h1>

      {/* Arabic */}
      <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-800/10 to-green-900/5 p-6 mb-4">
        <p
          className="font-arabic text-3xl sm:text-4xl text-right leading-loose text-green-700 dark:text-amber-200"
          dir="rtl"
          lang="ar"
        >
          {dua.arabic}
        </p>
      </div>

      {/* Pronunciation */}
      {showPronunciation && (
        <div className="rounded-xl border px-4 py-3 mb-4" style={{ background: '#0F172A', borderColor: 'rgba(51,65,85,0.5)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#10B981' }}>
            উচ্চারণ
          </p>
          <p className="text-sm italic leading-relaxed" style={{ color: '#E2E8F0' }}>
            {dua.transliteration}
          </p>
        </div>
      )}

      {/* Meaning */}
      {showMeaning && (
        <div className="rounded-xl border px-4 py-3 mb-4" style={{ background: '#0F172A', borderColor: 'rgba(51,65,85,0.5)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#10B981' }}>
            অর্থ
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#E2E8F0' }}>{dua.meaning}</p>
        </div>
      )}

      {/* Reference */}
      <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 mb-6">
        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
          <span className="text-base">📚</span>
          <span className="font-medium">{dua.reference}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => toggleFavorite(dua.id)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors border',
            favorited
              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-500'
              : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-red-300'
          )}
        >
          <Heart className={cn('h-4 w-4', favorited && 'fill-red-500')} />
          {favorited ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          <Share2 className="h-4 w-4" />
          শেয়ার করুন
        </button>
      </div>

      {/* Related duas */}
      {related.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-500" />
            একই বিভাগের আরো দোয়া
          </h2>
          <div className="space-y-2">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/dua/${r.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 hover:border-green-500/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{r.titleBangla}</p>
                  <p
                    className="text-xs font-arabic text-green-700 dark:text-amber-300 mt-0.5 truncate text-right"
                    dir="rtl"
                  >
                    {r.arabic.slice(0, 40)}...
                  </p>
                </div>
                <ArrowLeft className="h-4 w-4 text-[var(--color-text-muted)] rotate-180 flex-shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
