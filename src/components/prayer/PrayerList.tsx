import { type PrayerEntry } from '@/lib/prayerCalculations'
import { PrayerRow } from './PrayerRow'

interface Props {
  entries: PrayerEntry[]
  currentPrayer: PrayerEntry | null
  nextPrayer: PrayerEntry | null
}

export function PrayerList({ entries, currentPrayer, nextPrayer }: Props) {
  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <PrayerRow
          key={entry.key}
          entry={entry}
          isActive={currentPrayer?.key === entry.key}
          isNext={nextPrayer?.key === entry.key && currentPrayer?.key !== entry.key}
        />
      ))}
    </div>
  )
}
