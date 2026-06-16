import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { DUAS, DUA_CATEGORIES } from '@/data/duas'
import { useDuaFavorites } from '@/hooks/useDuaFavorites'
import { useDuaStore } from '@/stores/duaStore'
import { cn } from '@/lib/utils'

function getDailyDuaIndex(): number {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const dayOfYear = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  )
  return dayOfYear % DUAS.length
}

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

export function DailyDuaPage() {
  const baseIndex = useMemo(getDailyDuaIndex, [])
  const [offset, setOffset] = useState(0)
  const index = (baseIndex + offset + DUAS.length) % DUAS.length
  const dua = DUAS[index]

  const { isDuaFavorite, toggleFavorite } = useDuaFavorites()
  const { showPronunciation, showMeaning } = useDuaStore()

  const category = DUA_CATEGORIES.find((c) => c.id === dua.category)
  const favorited = isDuaFavorite(dua.id)

  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{category?.icon ?? '🤲'}</span>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">আজকের দোয়া</h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{today}</p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-800/10 to-green-900/5 overflow-hidden mb-6">
        {/* Category badge */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-600/10 rounded-full px-3 py-1">
            {category?.icon} {category?.label}
          </span>
          {dua.authenticity && (
            <span className={cn('text-xs font-semibold rounded-full px-2.5 py-0.5', BADGE_COLOR[dua.authenticity])}>
              {BADGE_LABEL[dua.authenticity]}
            </span>
          )}
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Title */}
          <h2 className="text-lg font-bold text-[var(--color-text)]">{dua.titleBangla}</h2>

          {/* Arabic */}
          <div className="rounded-xl bg-[var(--color-surface)] p-5">
            <p
              className="font-arabic text-3xl text-right leading-loose text-green-700 dark:text-amber-200"
              dir="rtl"
              lang="ar"
            >
              {dua.arabic}
            </p>
          </div>

          {/* Pronunciation */}
          {showPronunciation && (
            <div className="rounded-xl border px-4 py-3" style={{ background: '#0F172A', borderColor: 'rgba(51,65,85,0.5)' }}>
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
            <div className="rounded-xl border px-4 py-3" style={{ background: '#0F172A', borderColor: 'rgba(51,65,85,0.5)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#10B981' }}>
                অর্থ
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#E2E8F0' }}>{dua.meaning}</p>
            </div>
          )}

          {/* Reference */}
          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
            <span>📚</span>
            <span>{dua.reference}</span>
          </p>
        </div>

        {/* Action bar */}
        <div className="border-t border-[var(--color-border)] px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => toggleFavorite(dua.id)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors rounded-lg px-3 py-1.5',
              favorited
                ? 'text-red-500 bg-red-500/10'
                : 'text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/5'
            )}
          >
            <Heart className={cn('h-4 w-4', favorited && 'fill-red-500')} />
            {favorited ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
          </button>

          <Link
            to={`/dua/${dua.id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
          >
            <BookOpen className="h-4 w-4" />
            বিস্তারিত
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:border-green-500/50 hover:bg-green-600/5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          আগেরটি
        </button>

        <span className="text-xs text-[var(--color-text-muted)]">
          {index + 1} / {DUAS.length}
        </span>

        <button
          onClick={() => setOffset((o) => o + 1)}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:border-green-500/50 hover:bg-green-600/5 transition-colors"
        >
          পরেরটি
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Go to collection */}
      <div className="mt-8 text-center">
        <Link
          to="/dua"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-semibold transition-colors shadow-lg shadow-green-900/20"
        >
          <BookOpen className="h-4 w-4" />
          সব দোয়া দেখুন
        </Link>
      </div>
    </div>
  )
}
