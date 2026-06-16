import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookMarked, ChevronRight, Play, X } from 'lucide-react'
import { useReadingStore } from '@/stores/readingStore'
import { useBookmarks } from '@/hooks/useBookmarks'
import { SURAHS, POPULAR_SURAHS, DUAS, DUA_CATEGORIES } from '@/data'
import { formatBanglaNumber } from '@/lib/utils'
import { HomePrayerCard } from '@/components/prayer/HomePrayerCard'
import { TahajjudMiniCard } from '@/components/prayer/TahajjudMiniCard'
import { useActiveAnnouncements } from '@/hooks/useAnnouncements'
import { useActiveFeatured } from '@/hooks/useFeaturedContent'

function getDailyDuaIndex() {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  return dayOfYear % DUAS.length
}

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

      {/* Announcements */}
      {announcements.filter(a => !dismissedIds.has(a.id)).map(a => (
        <div key={a.id} className="flex items-start gap-3 rounded-2xl px-4 py-3 border"
          style={{ background: 'rgba(20,184,166,0.08)', borderColor: 'rgba(20,184,166,0.2)', color: '#14B8A6' }}>
          {a.icon && <span className="text-lg shrink-0">{a.icon}</span>}
          <p className="flex-1 text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>{a.message}
            {a.linkText && a.linkUrl && (
              <Link to={a.linkUrl} className="ml-2 underline font-semibold" style={{ color: '#14B8A6' }}>{a.linkText} →</Link>
            )}
          </p>
          <button onClick={() => setDismissedIds(s => new Set([...s, a.id]))} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full blur-3xl"
          style={{ background: 'rgba(20,184,166,0.06)' }} />
        <p className="pointer-events-none absolute right-5 top-3 text-5xl opacity-5 select-none">☽</p>

        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(20,184,166,0.6)' }}>
            আস-সালামু আলাইকুম
          </p>
          <p className="font-arabic text-3xl leading-loose mb-1" style={{ color: '#F8FAFC' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-sm mb-5" style={{ color: '#94A3B8' }}>পরম করুণাময়, অতিদয়ালু আল্লাহর নামে</p>
          <div className="flex gap-3">
            <Link to="/quran">
              <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
                style={{ background: '#14B8A6', color: '#0B1120' }}>
                <BookOpen className="h-4 w-4" />
                কুরআন পড়ুন
              </button>
            </Link>
            <Link to="/dua">
              <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.08)' }}>
                দোয়া দেখুন
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Continue Reading */}
      {lastRead && (
        <Link to={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`} className="block group">
          <div className="relative overflow-hidden rounded-2xl border p-4 transition-all"
            style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.15)' }}>
                <BookOpen className="h-5 w-5" style={{ color: '#14B8A6' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#14B8A6' }}>পড়া চালিয়ে যান</p>
                <p className="font-bold text-[var(--color-text)] truncate">{lastRead.surahName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">আয়াত {formatBanglaNumber(lastRead.ayahNumber)}</p>
              </div>
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: 'rgba(20,184,166,0.1)' }}>
                <Play className="h-3.5 w-3.5 translate-x-0.5" style={{ color: '#14B8A6' }} />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Prayer Times */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 px-1">নামাজের সময়</p>
        <HomePrayerCard />
        <div className="mt-2">
          <TahajjudMiniCard />
        </div>
      </div>

      {/* Today's Dua */}
      <Link to="/daily-dua" className="block group">
        <div className="rounded-2xl border p-5 transition-all"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{todayDuaCategory?.icon}</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#14B8A6' }}>আজকের দোয়া</p>
                <p className="text-xs text-[var(--color-text-muted)]">{todayDuaCategory?.label}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          <p className="font-bold text-[var(--color-text)] mb-3">{todayDua.titleBangla}</p>

          <div className="rounded-xl px-4 py-3 mb-3"
            style={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-arabic text-right text-xl leading-loose" dir="rtl"
              style={{ color: '#F8FAFC' }}>
              {todayDua.arabic}
            </p>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{todayDua.meaning}</p>
        </div>
      </Link>

      {/* Featured Content */}
      {featuredItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 px-1">বিশেষ</p>
          <div className="space-y-2">
            {featuredItems.map(item => {
              const href = item.type === 'surah' ? `/quran/${item.refId}` : item.type === 'dua' ? `/dua/${item.refId}` : `/juz/${item.refId}`
              return (
                <Link key={item.id} to={href} className="group block">
                  <div className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                    style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                      style={{ background: '#1F2937' }}>
                      {item.type === 'surah' ? '📖' : item.type === 'dua' ? '🤲' : '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[var(--color-text)]">{item.title}</p>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(20,184,166,0.12)', color: '#14B8A6', border: '1px solid rgba(20,184,166,0.2)' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.subtitle}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Popular Surahs */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">জনপ্রিয় সূরা</p>
          <Link to="/quran" className="text-xs flex items-center gap-0.5" style={{ color: '#14B8A6' }}>
            সব দেখুন <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popularSurahs.slice(0, 6).map((surah) => (
            <Link key={surah.number} to={`/quran/${surah.number}`} className="group">
              <div className="rounded-2xl border p-4 transition-all"
                style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                <p className="font-arabic text-2xl mb-2 leading-relaxed" style={{ color: '#F8FAFC' }}>{surah.name}</p>
                <p className="font-bold text-sm text-[var(--color-text)]">{surah.banglaName}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatBanglaNumber(surah.numberOfAyahs)} আয়াত</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Para / Juz */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">পারা</p>
          <Link to="/juz" className="text-xs flex items-center gap-0.5" style={{ color: '#14B8A6' }}>
            সব দেখুন <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <Link key={n} to={`/juz/${n}`} className="group">
              <div className="relative flex aspect-square items-center justify-center rounded-2xl border transition-all"
                style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; (e.currentTarget.querySelector('span') as HTMLElement | null)?.style && ((e.currentTarget.querySelector('span') as HTMLElement).style.color = '#14B8A6') }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget.querySelector('span') as HTMLElement | null)?.style && ((e.currentTarget.querySelector('span') as HTMLElement).style.color = '') }}>
                <span className="text-sm font-bold text-[var(--color-text)]">
                  {formatBanglaNumber(n)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">বুকমার্ক</p>
            <Link to="/bookmarks" className="text-xs flex items-center gap-0.5" style={{ color: '#14B8A6' }}>
              সব দেখুন <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {bookmarks.slice(0, 3).map((bm) => (
              <Link key={bm.id} to={`/quran/${bm.surahNumber}#ayah-${bm.ayahNumber}`} className="group block">
                <div className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all"
                  style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.15)' }}>
                    <BookMarked className="h-4 w-4" style={{ color: '#14B8A6' }} />
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
                  <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
