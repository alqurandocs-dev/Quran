import { WifiOff, RefreshCw } from 'lucide-react'
import { NextPrayerCard } from './NextPrayerCard'
import { PrayerList } from './PrayerList'
import { TahajjudCard } from './TahajjudCard'
import { ForbiddenTimesSection } from './ForbiddenTimesSection'
import { LocationSelector } from './LocationSelector'
import { PrayerSettingsModal } from './PrayerSettingsModal'
import { usePrayerData, useCurrentPrayerState } from '@/hooks/usePrayerData'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { HijriDate } from './HijriDate'

export function PrayerTimesSection() {
  const {
    isLoading,
    isError,
    isOffline,
    timings,
    entries,
    special,
    forbidden,
    hijriDate,
  } = usePrayerData()

  const { current, next } = useCurrentPrayerState(entries)

  if (isLoading && !timings) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <LoadingSpinner size="md" label="নামাজের সময় লোড হচ্ছে..." />
      </div>
    )
  }

  if (isError && !timings) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
        <WifiOff className="h-8 w-8 text-red-400 mx-auto mb-2" />
        <p className="text-sm text-red-400">নেটওয়ার্ক সংযোগ নেই</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          ইন্টারনেট সংযোগ পরীক্ষা করুন
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header row: location + hijri date + settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LocationSelector />
          {isOffline && (
            <div className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5">
              <WifiOff className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400">অফলাইন</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hijriDate && <HijriDate hijri={hijriDate} />}
          <PrayerSettingsModal timings={timings as Record<string, string>} />
        </div>
      </div>

      {isOffline && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 px-3 py-2">
          <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            সর্বশেষ সংরক্ষিত সময়সূচী প্রদর্শন করা হচ্ছে
          </p>
        </div>
      )}

      {/* Next prayer card */}
      {next && <NextPrayerCard next={next} current={current} />}

      {/* Five prayers */}
      {entries.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2 px-1">
            পাঁচ ওয়াক্ত নামাজ
          </p>
          <PrayerList
            entries={entries}
            currentPrayer={current}
            nextPrayer={next}
          />
        </div>
      )}

      {/* Tahajjud + optional prayers */}
      {special && timings && (
        <TahajjudCard
          special={special}
          fajrHHMM={timings['Fajr'] as string ?? '05:00'}
        />
      )}

      {/* Forbidden times */}
      {forbidden.length > 0 && (
        <ForbiddenTimesSection windows={forbidden} />
      )}
    </div>
  )
}
