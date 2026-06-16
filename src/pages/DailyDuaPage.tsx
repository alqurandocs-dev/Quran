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
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{category?.icon ?? '🤲'}</span>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">আজকের দোয়া</h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{today}</p>
      </div>

      <div className="rounded-2xl border overflow-hidden mb-6"
        style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1"
            style={{ background: 'rgba(20,184,166,0.1)', color: '#14B8A6' }}>
            {category?.icon} {category?.label}
          </span>
          {dua.authenticity && (
            <span className="text-xs font-semibold rounded-full px-2.5 py-0.5"
              style={{ background: 'rgba(20,184,166,0.1)', color: '#14B8A6' }}>
              {BADGE_LABEL[dua.authenticity]}
            </span>
          )}
        </div>

        <div className="px-5 pb-5 space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{dua.titleBangla}</h2>

          <div className="rounded-xl p-5" style={{ background: '#1F2937' }}>
            <p className="font-arabic text-3xl text-right leading-loose"
              dir="rtl" lang="ar" style={{ color: '#F8FAFC' }}>
              {dua.arabic}
            </p>
          </div>

          {showPronunciation && (
            <div className="rounded-xl border px-4 py-3"
              style={{ background: '#1F2937', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: '#14B8A6' }}>উচ্চারণ</p>
              <p className="text-sm italic leading-relaxed" style={{ color: '#CBD5E1' }}>
                {dua.transliteration}
              </p>
            </div>
          )}

          {showMeaning && (
            <div className="rounded-xl border px-4 py-3"
              style={{ background: '#1F2937', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: '#14B8A6' }}>অর্থ</p>
              <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>{dua.meaning}</p>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
            <span>📚</span>
            <span>{dua.reference}</span>
          </p>
        </div>

        <div className="border-t px-5 py-3 flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => toggleFavorite(dua.id)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors rounded-lg px-3 py-1.5',
              favorited
                ? 'text-red-400'
                : 'text-[var(--color-text-muted)] hover:text-red-400'
            )}
            style={favorited ? { background: 'rgba(239,68,68,0.08)' } : {}}
          >
            <Heart className={cn('h-4 w-4', favorited && 'fill-red-400')} />
            {favorited ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
          </button>

          <Link to={`/dua/${dua.id}`} className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: '#14B8A6' }}>
            <BookOpen className="h-4 w-4" />
            বিস্তারিত
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft className="h-4 w-4" />
          আগেরটি
        </button>

        <span className="text-xs text-[var(--color-text-muted)]">
          {index + 1} / {DUAS.length}
        </span>

        <button
          onClick={() => setOffset((o) => o + 1)}
          className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          পরেরটি
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link to="/dua"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
          style={{ background: '#14B8A6', color: '#0B1120' }}>
          <BookOpen className="h-4 w-4" />
          সব দোয়া দেখুন
        </Link>
      </div>
    </div>
  )
}
