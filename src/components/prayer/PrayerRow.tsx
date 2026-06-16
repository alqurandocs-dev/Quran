import { cn } from '@/lib/utils'
import { type PrayerEntry } from '@/lib/prayerCalculations'
import { NotificationToggle } from './NotificationToggle'
import type { NotificationPrefs } from '@/stores/prayerStore'

const PRAYER_ICONS: Record<string, string> = {
  Fajr:    '🌙',
  Dhuhr:   '☀️',
  Asr:     '🌤️',
  Maghrib: '🌅',
  Isha:    '🌃',
}

interface Props {
  entry: PrayerEntry
  isActive: boolean
  isNext: boolean
}

export function PrayerRow({ entry, isActive, isNext }: Props) {
  return (
    <div
      className={cn('flex items-center justify-between rounded-xl px-4 py-3 transition-all')}
      style={isActive
        ? { background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)' }
        : isNext
        ? { background: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.1)' }
        : { border: '1px solid transparent' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-base"
          style={isActive
            ? { background: 'rgba(20,184,166,0.15)' }
            : { background: '#1F2937', border: '1px solid rgba(255,255,255,0.08)' }}>
          {PRAYER_ICONS[entry.key]}
        </div>
        <div>
          <p className="font-semibold text-sm"
            style={{ color: isActive ? '#14B8A6' : '#F9FAFB' }}>
            {entry.nameBn}
          </p>
          {isActive && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#14B8A6' }} />
              <span className="text-xs" style={{ color: '#14B8A6' }}>চলছে</span>
            </div>
          )}
          {isNext && !isActive && (
            <p className="text-xs" style={{ color: '#94A3B8' }}>পরবর্তী</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="font-mono font-semibold tabular-nums"
          style={{ color: isActive ? '#14B8A6' : '#F9FAFB' }}>
          {entry.time12}
        </p>
        <NotificationToggle prayerKey={entry.key as keyof NotificationPrefs} />
      </div>
    </div>
  )
}
