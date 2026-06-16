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

function DuaCard({ dua }: { dua: Dua }) {
  const { isDuaFavorite, toggleFavorite } = useDuaFavorites()
  const favorited = isDuaFavorite(dua.id)
  const category = DUA_CATEGORIES.find((c) => c.id === dua.category)

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-green-500/30 transition-colors">
      <Link to={`/dua/${dua.id}`} className="block p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-[var(--color-text-muted)] mb-1 block">
              {category?.icon} {category?.label}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-text)] leading-snug">
              {dua.titleBangla}
            </h3>
          </div>
          {dua.authenticity && (
            <span className={cn('text-[10px] font-semibold rounded-full px-2 py-0.5 flex-shrink-0', BADGE_COLOR[dua.authenticity])}>
              {BADGE_LABEL[dua.authenticity]}
            </span>
          )}
        </div>

        {/* Arabic preview */}
        <p
          className="font-arabic text-xl text-right text-green-700 dark:text-amber-200 leading-relaxed line-clamp-2 mb-2"
          dir="rtl"
          lang="ar"
        >
          {dua.arabic}
        </p>

        {/* Transliteration */}
        {dua.transliteration && (
          <p className="text-xs italic text-green-700 dark:text-green-400 line-clamp-1 mb-2 leading-relaxed">
            {dua.transliteration}
          </p>
        )}

        {/* Meaning preview */}
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
          {dua.meaning}
        </p>
      </Link>

      <div className="border-t border-[var(--color-border)] px-4 py-2.5 flex items-center justify-between">
        <p className="text-xs text-[var(--color-text-muted)]">📚 {dua.reference}</p>
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(dua.id)
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
          aria-label={favorited ? 'প্রিয় থেকে সরান' : 'প্রিয়তে যোগ করুন'}
        >
          <Heart
            className={cn('h-4 w-4 transition-colors', favorited ? 'fill-red-500 text-red-500' : 'text-[var(--color-text-muted)]')}
          />
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">দোয়া সংকলন</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {DUAS.length}টি দোয়া • ১৫টি বিভাগ
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="দোয়া খুঁজুন..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-9 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-green-500 transition-colors"
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

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex-shrink-0',
              activeCategory === cat.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-green-500/50'
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {(query || activeCategory) && (
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          {results.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* Dua grid */}
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
              className="mt-3 text-sm text-green-500 hover:underline"
            >
              ফিল্টার সরিয়ে দিন
            </button>
          )}
        </div>
      )}
    </div>
  )
}
