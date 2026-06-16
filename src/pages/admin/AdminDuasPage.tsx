import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Loader2, AlertTriangle, Database, HardDrive, X } from 'lucide-react'
import { useAdminDuas, type DuaFormData } from '@/hooks/useAdminDuas'
import { type Dua, DUA_CATEGORIES } from '@/data/duas'
import { DuaFormModal } from './DuaFormModal'
import { cn } from '@/lib/utils'

const AUTHENTICITY_BADGE: Record<string, { label: string; className: string }> = {
  sahih:  { label: 'সহীহ',     className: 'bg-[rgba(20,184,166,0.15)] text-[#14B8A6] ring-[rgba(20,184,166,0.3)]' },
  hasan:  { label: 'হাসান',    className: 'bg-[rgba(255,255,255,0.06)] text-[#94A3B8] ring-[rgba(255,255,255,0.1)]' },
  quran:  { label: 'কুরআনিক', className: 'bg-blue-500/20  text-blue-400  ring-blue-500/30'  },
}

export function AdminDuasPage() {
  const { duas, isLoading, isDbEnabled, save, remove } = useAdminDuas()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [editDua, setEditDua] = useState<Dua | null | undefined>(undefined) // undefined = closed, null = new
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return duas.filter((d) => {
      const catMatch = filterCat === 'all' || d.category === filterCat
      const searchMatch = !q || d.titleBangla.toLowerCase().includes(q) || d.arabic.includes(q) || d.meaning.toLowerCase().includes(q)
      return catMatch && searchMatch
    })
  }, [duas, search, filterCat])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setConfirmDeleteId(null)
    try {
      await remove(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-text-muted)]">{duas.length} টি দোয়া · {filtered.length} টি ফিল্টারে</p>
        <button
          onClick={() => setEditDua(null)}
          disabled={!isDbEnabled}
          title={!isDbEnabled ? 'Supabase সংযুক্ত নেই' : undefined}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors',
            isDbEnabled
              ? 'bg-[#14B8A6] text-white hover:bg-[#14B8A6]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed opacity-60'
          )}
        >
          <Plus className="h-4 w-4" />
          নতুন দোয়া
        </button>
      </div>

      {/* DB Status Banner */}
      <div className={cn(
        'flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 text-sm',
        isDbEnabled
          ? 'bg-[rgba(20,184,166,0.1)] ring-[rgba(20,184,166,0.3)] text-[#14B8A6]'
          : 'bg-[rgba(255,255,255,0.06)] ring-[rgba(255,255,255,0.1)] text-[#94A3B8]'
      )}>
        {isDbEnabled
          ? <><Database className="h-4 w-4 shrink-0" /> Supabase সংযুক্ত — পরিবর্তন সরাসরি ডেটাবেসে সংরক্ষিত হবে</>
          : <><HardDrive className="h-4 w-4 shrink-0" /> Supabase সংযুক্ত নেই — লোকাল ডেটা দেখানো হচ্ছে (read-only)</>
        }
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="দোয়া খুঁজুন..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </button>
          )}
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
        >
          <option value="all">সব বিভাগ</option>
          {DUA_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#14B8A6]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">কোনো দোয়া পাওয়া যায়নি</p>
          <p className="text-sm mt-1">অনুসন্ধান পরিবর্তন করুন</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((dua) => {
            const cat = DUA_CATEGORIES.find((c) => c.id === dua.category)
            const badge = dua.authenticity ? AUTHENTICITY_BADGE[dua.authenticity] : null
            const isThisDeleting = deletingId === dua.id
            const confirming = confirmDeleteId === dua.id

            return (
              <div
                key={dua.id}
                className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all hover:border-[var(--color-border-hover,#3a3a3a)]"
              >
                {/* Row */}
                <div className="flex items-start gap-3">
                  {/* Category icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-lg">
                    {cat?.icon ?? '📿'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-sm text-[var(--color-text)]">{dua.titleBangla}</p>
                      {badge && (
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full ring-1', badge.className)}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      {cat?.label} · ID: {dua.id}
                    </p>
                    <p className="font-arabic text-right text-sm text-[#94A3B8] dark:text-[#94A3B8] mt-1 truncate" dir="rtl">
                      {dua.arabic.slice(0, 60)}{dua.arabic.length > 60 ? '…' : ''}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!confirming ? (
                      <>
                        <button
                          onClick={() => setEditDua(dua)}
                          disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-500/10 text-[var(--color-text-muted)] hover:text-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(dua.id)}
                          disabled={!isDbEnabled || isThisDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isThisDeleting
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </button>
                      </>
                    ) : (
                      /* Inline confirm */
                      <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-2.5 py-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                        <span className="text-xs text-red-400">মুছবেন?</span>
                        <button
                          onClick={() => handleDelete(dua.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-300 underline"
                        >
                          হ্যাঁ
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                          না
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {editDua !== undefined && (
        <DuaFormModal
          initial={editDua}
          onSave={async (data: DuaFormData) => { await save(data) }}
          onClose={() => setEditDua(undefined)}
        />
      )}
    </div>
  )
}
