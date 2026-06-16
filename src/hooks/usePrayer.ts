import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getPrayerTimes, BD_CITIES } from '@/services/prayerApi'

export function usePrayerTimes() {
  const [cityIndex, setCityIndex] = useState(() => {
    const saved = localStorage.getItem('prayer-city')
    return saved ? parseInt(saved) : 0
  })

  const city = BD_CITIES[cityIndex]

  const query = useQuery({
    queryKey: ['prayer', city.en],
    queryFn: () => getPrayerTimes(city.lat, city.lon),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 12,
  })

  const setCity = (index: number) => {
    setCityIndex(index)
    localStorage.setItem('prayer-city', String(index))
  }

  return { ...query, city, cityIndex, setCity, cities: BD_CITIES }
}

export function useNextPrayer(timings: Partial<Record<string, string>> | undefined) {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; nameBn: string; time: string; remaining: string } | null>(null)

  useEffect(() => {
    if (!timings) return

    const prayerNames: [string, string][] = [
      ['Fajr', 'ফজর'],
      ['Dhuhr', 'যোহর'],
      ['Asr', 'আসর'],
      ['Maghrib', 'মাগরিব'],
      ['Isha', 'ইশা'],
    ]

    const update = () => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      for (const [name, nameBn] of prayerNames) {
        const timeStr = timings[name]
        if (!timeStr) continue
        const [h, m] = timeStr.split(':').map(Number)
        const prayerMinutes = h * 60 + m
        if (prayerMinutes > currentMinutes) {
          const diff = prayerMinutes - currentMinutes
          const hours = Math.floor(diff / 60)
          const mins = diff % 60
          const remaining = hours > 0 ? `${hours} ঘণ্টা ${mins} মিনিট` : `${mins} মিনিট`
          setNextPrayer({ name, nameBn, time: timeStr, remaining })
          return
        }
      }
      // After Isha, next is Fajr tomorrow
      const [h, m] = (timings['Fajr'] || '05:00').split(':').map(Number)
      const prayerMinutes = h * 60 + m + 24 * 60
      const diff = prayerMinutes - currentMinutes
      const hours = Math.floor(diff / 60)
      const mins = diff % 60
      setNextPrayer({ name: 'Fajr', nameBn: 'ফজর', time: timings['Fajr'] ?? '05:00', remaining: `${hours} ঘণ্টা ${mins} মিনিট` })
    }

    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [timings])

  return nextPrayer
}
