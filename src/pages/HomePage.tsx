import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookMarked, ChevronRight, Play, ArrowUpRight, X } from 'lucide-react'
import { useReadingStore } from '@/stores/readingStore'
import { useBookmarks } from '@/hooks/useBookmarks'
import { SURAHS, POPULAR_SURAHS, DUAS, DUA_CATEGORIES } from '@/data'
import { formatBanglaNumber } from '@/lib/utils'
import { HomePrayerCard } from '@/components/prayer/HomePrayerCard'
import { TahajjudMiniCard } from '@/components/prayer/TahajjudMiniCard'
import { useActiveAnnouncements } from '@/hooks/useAnnouncements'
import { useActiveFeatured } from '@/hooks/useFeaturedContent'

const ANNOUNCEMENT_STYLES = {
  info:    'bg-blue-500/15  ring-blue-500/30  text-blue-300',
  success: 'bg-green-500/15 ring-green-500/30 text-green-300',
  warning: 'bg-amber-500/15 ring-amber-500/30 text-amber-300',
  ramadan: 'bg-indigo-500/15 ring-indigo-500/30 text-indigo-300',
}

function getDailyDuaIndex() {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  return dayOfYear % DUAS.length
}

const SURAH_GRADIENTS = [
  'from-violet-600/20 to-purple-700/10',
  'from-blue-600/20 to-cyan-700/10',
  'from-emerald-600/20 to-teal-700/10',
  'from-amber-600/20 to-orange-700/10',
  'from-rose-600/20 to-pink-700/10',
]

