import { useState } from 'react'
import { MapPin, Navigation, Loader2, ChevronDown } from 'lucide-react'

import { BD_CITIES } from '@/services/prayerApi'
import { usePrayerStore } from '@/stores/prayerStore'
import { useLocationDetection } from '@/hooks/useLocationDetection'
import { cn } from '@/lib/utils'

export function LocationSelector() {
  const { location } = usePrayerStore()
  const { detectGPS, selectCity, detecting, error } = useLocationDetection()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:border-green-500/40 transition-colors"
      >
        <MapPin className="h-3.5 w-3.5 text-green-500" />
        <span className="font-medium max-w-[120px] truncate">{location.cityName}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl overflow-hidden">
            {/* GPS option */}
            <button
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-border)]"
              onClick={async () => { await detectGPS(); setOpen(false) }}
              disabled={detecting}
            >
              {detecting ? (
                <Loader2 className="h-4 w-4 animate-spin text-green-500" />
              ) : (
                <Navigation className="h-4 w-4 text-green-500" />
              )}
              <span className="font-medium text-green-600 dark:text-green-400">
                {detecting ? 'অবস্থান নির্ধারণ...' : 'স্বয়ংক্রিয় (GPS)'}
              </span>
            </button>

            {/* City list */}
            <div className="max-h-56 overflow-y-auto">
              {BD_CITIES.map((city, i) => (
                <button
                  key={city.en}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--color-surface)] transition-colors',
                    !location.useGPS && location.cityIndex === i && 'text-green-600 dark:text-green-400 bg-green-500/5'
                  )}
                  onClick={() => { selectCity(i); setOpen(false) }}
                >
                  <span>{city.name}</span>
                  {!location.useGPS && location.cityIndex === i && (
                    <span className="text-xs text-green-500">✓</span>
                  )}
                </button>
              ))}
            </div>

            {error && (
              <p className="border-t border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
