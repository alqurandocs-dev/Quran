import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, Megaphone, Star,
  Sparkles, ListOrdered, CalendarDays, LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'
import { AdminDuasPage } from './AdminDuasPage'
import { AdminAnnouncementsPage } from './AdminAnnouncementsPage'
import { AdminFeaturedPage } from './AdminFeaturedPage'
import { AdminHeroPage } from './AdminHeroPage'
import { AdminPopularSurahsPage } from './AdminPopularSurahsPage'
import { AdminDailyDuaPage } from './AdminDailyDuaPage'
import { cn } from '@/lib/utils'

type SectionId = 'duas' | 'announcements' | 'featured' | 'hero' | 'popular' | 'dailydua'

interface SectionItem {
  id: SectionId
  label: string
  icon: LucideIcon
  Component: () => React.JSX.Element
  desc: string
}

interface SectionGroup {
  group: string
  items: SectionItem[]
}

const SECTIONS: SectionGroup[] = [
  {
    group: 'কন্টেন্ট',
    items: [
      { id: 'duas',          label: 'দোয়া CMS',        icon: BookOpen,      Component: AdminDuasPage,          desc: 'যোগ, সম্পাদনা, মুছুন' },
      { id: 'announcements', label: 'বিজ্ঞপ্তি',        icon: Megaphone,     Component: AdminAnnouncementsPage, desc: 'Home banner/notice' },
      { id: 'featured',      label: 'Featured',         icon: Star,          Component: AdminFeaturedPage,      desc: 'Pinned সূরা/দোয়া/পারা' },
    ],
  },
  {
    group: 'Home Page',
    items: [
      { id: 'hero',          label: 'হিরো সেকশন',       icon: Sparkles,      Component: AdminHeroPage,          desc: 'অভিবাদন ও বাটন টেক্সট' },
      { id: 'popular',       label: 'জনপ্রিয় সূরা',    icon: ListOrdered,   Component: AdminPopularSurahsPage, desc: 'কোন সূরা দেখাবে' },
      { id: 'dailydua',      label: 'আজকের দোয়া',       icon: CalendarDays,  Component: AdminDailyDuaPage,      desc: 'Pin বা Auto' },
    ],
  },
]

export function AdminDashboard() {
  const [activeId, setActiveId] = useState<SectionId>('duas')
  const [mobileOpen, setMobileOpen] = useState(false)

  const allItems = SECTIONS.flatMap(s => s.items)
  const active = allItems.find(i => i.id === activeId)!
  const ActiveComponent = active.Component

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* Top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur px-4">
        <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--color-surface)] transition-colors">
          <ArrowLeft className="h-4 w-4 text-[var(--color-text-muted)]" />
        </Link>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-green-500" />
          <span className="font-bold text-sm text-[var(--color-text)]">Admin Panel</span>
        </div>
        {/* Mobile: current section */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] lg:hidden ring-1 ring-[var(--color-border)]"
        >
          <active.icon className="h-3.5 w-3.5 text-green-400" />
          {active.label}
          <span className="text-[var(--color-text-muted)]">▾</span>
        </button>
      </div>

      <div className="flex">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-[var(--color-border)] py-4">
          {SECTIONS.map(section => (
            <div key={section.group} className="mb-4">
              <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {section.group}
              </p>
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    activeId === item.id
                      ? 'bg-green-500/10 text-green-400 font-semibold'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm leading-tight">{item.label}</p>
                    <p className="text-[10px] opacity-60 leading-tight mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Mobile dropdown menu ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-14 left-0 right-0 border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl py-2">
              {SECTIONS.map(section => (
                <div key={section.group}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {section.group}
                  </p>
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveId(item.id); setMobileOpen(false) }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-left',
                        activeId === item.id ? 'text-green-400 font-semibold bg-green-500/5' : 'text-[var(--color-text)]'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <div>
                        <p className="text-sm">{item.label}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 py-5 max-w-2xl">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/15">
              <active.icon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[var(--color-text)]">{active.label}</h1>
              <p className="text-xs text-[var(--color-text-muted)]">{active.desc}</p>
            </div>
          </div>

          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}
