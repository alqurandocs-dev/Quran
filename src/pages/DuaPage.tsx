import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Heart, X } from 'lucide-react'
import Fuse from 'fuse.js'
import { DUAS, DUA_CATEGORIES, type Dua } from '@/data/duas'
import { useDuaFavorites } from '@/hooks/useDuaFavorites'
import { cn } from '@/lib/utils'

const fuse = new Fuse(DUAS, {
  keys: ['titleBangla', 'meaning', 'transliteration', 'reference'],
  threshold: 0.4,
  includeScore: true,
})

const BADGE_LABEL: Record<string, string> = {
  sahih: 'সহীহ',
  hasan: 'হাসান',
  quran: 'কুরআন',
}

function DuaBadge({ type }: { type: string }) {
  return (
    <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 flex-shrink-0"
      style={{ background: 'rgba(20,184,166,0.1)', color: '#14B8A6' }}>
      {BADGE_LABEL[type]}
    </span>
  )
}

function DuaCard({ dua }: { dua: Dua }) {
  const { isDuaFavorite, toggleFavorite } = useDuaFavorites()
  const favorited = isDuaFavorite(dua.id)
  const category = DUA_CATEGORIES.find((c) => c.id === dua.category)

  return (
    <div className="rounded-2xl border overflow-hidden transition-all"
      style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
      <Link to={`/dua/${dua.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-[var(--color-text-muted)] mb-1 block">
              {category?.icon} {category?.label}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-text)] leading-snug">
              {dua.titleBangla}
            </h3>
          </div>
          {dua.authenticity && <DuaBadge type={dua.authenticity} />}
        </div>

        <p className="font-arabic text-xl text-right leading-relaxed line-clamp-2 mb-2"
          dir="rtl" lang="ar" style={{ color: '#F8FAFC' }}>
          {dua.arabic}
        </p>

        {dua.transliteration && (
          <p className="text-xs italic line-clamp-1 mb-2 leading-relaxed" style={{ color: '#94A3B8' }}>
            {dua.transliteration}
          </p>
        )}

        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
          {dua.meaning}
        </p>
      </Link>

      <div className="border-t px-4 py-2.5 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-[var(--color-text-muted)]">📚 {dua.reference}</p>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(dua.id) }}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
          aria-label={favorited ? 'প্রিয় থেকে সরান' : 'প্রিয়তে যোগ করুন'}
        >
          <Heart className={cn('h-4 w-4 transition-colors', favorited ? 'fill-red-400 text-red-400' : 'text-[var(--color-text-muted)]')} />
        </button>
      </div>
    </div>
  )
}

export function DuaPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const results = useMemo<Dua[]>(() => {
    let list: Dua[]
    if (query.trim()) {
      list = fuse.search(query.trim()).map((r) => r.item)
    } else {
      list = DUAS
    }
    if (activeCategory) {
      list = list.filter((d) => d.category === activeCategory)
    }
    return list
  }, [query, activeCategory])

  const handleCategoryClick = useCallback((id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">দোয়া সংকলন</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {DUAS.length}টি দোয়া • ১৫টি বিভাগ
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="দোয়া খুঁজুন..."
          className="w-full rounded-xl border pl-9 pr-9 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none transition-colors"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(20,184,166,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex-shrink-0"
            style={activeCategory === cat.id
              ? { background: '#14B8A6', color: '#0B1120' }
              : { background: '#111827', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {(query || activeCategory) && (
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          {results.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🤲</p>
          <p className="text-[var(--color-text-muted)]">কোনো দোয়া পাওয়া যায়নি।</p>
          {(query || activeCategory) && (
            <button
              onClick={() => { setQuery(''); setActiveCategory(null) }}
              className="mt-3 text-sm hover:underline"
              style={{ color: '#14B8A6' }}
            >
              ফিল্টার সরিয়ে দিন
            </button>
          )}
        </div>
      )}
    </div>
  )
}
