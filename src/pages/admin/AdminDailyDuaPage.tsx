import { useState, useEffect } from 'react'
import { Loader2, Save, Search, X } from 'lucide-react'
import { useDailyDuaOverride, type DailyDuaOverride } from '@/hooks/useAppSettings'
import { DUAS, DUA_CATEGORIES } from '@/data/duas'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function AdminDailyDuaPage() {
  const { override, isLoading, save, isSaving } = useDailyDuaOverride()
  const [form, setForm] = useState<DailyDuaOverride>({ active: false, duaId: null })
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(override) }, [override])

  const handleSave = async () => {
    await save(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectedDua = DUAS.find(d => d.id === form.duaId)

  const filtered = search.trim()
    ? DUAS.filter(d =>
        d.titleBangla.toLowerCase().includes(search.toLowerCase()) ||
        d.meaning.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-green-500" /></div>

  return (
    <div className="space-y-5">
      {!SUPABASE_ENABLED && (
        <div className="rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/30 px-4 py-3 text-sm text-amber-400">
          Supabase সংযুক্ত নেই — পরিবর্তন সংরক্ষিত হবে না
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] px-1">
        "আজকের দোয়া" সেকশনে নির্দিষ্ট একটি দোয়া pin করুন, নয়তো Auto (দিনের হিসাবে স্বয়ংক্রিয়) রাখুন।
      </p>

      {/* Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div>
          <p className="font-semibold text-sm text-[var(--color-text)]">Pin করা দোয়া সক্রিয়</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            বন্ধ থাকলে দিনের হিসাবে Auto দোয়া দেখাবে
          </p>
        </div>
        <label className="cursor-pointer">
          <div className={cn('relative h-6 w-11 rounded-full transition-colors', form.active ? 'bg-green-500' : 'bg-[var(--color-border)]')}
            onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
            <div className={cn('absolute top-1 h-4 w-4 rounded-full bg-white transition-transform shadow', form.active ? 'translate-x-6' : 'translate-x-1')} />
          </div>
        </label>
      </div>

      {/* Selected dua preview */}
      {selectedDua ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1a00] via-[#3a2200] to-[#1a0f00] ring-1 ring-amber-500/20 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/70">
                {DUA_CATEGORIES.find(c => c.id === selectedDua.category)?.icon} নির্বাচিত দোয়া
              </p>
              <p className="font-bold text-white mt-0.5">{selectedDua.titleBangla}</p>
            </div>
            <button onClick={() => setForm(f => ({ ...f, duaId: null }))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <p className="font-arabic text-right text-lg text-amber-200 leading-loose" dir="rtl">
            {selectedDua.arabic.slice(0, 80)}{selectedDua.arabic.length > 80 ? '…' : ''}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
          কোনো দোয়া নির্বাচিত নেই — নিচে সার্চ করে বেছে নিন
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="দোয়া খুঁজুন..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none"
          />
          {search && <button onClick={() => setSearch('')}><X className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /></button>}
        </div>
        {filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl overflow-hidden">
            {filtered.map(d => {
              const cat = DUA_CATEGORIES.find(c => c.id === d.category)
              return (
                <button key={d.id} onClick={() => { setForm(f => ({ ...f, duaId: d.id })); setSearch('') }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-border)] last:border-0">
                  <span className="text-lg shrink-0">{cat?.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{d.titleBangla}</p>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">{d.meaning}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={isSaving || !SUPABASE_ENABLED}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-500 disabled:opacity-60 transition-colors">
        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />সংরক্ষণ...</> : saved ? '✓ সংরক্ষিত' : <><Save className="h-4 w-4" />সংরক্ষণ করুন</>}
      </button>
    </div>
  )
}
