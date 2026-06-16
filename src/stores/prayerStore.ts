import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationLead = 0 | 5 | 10 | 15

export interface NotificationPrefs {
  Fajr: boolean
  Dhuhr: boolean
  Asr: boolean
  Maghrib: boolean
  Isha: boolean
}

export interface LocationState {
  useGPS: boolean
  lat: number | null
  lon: number | null
  cityName: string
  cityIndex: number
  lastUpdated: string | null  // ISO date string
}

interface PrayerStoreState {
  location: LocationState
  notifEnabled: NotificationPrefs
  notifLead: NotificationLead
  cachedTimings: Record<string, string> | null
  cachedDate: string | null   // "YYYY-M-D"
  isOffline: boolean

  setLocation: (loc: Partial<LocationState>) => void
  setCityIndex: (idx: number) => void
  setUseGPS: (val: boolean) => void
  toggleNotif: (prayer: keyof NotificationPrefs) => void
  setNotifLead: (lead: NotificationLead) => void
  cacheTimings: (timings: Record<string, string>, date: string) => void
  setOffline: (val: boolean) => void
}

export const usePrayerStore = create<PrayerStoreState>()(
  persist(
    (set) => ({
      location: {
        useGPS: true,
        lat: null,
        lon: null,
        cityName: 'ঢাকা',
        cityIndex: 0,
        lastUpdated: null,
      },
      notifEnabled: {
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false,
      },
      notifLead: 5,
      cachedTimings: null,
      cachedDate: null,
      isOffline: false,

      setLocation: (loc) =>
        set((s) => ({ location: { ...s.location, ...loc } })),

      setCityIndex: (idx) =>
        set((s) => ({ location: { ...s.location, cityIndex: idx } })),

      setUseGPS: (val) =>
        set((s) => ({ location: { ...s.location, useGPS: val } })),

      toggleNotif: (prayer) =>
        set((s) => ({
          notifEnabled: {
            ...s.notifEnabled,
            [prayer]: !s.notifEnabled[prayer],
          },
        })),

      setNotifLead: (lead) => set({ notifLead: lead }),

      cacheTimings: (timings, date) =>
        set({ cachedTimings: timings, cachedDate: date }),

      setOffline: (val) => set({ isOffline: val }),
    }),
    { name: 'prayer-store' }
  )
)
