import { useState, useEffect } from 'react'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import { useHeroSettings, DEFAULT_HERO, type HeroSettings } from '@/hooks/useAppSettings'
import { SUPABASE_ENABLED } from '@/lib/supabase'

export function AdminHeroPage() {
  const { hero, isLoading, save, isSaving } = useHeroSettings()
  const [form, setForm] = useState<HeroSettings>(DEFAULT_HERO)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(hero) }, [hero])

  const set = (k: keyof HeroSettings, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    await save(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#14B8A6]" /></div>

  return (
    <div className="space-y-5">
      {!SUPABASE_ENABLED && (
        <div className="rounded-2xl bg-[rgba(255,255,255,0.06)] ring-1 ring-[rgba(255,255,255,0.1)] px-4 py-3 text-sm text-[#94A3B8]">
          Supabase সংযুক্ত নেই — পরিবর্তন সংরক্ষিত হবে না
        </div>
      )}

      {/* Preview */}
      <div className="relative overflow-hidden rounded-3xl p-5 border" style={{ background: '#111827', borderColor: 'rgba(20,184,166,0.15)' }}>
        <p className="pointer-events-none absolute right-5 top-3 text-5xl opacity-10">☽</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#14B8A6]/70 mb-2">{form.greeting}</p>
        <p className="font-arabic text-2xl text-[#F8FAFC] leading-loose mb-1">{form.arabicText}</p>
        <p className="text-[#5eead4]/70 text-sm mb-4">{form.translation}</p>
        <div className="flex gap-2">
          <span className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: '#14B8A6', color: '#0B1120' }}>{form.btn1Label}</span>
          <span className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20">{form.btn2Label}</span>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {[
          { key: 'greeting' as const,     label: 'অভিবাদন',          placeholder: 'আস-সালামু আলাইকুম' },
          { key: 'arabicText' as const,   label: 'আরবি টেক্সট',      placeholder: 'بِسْمِ اللَّهِ...',  arabic: true },
          { key: 'translation' as const,  label: 'অনুবাদ',            placeholder: 'পরম করুণাময়...' },
          { key: 'btn1Label' as const,    label: 'বাটন ১ (সবুজ)',     placeholder: 'কুরআন পড়ুন' },
          { key: 'btn2Label' as const,    label: 'বাটন ২ (ঘোলা)',    placeholder: 'দোয়া দেখুন' },
        ].map(({ key, label, placeholder, arabic }) => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{label}</label>
            <input
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
              dir={arabic ? 'rtl' : undefined}
              className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)] ${arabic ? 'font-arabic text-xl text-[#94A3B8] text-right' : 'text-[var(--color-text)]'}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setForm(DEFAULT_HERO)}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] transition-colors">
          <RotateCcw className="h-3.5 w-3.5" /> রিসেট
        </button>
        <button onClick={handleSave} disabled={isSaving || !SUPABASE_ENABLED}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14B8A6] py-2.5 text-sm font-bold text-white hover:bg-[#14B8A6] disabled:opacity-60 transition-colors">
          {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />সংরক্ষণ...</> : saved ? '✓ সংরক্ষিত' : <><Save className="h-4 w-4" />সংরক্ষণ করুন</>}
        </button>
      </div>
    </div>
  )
}
