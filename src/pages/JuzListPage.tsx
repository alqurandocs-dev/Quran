import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Search } from 'lucide-react'
import { JUZ_DATA } from '@/data/juz'
import { Card } from '@/components/ui/Card'
import { formatBanglaNumber } from '@/lib/utils'

export function JuzListPage() {
  const [query, setQuery] = useState('')

  const filtered = JUZ_DATA.filter((juz) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      String(juz.number).includes(q) ||
      juz.banglaName.includes(q) ||
      juz.startSurahBangla.includes(q) ||
      juz.endSurahBangla.includes(q) ||
      formatBanglaNumber(juz.number).includes(q)
    )
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-green-500" />
          পারা
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          কুরআনের ৩০টি পারা
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="পারা নম্বর বা সূরার নাম দিয়ে খুঁজুন..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/50"
        />
      </div>

      {/* Juz Grid */}
      <div className="space-y-2">
        {filtered.map((juz) => (
          <Link key={juz.number} to={`/juz/${juz.number}`}>
            <Card hover className="flex items-center gap-4 py-3 px-4">
              {/* Juz Number Badge */}
              <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-green-600/10 border border-green-500/20">
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatBanglaNumber(juz.number)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[var(--color-text)]">
                    পারা {formatBanglaNumber(juz.number)}
                  </p>
                  <span className="text-xs text-[var(--color-text-muted)] font-arabic">{juz.arabicName}</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {juz.startSurahBangla} {formatBanglaNumber(juz.startSurah)}:{formatBanglaNumber(juz.startAyah)}
                  {' → '}
                  {juz.endSurahBangla} {formatBanglaNumber(juz.endSurah)}:{formatBanglaNumber(juz.endAyah)}
                </p>
              </div>

              {/* Ayah count + arrow */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                  {formatBanglaNumber(juz.totalAyahs)} আয়াত
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          কোনো পারা পাওয়া যায়নি
        </div>
      )}
    </div>
  )
}