export function HomePage() {
  const { lastRead } = useReadingStore()
  const { bookmarks } = useBookmarks()

  const todayDua = DUAS[getDailyDuaIndex()]
  const todayDuaCategory = DUA_CATEGORIES.find((c) => c.id === todayDua.category)
  const popularSurahs = POPULAR_SURAHS.map((n) => SURAHS[n - 1])
  const { data: announcements = [] } = useActiveAnnouncements()
  const { data: featuredItems = [] } = useActiveFeatured()
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">

      {/* ── Announcements ── */}
      {announcements.filter(a => !dismissedIds.has(a.id)).map(a => (
        <div key={a.id} className={`flex items-start gap-3 rounded-2xl px-4 py-3 ring-1 ${ANNOUNCEMENT_STYLES[a.type]}`}>
          {a.icon && <span className="text-lg shrink-0">{a.icon}</span>}
          <p className="flex-1 text-sm leading-relaxed">{a.message}
            {a.linkText && a.linkUrl && (
              <Link to={a.linkUrl} className="ml-2 underline font-semibold">{a.linkText} →</Link>
            )}
          </p>
          <button onClick={() => setDismissedIds(s => new Set([...s, a.id]))} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3d26] via-[#0d4f32] to-[#071f15] p-6 shadow-2xl shadow-green-950/50 ring-1 ring-green-500/20">
        {/* decorative */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-green-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
        {/* crescent */}
        <p className="pointer-events-none absolute right-5 top-3 text-5xl opacity-10 select-none">☽</p>

        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400/70 mb-3">
            আস-সালামু আলাইকুম
          </p>
          <p className="font-arabic text-3xl text-amber-200 leading-loose mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-green-300/70 text-sm mb-5">পরম করুণাময়, অতিদয়ালু আল্লাহর নামে</p>
          <div className="flex gap-3">
            <Link to="/quran">
              <button className="flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-bold text-green-950 hover:bg-green-300 transition-colors shadow-lg shadow-green-900/40">
                <BookOpen className="h-4 w-4" />
                কুরআন পড়ুন
              </button>
            </Link>
            <Link to="/dua">
              <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors ring-1 ring-white/20">
                দোয়া দেখুন
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Continue Reading ── */}
      {lastRead && (
        <Link to={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`} className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 group-hover:border-green-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 ring-1 ring-green-500/20">
                <BookOpen className="h-5 w-5 text-green-400" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-green-500 mb-0.5">পড়া চালিয়ে যান</p>
                <p className="font-bold text-[var(--color-text)] truncate">{lastRead.surahName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">আয়াত {formatBanglaNumber(lastRead.ayahNumber)}</p>
              </div>
              {/* Arrow */}
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <Play className="h-3.5 w-3.5 text-green-400 translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Prayer Times ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">নামাজের সময়</p>
        </div>
        <HomePrayerCard />
        <div className="mt-2">
          <TahajjudMiniCard />
        </div>
      </div>

      {/* ── Today's Dua ── */}
      <Link to="/daily-dua" className="block group">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1a00] via-[#3a2200] to-[#1a0f00] ring-1 ring-amber-500/20 shadow-xl shadow-amber-950/30 group-hover:ring-amber-400/40 transition-all">
          <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-20 w-20 rounded-full bg-orange-500/10 blur-xl" />

          <div className="relative z-10 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{todayDuaCategory?.icon}</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/70">আজকের দোয়া</p>
                  <p className="text-xs text-amber-300/80">{todayDuaCategory?.label}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-amber-400/50 group-hover:text-amber-300 transition-colors" />
            </div>

            {/* Title */}
            <p className="font-bold text-white mb-3">{todayDua.titleBangla}</p>

            {/* Arabic */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-amber-500/15 px-4 py-3 mb-3">
              <p className="font-arabic text-right text-xl text-amber-200 leading-loose" dir="rtl">
                {todayDua.arabic}
              </p>
            </div>

            {/* Meaning preview */}
            <p className="text-sm text-amber-100/60 line-clamp-2">{todayDua.meaning}</p>
          </div>
        </div>
      </Link>

      {/* ── Featured Content ── */}
      {featuredItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">⭐ বিশেষ</p>
          </div>
          <div className="space-y-2">
            {featuredItems.map(item => {
              const href = item.type === 'surah' ? `/quran/${item.refId}` : item.type === 'dua' ? `/dua/${item.refId}` : `/juz/${item.refId}`
              return (
                <Link key={item.id} to={href} className="group block">
                  <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent px-4 py-3 group-hover:border-amber-400/40 transition-all">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-xl">
                      {item.type === 'surah' ? '📖' : item.type === 'dua' ? '🤲' : '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[var(--color-text)]">{item.title}</p>
                        {item.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">{item.badge}</span>}
                      </div>
                      {item.subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.subtitle}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-400/50 group-hover:text-amber-300 shrink-0 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Popular Surahs ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">জনপ্রিয় সূরা</p>
          <Link to="/quran" className="text-xs text-green-500 flex items-center gap-0.5 hover:text-green-400">
            সব দেখুন <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popularSurahs.slice(0, 6).map((surah, i) => (
            <Link key={surah.number} to={`/quran/${surah.number}`} className="group">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${SURAH_GRADIENTS[i % SURAH_GRADIENTS.length]} border border-[var(--color-border)] p-4 group-hover:border-green-500/30 group-hover:scale-[1.02] transition-all`}>
                <div className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/5 blur-xl" />
                <p className="font-arabic text-2xl text-green-400 dark:text-green-300 mb-2 leading-relaxed">{surah.name}</p>
                <p className="font-bold text-sm text-[var(--color-text)]">{surah.banglaName}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatBanglaNumber(surah.numberOfAyahs)} আয়াত</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Para / Juz ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">পারা</p>
          <Link to="/juz" className="text-xs text-green-500 flex items-center gap-0.5 hover:text-green-400">
            সব দেখুন <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <Link key={n} to={`/juz/${n}`} className="group">
              <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all" />
                <span className="relative text-sm font-bold text-[var(--color-text)] group-hover:text-green-500 transition-colors">
                  {formatBanglaNumber(n)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Bookmarks ── */}
      {bookmarks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">বুকমার্ক</p>
            <Link to="/bookmarks" className="text-xs text-green-500 flex items-center gap-0.5 hover:text-green-400">
              সব দেখুন <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {bookmarks.slice(0, 3).map((bm) => (
              <Link key={bm.id} to={`/quran/${bm.surahNumber}#ayah-${bm.ayahNumber}`} className="group block">
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 group-hover:border-green-500/30 transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                    <BookMarked className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--color-text)]">
                      {bm.surahName}
                      <span className="font-normal text-[var(--color-text-muted)]"> · আয়াত {formatBanglaNumber(bm.ayahNumber)}</span>
                    </p>
                    {bm.ayahText && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-arabic truncate" dir="rtl">
                        {bm.ayahText.slice(0, 55)}…
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 group-hover:text-green-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
