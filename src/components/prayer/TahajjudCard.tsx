import { Moon, Sunrise } from 'lucide-react'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'
import { type SpecialPrayerTimes } from '@/lib/prayerCalculations'

interface Props {
  special: SpecialPrayerTimes
  fajrHHMM: string
}

const OPTIONAL_ROWS = [
  { key: 'ishraq',   label: 'ইশরাক',        icon: '🌅', desc: 'সূর্যোদয়ের ১৫ মিনিট পর' },
  { key: 'chasht',   label: 'চাশত (দুহা)',  icon: '☀️', desc: 'সূর্য চতুর্থাংশে উঠলে' },
  { key: 'zawal',    label: 'যাওয়াল শুরু',  icon: '🌞', desc: 'যোহরের ৫ মিনিট আগে' },
  { key: 'awwabin',  label: 'আওয়াবীন',      icon: '🌆', desc: 'মাগরিবের ২০ মিনিট পর' },
] as const

export function TahajjudCard({ special, fajrHHMM }: Props) {
  const countdown = usePrayerCountdown(fajrHHMM)

  return (
    <div className="space-y-3">
      {/* Tahajjud */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-2.5">
          <Moon className="h-4 w-4 text-indigo-400" />
          <p className="text-sm font-semibold text-indigo-400">তাহাজ্জুদ</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">শুরু</p>
              <p className="font-mono font-semibold text-[var(--color-text)]">{special.tahajjudStart}</p>
            </div>
            <div className="h-6 w-px bg-[var(--color-border)]" />
            <div className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">শেষ (ফজর)</p>
              <p className="font-mono font-semibold text-[var(--color-text)]">{special.tahajjudEnd}</p>
            </div>
            <div className="h-6 w-px bg-[var(--color-border)]" />
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-muted)]">ফজর পর্যন্ত</p>
              <p className="font-mono text-sm font-bold text-indigo-400 tabular-nums">{countdown.short}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">রাতের শেষ তৃতীয়াংশ থেকে ফজর পর্যন্ত</p>
        </div>
      </div>

      {/* Optional prayers */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.06)] border-b border-amber-500/20 px-4 py-2.5">
          <Sunrise className="h-4 w-4 text-[#94A3B8]" />
          <p className="text-sm font-semibold text-[#94A3B8]">নফল নামাজের সময়</p>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {OPTIONAL_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{row.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{row.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{row.desc}</p>
                </div>
              </div>
              <p className="font-mono text-sm font-semibold text-[#94A3B8] tabular-nums">
                {special[row.key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
