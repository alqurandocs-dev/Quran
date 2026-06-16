// Aladhan API - Free prayer times API
// https://aladhan.com/prayer-times-api

const BASE_URL = 'https://api.aladhan.com/v1'

export interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
  Imsak: string
  Midnight: string
  Firstthird: string
  Lastthird: string
}

export interface PrayerTimesResponse {
  timings: PrayerTimes
  date: {
    readable: string
    timestamp: string
    hijri: {
      date: string
      format: string
      day: string
      weekday: { en: string; ar: string }
      month: { number: number; en: string; ar: string }
      year: string
      holidays: string[]
    }
    gregorian: {
      date: string
      format: string
      day: string
      weekday: { en: string }
      month: { number: number; en: string }
      year: string
    }
  }
  meta: {
    latitude: number
    longitude: number
    timezone: string
    method: { id: number; name: string }
  }
}

export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date = new Date()
): Promise<PrayerTimesResponse> {
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  // Method 1 = University of Islamic Sciences, Karachi (used in Bangladesh)
  const res = await fetch(
    `${BASE_URL}/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=1&school=1`
  )
  if (!res.ok) throw new Error('Prayer times fetch failed')
  const data = await res.json()
  return data.data as PrayerTimesResponse
}

export async function getPrayerTimesByCity(
  city: string,
  country: string
): Promise<PrayerTimesResponse> {
  const res = await fetch(`${BASE_URL}/timingsByCity?city=${city}&country=${country}&method=1&school=1`)
  if (!res.ok) throw new Error('Prayer times fetch failed')
  const data = await res.json()
  return data.data as PrayerTimesResponse
}

// Bangladesh major cities
export const BD_CITIES = [
  { name: 'ঢাকা', en: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { name: 'চট্টগ্রাম', en: 'Chittagong', lat: 22.3569, lon: 91.7832 },
  { name: 'সিলেট', en: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { name: 'রাজশাহী', en: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
  { name: 'খুলনা', en: 'Khulna', lat: 22.8456, lon: 89.5403 },
  { name: 'বরিশাল', en: 'Barisal', lat: 22.701, lon: 90.3535 },
  { name: 'ময়মনসিংহ', en: 'Mymensingh', lat: 24.7471, lon: 90.4203 },
  { name: 'রংপুর', en: 'Rangpur', lat: 25.7439, lon: 89.2752 },
  { name: 'কুমিল্লা', en: 'Comilla', lat: 23.4607, lon: 91.1809 },
  { name: 'নারায়ণগঞ্জ', en: 'Narayanganj', lat: 23.6238, lon: 90.4991 },
]

export const PRAYER_NAMES_BN: Record<keyof Omit<PrayerTimes, 'Imsak' | 'Midnight' | 'Firstthird' | 'Lastthird'>, string> = {
  Fajr: 'ফজর',
  Sunrise: 'সূর্যোদয়',
  Dhuhr: 'যোহর',
  Asr: 'আসর',
  Sunset: 'সূর্যাস্ত',
  Maghrib: 'মাগরিব',
  Isha: 'ইশা',
}
