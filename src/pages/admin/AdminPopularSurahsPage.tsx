import { useState, useEffect } from 'react'
import { Loader2, Save, GripVertical, X, Plus } from 'lucide-react'
import { usePopularSurahsSetting } from '@/hooks/useAppSettings'
import { SURAHS } from '@/data'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function AdminPopularSurahsPage() {
  const { surahNums, isLoading, save, isSaving } = usePopularSurahsSetting()
  const [list, setList] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { setList(surahNums) }, [surahNums])

  const add = (n: number) => {
    if (list.includes(n) || list.length >= 12) return
    setList(l => [...l, n])
    setSearch('')
  }

  const remove = (n: number) => setList(l => l.filter(x => x !== n))

  const handleSave = async () => {
    await save(list)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filtered = search.trim()
    ? SURAHS.filter(s =>
        !list.includes(s.number) &&
        (s.banglaName.includes(search) ||
         s.englishName.toLowerCase().includes(search.toLowerCase()) ||
         String(s.number) === search)
      ).slice(0, 8)
    : []

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#14B8A6]" /></div>

  return (
    <div className="space-y-5">
      {!SUPABASE_ENABLED && (
        <div className="rounded-2xl bg-[rgba(255,255,255,0.06)] ring-1 ring-[rgba(255,255,255,0.1)] px-4 py-3 text-sm text-[#94A3B8]">
          Supabase সংযুক্ত নেই — পরিবর্তন সংরক্ষিত হবে না
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] px-1">
        Home page এ "জনপ্রিয় সূরা" সেকশনে কোন সূরাগুলো দেখাবে তা নির্বাচন করুন। সর্বোচ্চ ১২টি।
      </p>

      {/* Selected list */}
      <div className="space-y-2">
        {list.map((n, i) => {
          const surah = SURAHS[n - 1]
          if (!surah) return null
          return (
            <div key={n} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              <GripVertical className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
              <span className="w-6 text-xs font-bold text-[var(--color-text-muted)] tabular-nums">{i + 1}</span>
              <p className="font-arabic text-xl text-[#14B8A6] leading-relaxed">{surah.name}</p>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-text)]">{surah.banglaName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">সূরা {n} · {surah.numberOfAyahs} আয়াত</p>
              </div>
              <button onClick={() => remove(n)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}

        {list.length === 0 && (
          <p className="text-center py-8 text-sm text-[var(--color-text-muted)]">কোনো সূরা নির্বাচিত নেই</p>
        )}
      </div>

      {/* Search to add */}
      {list.length < 12 && (
        <div className="relative">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-border)] px-4 py-3">
            <Plus className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="সূরা নাম বা নম্বর দিয়ে খুঁজুন..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none"
            />
          </div>
          {filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl overflow-hidden">
              {filtered.map(s => (
                <button key={s.number} onClick={() => add(s.number)}
                  className={cn('flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-surface)] transition-colors',
                    list.includes(s.number) && 'opacity-40 cursor-not-allowed')}>
                  <p className="font-arabic text-lg text-[#14B8A6] w-8">{s.name}</p>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{s.banglaName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">সূরা {s.number}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={handleSave} disabled={isSaving || !SUPABASE_ENABLED}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14B8A6] py-2.5 text-sm font-bold text-white hover:bg-[#14B8A6] disabled:opacity-60 transition-colors">
        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />সংরক্ষণ...</> : saved ? '✓ সংরক্ষিত' : <><Save className="h-4 w-4" />সংরক্ষণ করুন</>}
      </button>
    </div>
  )
}
