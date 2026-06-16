/**
 * Main prayer data hook — replaces the old usePrayerTimes from usePrayer.ts.
 * Fetches from Aladhan based on current location, caches for offline use,
 * and auto-refetches when the date changes.
 */
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { usePrayerStore } from '@/stores/prayerStore'
import { getPrayerTimes } from '@/services/prayerApi'
import { BD_CITIES } from '@/services/prayerApi'
import {
  buildPrayerEntries,
  buildSpecialTimes,
  buildForbiddenWindows,
  getCurrentAndNextPrayer,
  secondsUntil,
  todayKey,
  type PrayerEntry,
  type SpecialPrayerTimes,
  type ForbiddenWindow,
} from '@/lib/prayerCalculations'
import type { PrayerTimesResponse } from '@/services/prayerApi'

function todayDateStr(): string {
  const d = new Date()
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

export function usePrayerData() {
  const { location, cacheTimings, cachedTimings, cachedDate, setOffline } = usePrayerStore()

  const lat = location.lat ?? BD_CITIES[location.cityIndex].lat
  const lon = location.lon ?? BD_CITIES[location.cityIndex].lon

  const query = useQuery<PrayerTimesResponse>({
    queryKey: ['prayer-data', lat.toFixed(4), lon.toFixed(4), todayDateStr()],
    queryFn: async () => {
      const data = await getPrayerTimes(lat, lon)
      setOffline(false)
      return data
    },
    staleTime: 1000 * 60 * 60 * 12,   // 12h
    gcTime:    1000 * 60 * 60 * 24,   // 24h cache
    retry: 2,
  })

  // Cache for offline use
  useEffect(() => {
    if (query.data) {
      cacheTimings(query.data.timings as unknown as Record<string, string>, todayKey())
    }
  }, [query.data, cacheTimings])

  // Detect offline
  useEffect(() => {
    if (query.isError) setOffline(true)
  }, [query.isError, setOffline])

  // Use cached data when offline
  const isCachedDay = cachedDate === todayKey()
  const timings: Record<string, string> | undefined =
    (query.data?.timings as unknown as Record<string, string>) ??
    (isCachedDay ? cachedTimings ?? undefined : undefined)

  const entries: PrayerEntry[]            = timings ? buildPrayerEntries(timings) : []
  const { current, next }                 = entries.length ? getCurrentAndNextPrayer(entries) : { current: null, next: entries[0] ?? null }
  const special: SpecialPrayerTimes | null = timings ? buildSpecialTimes(timings) : null
  const forbidden: ForbiddenWindow[]      = timings ? buildForbiddenWindows(timings) : []

  const hijriDate = query.data?.date?.hijri
  const gregorianDate = query.data?.date?.gregorian

  return {
    isLoading:  query.isLoading,
    isError:    query.isError,
    isOffline:  query.isError && !!cachedTimings,
    timings,
    entries,
    currentPrayer: current,
    nextPrayer:    next,
    special,
    forbidden,
    hijriDate,
    gregorianDate,
    cityName: location.cityName,
  }
}

// ── Tracks current/next prayer, switching exactly when a prayer time hits ──────
export function useCurrentPrayerState(entries: PrayerEntry[]) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!entries.length) return

    const state = getCurrentAndNextPrayer(entries)
    if (!state.next) return

    // Schedule next tick to fire the moment the next prayer starts (+1s buffer)
    const secsUntilSwitch = secondsUntil(state.next.time)
    const switchTimeout = setTimeout(
      () => setNow(Date.now()),
      (secsUntilSwitch + 1) * 1000
    )

    // Fallback: also tick every 30 s in case of clock drift / DST edge cases
    const fallback = setInterval(() => setNow(Date.now()), 30_000)

    return () => {
      clearTimeout(switchTimeout)
      clearInterval(fallback)
    }
  }, [entries, now])  // re-schedule after every switch

  return getCurrentAndNextPrayer(entries)
}
