import { Clock } from 'lucide-react'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'
import { type PrayerEntry } from '@/lib/prayerCalculations'
import { cn } from '@/lib/utils'

interface Props {
  next: PrayerEntry
  current: PrayerEntry | null
}

export function NextPrayerCard({ next, current }: Props) {
  const countdown = usePrayerCountdown(next?.time)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 via-green-800 to-green-950 p-5 text-white shadow-xl shadow-green-900/30">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Clock className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-medium text-green-200">পরবর্তী নামাজ</p>
          </div>
          {current && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
              <span className="text-xs font-medium text-green-200">
                {current.nameBn} চলছে
              </span>
            </div>
          )}
        </div>

        {/* Prayer name + time */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">{next?.nameBn ?? '—'}</h2>
            <p className="mt-1 text-xl font-semibold text-green-200 font-mono">
              {next?.time12 ?? '——'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-300 mb-1">বাকি সময়</p>
            <p className={cn(
              'font-mono text-2xl font-bold tabular-nums',
              countdown.seconds < 300 ? 'text-red-300' : 'text-white'
            )}>
              {countdown.short}
            </p>
          </div>
        </div>

        {/* Countdown bar */}
        <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-300 to-white transition-all duration-1000"
            style={{ width: `${Math.max(2, 100 - (countdown.seconds / 86400) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-green-300 text-center">{countdown.formatted}</p>
      </div>
    </div>
  )
}
