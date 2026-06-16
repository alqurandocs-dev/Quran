import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, X } from 'lucide-react'
import Fuse from 'fuse.js'
import { SURAHS } from '@/data/surahs'
import { formatBanglaNumber } from '@/lib/utils'

// Build search index from surah list (fast, no API)
const fuseIndex = new Fuse(SURAHS, {
  keys: ['banglaName', 'englishName', 'name', 'englishNameTranslation'],
  threshold: 0.4,
  includeScore: true,
})

const RECENT_KEY = 'recent-searches'

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}
function saveRecent(q: string) {
  const prev = getRecent().filter((r) => r !== q)
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 8)))
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent())

  const surahResults = useMemo(() => {
    if (query.length < 1) return []
    return fuseIndex.search(query).slice(0, 10)
  }, [query])

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.length > 1) {
      saveRecent(q)
      setRecentSearches(getRecent())
    }
  }

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecentSearches([])
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4">অনুসন্ধান</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="সূরার নাম, আয়াত বা বাংলা অর্থ লিখুন..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-4 py-3.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-[var(--color-text-muted)]" />
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-1">
              <Clock className="h-3 w-3" /> সাম্প্রতিক অনুসন্ধান
            </p>
            <button onClick={clearRecent} className="text-xs text-[var(--color-text-muted)] hover:text-red-500">
              মুছুন
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((r) => (
              <button
                key={r}
                onClick={() => setQuery(r)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:border-green-500"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Surah Results */}
      {surahResults.length > 0 && (
        <div>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            সূরা — {surahResults.length}টি ফলাফল
          </p>
          <div className="space-y-1">
            {surahResults.map(({ item }) => (
              <Link key={item.number} to={`/quran/${item.number}`}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--color-surface)] transition-colors">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-600/10 text-green-600 dark:text-green-400 font-bold text-sm">
                    {formatBanglaNumber(item.number)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-text)]">{item.banglaName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.englishName} • {formatBanglaNumber(item.numberOfAyahs)} আয়াত
                    </p>
                  </div>
                  <p className="font-arabic text-lg text-green-600 dark:text-green-400" dir="rtl">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query.length > 1 && surahResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-[var(--color-text-muted)]">
            "{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি
          </p>
        </div>
      )}

      {/* Empty state */}
      {!query && recentSearches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">📖</p>
          <p className="font-semibold text-[var(--color-text)] mb-1">কুরআন অনুসন্ধান করুন</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            বাংলা বা ইংরেজিতে সূরার নাম লিখুন
          </p>
        </div>
      )}
    </div>
  )
}
