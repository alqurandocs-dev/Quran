import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SURAHS } from '@/data/surahs'
import { Card } from '@/components/ui/Card'
import { formatBanglaNumber } from '@/lib/utils'

const TABS = ['সূরা', 'পারা', 'পৃষ্ঠা'] as const

export function QuranPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('সূরা')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return SURAHS
    const q = search.toLowerCase()
    return SURAHS.filter(
      (s) =>
        s.banglaName.includes(search) ||
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(search) ||
        String(s.number).includes(q)
    )
  }, [search])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">আল-কুরআনুল কারীম</h1>
        <p className="text-sm text-[var(--color-text-muted)]">১১৪টি সূরা • ৩০টি পারা • ৬২৩৬টি আয়াত</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="সূরা খুঁজুন..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 rounded-xl bg-[var(--color-surface)] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-green-600 text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Surah List */}
      {tab === 'সূরা' && (
        <div className="space-y-1">
          {filtered.map((surah) => (
            <Link key={surah.number} to={`/quran/${surah.number}`}>
              <div className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-[var(--color-surface)] transition-colors group">
                {/* Number badge */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-600/10 text-green-600 dark:text-green-400 font-bold text-sm">
                  {formatBanglaNumber(surah.number)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--color-text)] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {surah.banglaName}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      surah.revelationType === 'Meccan'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {surah.revelationType === 'Meccan' ? 'মক্কী' : 'মাদানী'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {surah.englishName} • {formatBanglaNumber(surah.numberOfAyahs)} আয়াত
                  </p>
                </div>

                {/* Arabic name */}
                <p className="font-arabic text-xl text-green-700 dark:text-green-400 flex-shrink-0" dir="rtl">
                  {surah.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Para List */}
      {tab === 'পারা' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((para) => (
            <Link key={para} to={`/juz/${para}`}>
              <Card hover className="text-center py-4">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatBanglaNumber(para)}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">পারা {formatBanglaNumber(para)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {tab === 'পৃষ্ঠা' && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
            <Link key={page} to={`/page/${page}`}>
              <Card hover className="text-center py-3">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {formatBanglaNumber(page)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
