import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X, AlertTriangle, Database, HardDrive } from 'lucide-react'
import { useAdminAnnouncements, type Announcement, type AnnouncementFormData } from '@/hooks/useAnnouncements'
import { cn } from '@/lib/utils'

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  info:     { label: 'তথ্য',      bg: 'bg-blue-500/15',  text: 'text-blue-300',  ring: 'ring-blue-500/30' },
  success:  { label: 'সফলতা',    bg: 'bg-green-500/15', text: 'text-green-300', ring: 'ring-green-500/30' },
  warning:  { label: 'সতর্কতা',  bg: 'bg-amber-500/15', text: 'text-amber-300', ring: 'ring-amber-500/30' },
  ramadan:  { label: 'রমজান',     bg: 'bg-indigo-500/15',text: 'text-indigo-300',ring: 'ring-indigo-500/30' },
}

const EMPTY: AnnouncementFormData = {
  message: '', type: 'info', icon: '', linkText: '', linkUrl: '',
  isActive: true, startsAt: new Date().toISOString().slice(0, 16), endsAt: undefined,
}

function AnnouncementModal({
  initial, onSave, onClose,
}: { initial: Announcement | null; onSave: (d: AnnouncementFormData) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<AnnouncementFormData>(
    initial ? { ...initial, startsAt: initial.startsAt.slice(0, 16), endsAt: initial.endsAt?.slice(0, 16) }
            : EMPTY
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof AnnouncementFormData, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.message.trim()) { setError('বার্তা আবশ্যক'); return }
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
          <h2 className="font-bold text-[var(--color-text)]">{initial ? 'বিজ্ঞপ্তি সম্পাদনা' : 'নতুন বিজ্ঞপ্তি'}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-surface)]">
            <X className="h-4 w-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] block mb-1.5">ধরন</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(TYPE_STYLES).map(([k, v]) => (
                <button key={k} type="button" onClick={() => set('type', k)}
                  className={cn('rounded-xl py-2 text-xs font-bold ring-1 transition-colors', v.ring,
                    form.type === k ? `${v.bg} ${v.text}` : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]')}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon + Message */}
          <div className="flex gap-2">
            <input value={form.icon ?? ''} onChange={e => set('icon', e.target.value)} placeholder="🌙"
              className="w-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="বিজ্ঞপ্তির বার্তা..." rows={2}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-none" />
          </div>

          {/* Link */}
          <div className="grid grid-cols-2 gap-2">
            <input value={form.linkText ?? ''} onChange={e => set('linkText', e.target.value)} placeholder="বাটন টেক্সট"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            <input value={form.linkUrl ?? ''} onChange={e => set('linkUrl', e.target.value)} placeholder="/dua বা URL"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--color-text-muted)] block mb-1">শুরুর সময়</label>
              <input type="datetime-local" value={form.startsAt} onChange={e => set('startsAt', e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-muted)] block mb-1">শেষের সময় (ঐচ্ছিক)</label>
              <input type="datetime-local" value={form.endsAt ?? ''} onChange={e => set('endsAt', e.target.value || undefined)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-green-500/40" />
            </div>
          </div>

          {/* Active toggle */}
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

export function AdminAnnouncementsPage() {
  const { announcements, isLoading, isDbEnabled, save, remove, toggle } = useAdminAnnouncements()
  const [editItem, setEditItem] = useState<Announcement | null | undefined>(undefined)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id); setConfirmId(null)
    try { await remove(id) } finally { setDeletingId(null) }
  }

  return (
    <div className="space-y-4">
      {/* DB Status */}
      <div className={cn('flex items-center gap-2 rounded-2xl px-4 py-3 ring-1 text-sm',
        isDbEnabled ? 'bg-green-500/10 ring-green-500/30 text-green-400' : 'bg-amber-500/10 ring-amber-500/30 text-amber-400')}>
        {isDbEnabled ? <><Database className="h-4 w-4" />Supabase সংযুক্ত</> : <><HardDrive className="h-4 w-4" />Supabase সংযুক্ত নেই — read-only</>}
      </div>

      {/* Add Button */}
      <button onClick={() => setEditItem(null)} disabled={!isDbEnabled}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-border)] py-3.5 text-sm font-semibold text-[var(--color-text-muted)] hover:border-green-500/40 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <Plus className="h-4 w-4" /> নতুন বিজ্ঞপ্তি যোগ
      </button>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-green-500" /></div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p className="text-3xl mb-2">📢</p>
          <p className="text-sm">কোনো বিজ্ঞপ্তি নেই</p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.map(a => {
            const style = TYPE_STYLES[a.type]
            const confirming = confirmId === a.id
            return (
              <div key={a.id} className={cn('rounded-2xl border px-4 py-3 ring-1 transition-all',
                a.isActive ? `${style.bg} ${style.ring}` : 'border-[var(--color-border)] bg-[var(--color-surface)] ring-transparent opacity-60')}>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{a.icon || '📢'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', a.isActive ? style.text : 'text-[var(--color-text-muted)]')}>{a.message}</p>
                    {a.linkText && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">→ {a.linkText}: {a.linkUrl}</p>}
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                      {new Date(a.startsAt).toLocaleDateString('bn-BD')}
                      {a.endsAt && ` – ${new Date(a.endsAt).toLocaleDateString('bn-BD')}`}
                      {' · '}<span className={cn('font-semibold', a.isActive ? 'text-green-400' : 'text-red-400')}>{a.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!confirming ? (
                      <>
                        <button onClick={() => toggle({ id: a.id, isActive: !a.isActive })} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-[var(--color-text-muted)] transition-colors disabled:opacity-40">
                          {a.isActive ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setEditItem(a)} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-500/10 text-[var(--color-text-muted)] hover:text-blue-400 transition-colors disabled:opacity-40">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setConfirmId(a.id)} disabled={!isDbEnabled}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-40">
                          {deletingId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-2.5 py-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs text-red-400">মুছবেন?</span>
                        <button onClick={() => handleDelete(a.id)} className="text-xs font-bold text-red-400 underline">হ্যাঁ</button>
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
        <AnnouncementModal initial={editItem} onSave={async d => { await save(d) }} onClose={() => setEditItem(undefined)} />
      )}
    </div>
  )
}
