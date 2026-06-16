import { Ban } from 'lucide-react'
import { type ForbiddenWindow } from '@/lib/prayerCalculations'

interface Props {
  windows: ForbiddenWindow[]
}

export function ForbiddenTimesSection({ windows }: Props) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-red-500/20 bg-red-500/10 px-4 py-2.5">
        <Ban className="h-4 w-4 text-red-400" />
        <p className="text-sm font-semibold text-red-400">নামাজের নিষিদ্ধ সময়</p>
      </div>

      <div className="divide-y divide-red-500/10">
        {windows.map((w, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <span className="text-xs font-bold text-red-500">{i + 1}</span>
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">{w.label}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-red-100/80 dark:bg-red-900/30 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <p className="font-mono text-xs font-semibold text-red-500 tabular-nums">
                {w.from} – {w.to}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-red-500/10 px-4 py-2.5">
        <p className="text-xs text-red-400/80">
          ⚠️ এই সময়গুলোতে নফল নামাজ পড়া নিষিদ্ধ
        </p>
      </div>
    </div>
  )
}
