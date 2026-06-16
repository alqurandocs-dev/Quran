/**
 * Prayer time calculation utilities.
 * All input times are "HH:MM" 24h strings from the Aladhan API.
 */

export interface ParsedTime {
  hours: number
  minutes: number
  totalMinutes: number
}

export interface PrayerEntry {
  key: string
  nameBn: string
  time: string        // "HH:MM" 24h
  time12: string      // "HH:MM AM/PM"
  totalMinutes: number
}

export interface SpecialPrayerTimes {
  tahajjudStart: string   // time12
  tahajjudEnd: string     // time12 (= Fajr)
  ishraq: string
  chasht: string
  zawal: string
  awwabin: string
}

export interface ForbiddenWindow {
  label: string
  from: string     // time12
  to: string       // time12
}

export interface NextPrayerInfo {
  key: string
  nameBn: string
  time12: string
  secondsRemaining: number
}

// ── Parsing ────────────────────────────────────────────────────────────────────

export function parseTime(hhmm: string): ParsedTime {
  const [h, m] = hhmm.replace(' (UTC)', '').split(':').map(Number)
  return { hours: h, minutes: m, totalMinutes: h * 60 + m }
}

export function to12h(hhmm: string): string {
  const { hours, minutes } = parseTime(hhmm)
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  const mm = String(minutes).padStart(2, '0')
  return `${String(h).padStart(2, '0')}:${mm} ${period}`
}

export function addMinutes(hhmm: string, mins: number): string {
  const { totalMinutes } = parseTime(hhmm)
  const result = (totalMinutes + mins + 1440) % 1440
  const h = Math.floor(result / 60)
  const m = result % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function minutesBetween(from: string, to: string): number {
  const a = parseTime(from).totalMinutes
  const b = parseTime(to).totalMinutes
  return b >= a ? b - a : b + 1440 - a
}

// Returns total seconds until a given "HH:MM" time today (or tomorrow if past)
export function secondsUntil(hhmm: string): number {
  const now = new Date()
  const { hours, minutes } = parseTime(hhmm)
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  let diff = (target.getTime() - now.getTime()) / 1000
  if (diff < 0) diff += 86400
  return Math.floor(diff)
}

export function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')} ঘণ্টা ${String(m).padStart(2, '0')} মিনিট ${String(s).padStart(2, '0')} সেকেন্ড`
  if (m > 0) return `${String(m).padStart(2, '0')} মিনিট ${String(s).padStart(2, '0')} সেকেন্ড`
  return `${String(s).padStart(2, '0')} সেকেন্ড`
}

export function formatCountdownShort(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Main prayer entries ────────────────────────────────────────────────────────

export const FIVE_PRAYERS: Array<{ key: string; nameBn: string }> = [
  { key: 'Fajr',    nameBn: 'ফজর'    },
  { key: 'Dhuhr',   nameBn: 'যোহর'   },
  { key: 'Asr',     nameBn: 'আসর'    },
  { key: 'Maghrib', nameBn: 'মাগরিব' },
  { key: 'Isha',    nameBn: 'ইশা'    },
]

export function buildPrayerEntries(
  timings: Record<string, string>
): PrayerEntry[] {
  return FIVE_PRAYERS.map(({ key, nameBn }) => {
    const time = timings[key] ?? '00:00'
    return {
      key,
      nameBn,
      time,
      time12: to12h(time),
      totalMinutes: parseTime(time).totalMinutes,
    }
  })
}

// ── Current / next prayer ───────────────────────────────────────────────────

export function getCurrentAndNextPrayer(
  entries: PrayerEntry[]
): { current: PrayerEntry | null; next: PrayerEntry } {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()

  // Find current prayer (the last one whose time has passed)
  let current: PrayerEntry | null = null
  let next: PrayerEntry = entries[0]

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].totalMinutes <= nowMins) {
      current = entries[i]
    }
    if (entries[i].totalMinutes > nowMins) {
      next = entries[i]
      break
    }
    // If we've gone through all prayers, next is Fajr (tomorrow)
    if (i === entries.length - 1) {
      next = entries[0]
    }
  }

  return { current, next }
}

// ── Special prayer times ────────────────────────────────────────────────────

export function buildSpecialTimes(
  timings: Record<string, string>
): SpecialPrayerTimes {
  const sunrise  = timings['Sunrise'] ?? '06:00'
  const dhuhr    = timings['Dhuhr']   ?? '12:00'
  const maghrib  = timings['Maghrib'] ?? '18:00'
  const fajr     = timings['Fajr']    ?? '05:00'
  const lastThird = timings['Lastthird'] ?? addMinutes(fajr, -90)

  // Ishraq: 15 min after sunrise
  const ishraq = addMinutes(sunrise, 15)

  // Chasht: midpoint between Ishraq and Zawal
  const ishraqMins = parseTime(ishraq).totalMinutes
  const dhuhrMins  = parseTime(dhuhr).totalMinutes
  const chashtMins = Math.round((ishraqMins + dhuhrMins) / 2)
  const chasht = `${String(Math.floor(chashtMins / 60)).padStart(2, '0')}:${String(chashtMins % 60).padStart(2, '0')}`

  // Zawal: 5 min before Dhuhr
  const zawal = addMinutes(dhuhr, -5)

  // Awwabin: 20 min after Maghrib (sunset prayer)
  const awwabin = addMinutes(maghrib, 20)

  return {
    tahajjudStart: to12h(lastThird),
    tahajjudEnd:   to12h(fajr),
    ishraq:        to12h(ishraq),
    chasht:        to12h(chasht),
    zawal:         to12h(zawal),
    awwabin:       to12h(awwabin),
  }
}

// ── Forbidden prayer times ──────────────────────────────────────────────────

export function buildForbiddenWindows(
  timings: Record<string, string>
): ForbiddenWindow[] {
  const sunrise = timings['Sunrise'] ?? '06:00'
  const dhuhr   = timings['Dhuhr']   ?? '12:00'
  const sunset  = timings['Sunset']  ?? '18:00'

  return [
    {
      label: 'সূর্যোদয়কালীন',
      from:  to12h(sunrise),
      to:    to12h(addMinutes(sunrise, 14)),
    },
    {
      label: 'দ্বিপ্রহর (যাওয়াল)',
      from:  to12h(addMinutes(dhuhr, -5)),
      to:    to12h(dhuhr),
    },
    {
      label: 'সূর্যাস্তকালীন',
      from:  to12h(addMinutes(sunset, -14)),
      to:    to12h(sunset),
    },
  ]
}

// ── Tahajjud seconds remaining ─────────────────────────────────────────────

export function tahajjudSecondsRemaining(fajrHHMM: string): number {
  return secondsUntil(fajrHHMM)
}

// ── Date key for cache invalidation ───────────────────────────────────────

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
