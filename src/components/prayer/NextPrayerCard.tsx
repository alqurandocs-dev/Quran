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
    <div className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{ background: '#111827', border: '1px solid rgba(20,184,166,0.2)' }}>
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full"
        style={{ background: 'rgba(20,184,166,0.05)' }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'rgba(20,184,166,0.15)' }}>
              <Clock className="h-3.5 w-3.5" style={{ color: '#14B8A6' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>পরবর্তী নামাজ</p>
          </div>
          {current && (
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(20,184,166,0.1)' }}>
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#14B8A6' }} />
              <span className="text-xs font-medium" style={{ color: '#5eead4' }}>
                {current.nameBn} চলছে
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: '#F9FAFB' }}>
              {next?.nameBn ?? '—'}
            </h2>
            <p className="mt-1 text-xl font-semibold font-mono" style={{ color: '#5eead4' }}>
              {next?.time12 ?? '——'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>বাকি সময়</p>
            <p className={cn('font-mono text-2xl font-bold tabular-nums',
              countdown.seconds < 300 ? 'text-red-400' : '')}
              style={countdown.seconds >= 300 ? { color: '#F9FAFB' } : {}}>
              {countdown.short}
            </p>
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(2, 100 - (countdown.seconds / 86400) * 100)}%`,
              background: '#14B8A6',
            }}
          />
        </div>
        <p className="mt-2 text-xs text-center" style={{ color: '#94A3B8' }}>{countdown.formatted}</p>
      </div>
    </div>
  )
}
