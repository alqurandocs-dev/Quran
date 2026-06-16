import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, BookOpen } from 'lucide-react'
import { DUAS, DUA_CATEGORIES } from '@/data/duas'
import { useDuaFavorites } from '@/hooks/useDuaFavorites'
import { useDuaStore } from '@/stores/duaStore'
import { cn } from '@/lib/utils'

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
        <Link to="/dua" className="text-sm hover:underline" style={{ color: '#14B8A6' }}>
          সব দোয়ায় ফিরুন
        </Link>
      </div>
    )
  }

  const favorited = isDuaFavorite(dua.id)
  const category = DUA_CATEGORIES.find((c) => c.id === dua.category)
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ফিরুন
      </button>

      <div className="flex items-center gap-2 mb-4">
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

      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{dua.titleBangla}</h1>

      <div className="rounded-2xl border p-6 mb-4"
        style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="font-arabic text-3xl sm:text-4xl text-right leading-loose"
          dir="rtl" lang="ar" style={{ color: '#F8FAFC' }}>
          {dua.arabic}
        </p>
      </div>

      {showPronunciation && (
        <div className="rounded-xl border px-4 py-3 mb-4"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: '#14B8A6' }}>উচ্চারণ</p>
          <p className="text-sm italic leading-relaxed" style={{ color: '#CBD5E1' }}>
            {dua.transliteration}
          </p>
        </div>
      )}

      {showMeaning && (
        <div className="rounded-xl border px-4 py-3 mb-4"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: '#14B8A6' }}>অর্থ</p>
          <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>{dua.meaning}</p>
        </div>
      )}

      <div className="rounded-xl border px-4 py-3 mb-6"
        style={{ background: '#1F2937', borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
          <span className="text-base">📚</span>
          <span className="font-medium">{dua.reference}</span>
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => toggleFavorite(dua.id)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors border',
            favorited
              ? 'border-red-500/20 text-red-400'
              : 'text-[var(--color-text-muted)] hover:text-red-400'
          )}
          style={favorited
            ? { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }
            : { background: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <Heart className={cn('h-4 w-4', favorited && 'fill-red-400')} />
          {favorited ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{ background: '#14B8A6', color: '#0B1120' }}
        >
          <Share2 className="h-4 w-4" />
          শেয়ার করুন
        </button>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" style={{ color: '#14B8A6' }} />
            একই বিভাগের আরো দোয়া
          </h2>
          <div className="space-y-2">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/dua/${r.id}`}
                className="flex items-center justify-between rounded-xl border p-3 transition-colors"
                style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{r.titleBangla}</p>
                  <p className="text-xs font-arabic text-[var(--color-text-muted)] mt-0.5 truncate text-right" dir="rtl">
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
