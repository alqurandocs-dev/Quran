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
      className={cn(
        'flex items-center justify-between rounded-xl px-4 py-3 transition-all',
        isActive
          ? 'border border-green-500/40 bg-green-500/10 shadow-sm shadow-green-500/10'
          : isNext
          ? 'border border-green-500/20 bg-green-500/5'
          : 'border border-transparent'
      )}
    >
      {/* Left: icon + name */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full text-base',
          isActive
            ? 'bg-green-100 dark:bg-green-900/40'
            : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
        )}>
          {PRAYER_ICONS[entry.key]}
        </div>
        <div>
          <p className={cn(
            'font-semibold text-sm',
            isActive ? 'text-green-600 dark:text-green-400' : 'text-[var(--color-text)]'
          )}>
            {entry.nameBn}
          </p>
          {isActive && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-green-500">চলছে</span>
            </div>
          )}
          {isNext && !isActive && (
            <p className="text-xs text-green-500">পরবর্তী</p>
          )}
        </div>
      </div>

      {/* Right: time + notification */}
      <div className="flex items-center gap-3">
        <p className={cn(
          'font-mono font-semibold tabular-nums',
          isActive ? 'text-green-600 dark:text-green-400' : 'text-[var(--color-text)]'
        )}>
          {entry.time12}
        </p>
        <NotificationToggle prayerKey={entry.key as keyof NotificationPrefs} />
      </div>
    </div>
  )
}
