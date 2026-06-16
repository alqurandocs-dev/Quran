import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X, AlertTriangle, Database, HardDrive } from 'lucide-react'
import { useAdminFeatured, type FeaturedItem, type FeaturedFormData } from '@/hooks/useFeaturedContent'
import { cn } from '@/lib/utils'

const TYPE_META = {
  surah: { label: 'সূরা',  emoji: '📖', hint: 'সূরা নম্বর (যেমন: 36)' },
  dua:   { label: 'দোয়া',  emoji: '🤲', hint: 'দোয়া ID (যেমন: morning_dua_1)' },
  juz:   { label: 'পারা',  emoji: '📚', hint: 'পারা নম্বর (যেমন: 30)' },
}

const EMPTY: FeaturedFormData = {
  type: 'surah', refId: '', title: '', subtitle: '', badge: '',
  isActive: true, sortOrder: 0,
}

function FeaturedModal({
  initial, onSave, onClose,
}: { initial: FeaturedItem | null; onSave: (d: FeaturedFormData) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<FeaturedFormData>(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof FeaturedFormData, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.refId.trim()) { setError('শিরোনাম ও ID আবশ্যক'); return }
    setSaving(true)
    try {
      await onSave({ ...form, id: initial?.id })
      onClose()
    } catch (err) { setError((err as Error).message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-bold text-[var(--color-text)]">{initial ? 'Featured সম্পাদনা' : 'নতুন Featured'}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-surface)]">
            <X className="h-4 w-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] block mb-1.5">ধরন</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TYPE_META) as [FeaturedItem['type'], typeof TYPE_META.surah][]).map(([k, v]) => (
                <button key={k} type="button" onClick={() => set('type', k)}
                  className={cn('rounded-xl py-2.5 text-sm font-bold ring-1 transition-colors',
                    form.type === k ? 'bg-green-500/20 text-green-300 ring-green-500/40' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] ring-[var(--color-border)]')}>
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ref ID */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] block mb-1.5">
              {TYPE_META[form.type].label} ID / নম্বর
            </label>
            <input value={form.refId} onChange={e => set('refId', e.target.value)}
              placeholder={TYPE_META[form.type].hint}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
          </div>

          {/* Title + Subtitle */}
          <div className="space-y-2">
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="শিরোনাম *"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            <input value={form.subtitle ?? ''} onChange={e => set('subtitle', e.target.value)} placeholder="সাব-টাইটেল (ঐচ্ছিক)"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
          </div>

          {/* Badge + Order */}
          <div className="grid grid-cols-2 gap-2">
            <input value={form.badge ?? ''} onChange={e => set('badge', e.target.value)} placeholder="Badge: রমজান বিশেষ"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)}
              placeholder="ক্রম: 0"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
          </div>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={cn('relative h-6 w-11 rounded-full transition-colors', form.isActive ? 'bg-green-500' : 'bg-[var(--color-border)]')}>
              <div className={cn('absolute top-1 h-4 w-4 rounded-full bg-white transition-transform shadow', form.isActive ? 'translate-x-6' : 'translate-x-1')} />
            </div>
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="sr-only" />
            <span className="text-sm text-[var(--color-text)]">সক্রিয়</span>
          </label>

          {error && <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)]">বাতিল</button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-500 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />সংরক্ষণ...</> : (initial ? 'আপডেট' : 'যোগ করুন')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AdminFeaturedPage() {
  const { items, isLoading, isDbEnabled, save, remove, toggle } = useAdminFeatured()
  const [editItem, setEditItem] = useState<FeaturedItem | null | undefined>(undefined)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id); setConfirmId(null)
    try { await remove(id) } finally { setDeletingId(null) }
  }

  return (
    <div className="space-y-4">
      <div className={cn('flex items-center gap-2 rounded-2xl px-4 py-3 ring-1 text-sm',
        isDbEnabled ? 'bg-green-500/10 ring-green-500/30 text-green-400' : 'bg-amber-500/10 ring-amber-500/30 text-amber-400')}>
        {isDbEnabled ? <><Database className="h-4 w-4" />Supabase সংযুক্ত</> : <><HardDrive className="h-4 w-4" />Supabase সংযুক্ত নেই — read-only</>}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] px-1">
        Featured content Home page এ বিশেষ সেকশনে দেখানো হয়। সূরা, দোয়া বা পারা pin করুন।
      </p>

      <button onClick={() => setEditItem(null)} disabled={!isDbEnabled}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-border)] py-3.5 text-sm font-semibold text-[var(--color-text-muted)] hover:border-green-500/40 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <Plus className="h-4 w-4" /> নতুন Featured যোগ
      </button>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-green-500" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p className="text-3xl mb-2">⭐</p>
          <p className="text-sm">কোনো featured content নেই</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const meta = TYPE_META[item.type]
            const confirming = confirmId === item.id
            return (
              <div key={item.id} className={cn('rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all', !item.isActive && 'opacity-50')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-xl">
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[var(--color-text)]">{item.title}</p>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {meta.label} · ID: {item.refId} · ক্রম: {item.sortOrder}
                      {' · '}<span className={item.isActive ? 'text-green-400' : 'text-red-400'}>{item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!confirming ? (
                      <>
                        <button onClick={() => toggle({ id: item.id, isActive: !item.isActive })} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-[var(--color-text-muted)] transition-colors disabled:opacity-40">
                          {item.isActive ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setEditItem(item)} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-500/10 text-[var(--color-text-muted)] hover:text-blue-400 transition-colors disabled:opacity-40">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setConfirmId(item.id)} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-40">
                          {deletingId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-2.5 py-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs text-red-400">মুছবেন?</span>
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-red-400 underline">হ্যাঁ</button>
                        <button onClick={() => setConfirmId(null)} className="text-xs text-[var(--color-text-muted)]">না</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editItem !== undefined && (
        <FeaturedModal initial={editItem} onSave={async d => { await save(d) }} onClose={() => setEditItem(undefined)} />
      )}
    </div>
  )
}
