import { useState, useEffect } from 'react'
import { X, Loader2, Save } from 'lucide-react'
import { type Dua, DUA_CATEGORIES } from '@/data/duas'
import { type DuaFormData } from '@/hooks/useAdminDuas'
import { cn } from '@/lib/utils'

interface Props {
  initial?: Dua | null
  onSave: (data: DuaFormData) => Promise<void>
  onClose: () => void
}

const EMPTY: DuaFormData = {
  category: 'morning',
  titleBangla: '',
  arabic: '',
  transliteration: '',
  meaning: '',
  reference: '',
  authenticity: undefined,
}

export function DuaFormModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<DuaFormData>(initial ? { ...initial } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm(initial ? { ...initial } : EMPTY)
    setError(null)
  }, [initial])

  const set = (field: keyof DuaFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value || undefined }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titleBangla.trim() || !form.arabic.trim() || !form.meaning.trim()) {
      setError('শিরোনাম, আরবি এবং অর্থ আবশ্যক')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!initial

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4">
          <div>
            <h2 className="font-bold text-[var(--color-text)]">
              {isEdit ? 'দোয়া সম্পাদনা' : 'নতুন দোয়া যোগ'}
            </h2>
            {initial?.id && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">ID: {initial.id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-surface)] transition-colors"
          >
            <X className="h-4 w-4 text-[var(--color-text-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              বিভাগ
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
            >
              {DUA_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              শিরোনাম (বাংলা) *
            </label>
            <input
              type="text"
              value={form.titleBangla}
              onChange={(e) => set('titleBangla', e.target.value)}
              placeholder="যেমন: ঘুমের আগের দোয়া"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
            />
          </div>

          {/* Arabic */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              আরবি টেক্সট *
            </label>
            <textarea
              value={form.arabic}
              onChange={(e) => set('arabic', e.target.value)}
              placeholder="আরবি লিখুন..."
              rows={3}
              dir="rtl"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-xl font-arabic text-right text-[#94A3B8] dark:text-[#94A3B8] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)] leading-loose resize-none"
            />
          </div>

          {/* Transliteration */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              উচ্চারণ
            </label>
            <textarea
              value={form.transliteration}
              onChange={(e) => set('transliteration', e.target.value)}
              placeholder="আল্লাহুম্মা বিকা আসবাহনা..."
              rows={2}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)] resize-none"
            />
          </div>

          {/* Meaning */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
              অর্থ *
            </label>
            <textarea
              value={form.meaning}
              onChange={(e) => set('meaning', e.target.value)}
              placeholder="বাংলায় অর্থ লিখুন..."
              rows={3}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)] resize-none"
            />
          </div>

          {/* Reference + Authenticity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                রেফারেন্স
              </label>
              <input
                type="text"
                value={form.reference}
                onChange={(e) => set('reference', e.target.value)}
                placeholder="বুখারী ১/৩০২"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">
                সত্যতা
              </label>
              <select
                value={form.authenticity ?? ''}
                onChange={(e) => set('authenticity', e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
              >
                <option value="">— নির্বাচন করুন</option>
                <option value="sahih">✅ সহীহ</option>
                <option value="hasan">🟡 হাসান</option>
                <option value="quran">📖 কুরআনিক</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors',
                saving
                  ? 'bg-green-700 text-green-200 cursor-not-allowed'
                  : 'bg-[#14B8A6] text-white hover:bg-[#14B8A6]'
              )}
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> সংরক্ষণ...</>
              ) : (
                <><Save className="h-4 w-4" /> {isEdit ? 'আপডেট করুন' : 'যোগ করুন'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
