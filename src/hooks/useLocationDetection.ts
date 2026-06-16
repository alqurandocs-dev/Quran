import { useState, useCallback } from 'react'
import { usePrayerStore } from '@/stores/prayerStore'
import { BD_CITIES } from '@/services/prayerApi'

interface LocationResult {
  lat: number
  lon: number
  cityName: string
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=bn`,
      { headers: { 'Accept-Language': 'bn,en' } }
    )
    const data = await res.json()
    const addr = data.address
    // Try to get Bengali city name from response
    const city =
      addr?.city || addr?.town || addr?.village || addr?.county || addr?.state_district || addr?.state || ''
    return city || 'অজানা স্থান'
  } catch {
    return 'অজানা স্থান'
  }
}

export function useLocationDetection() {
  const { setLocation } = usePrayerStore()
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detectGPS = useCallback(async (): Promise<LocationResult | null> => {
    if (!navigator.geolocation) {
      setError('GPS সমর্থিত নয়')
      return null
    }

    setDetecting(true)
    setError(null)

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          const cityName = await reverseGeocode(lat, lon)

          setLocation({
            useGPS: true,
            lat,
            lon,
            cityName,
            lastUpdated: new Date().toISOString(),
          })
          setDetecting(false)
          resolve({ lat, lon, cityName })
        },
        (err) => {
          const msg =
            err.code === 1
              ? 'অনুমতি প্রত্যাখ্যাত। ম্যানুয়ালি শহর নির্বাচন করুন।'
              : 'অবস্থান নির্ধারণে ব্যর্থ'
          setError(msg)
          setDetecting(false)
          resolve(null)
        },
        { timeout: 10000, maximumAge: 1000 * 60 * 60 * 24 }  // cache 24h
      )
    })
  }, [setLocation])

  const selectCity = useCallback(
    (idx: number) => {
      const city = BD_CITIES[idx]
      setLocation({
        useGPS: false,
        lat: city.lat,
        lon: city.lon,
        cityName: city.name,
        cityIndex: idx,
        lastUpdated: new Date().toISOString(),
      })
      setError(null)
    },
    [setLocation]
  )

  return { detectGPS, selectCity, detecting, error }
}
