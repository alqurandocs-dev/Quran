import { usePrayerData } from '@/hooks/usePrayerData'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'
import { parseTime, to12h, addMinutes } from '@/lib/prayerCalculations'

function isNightTime(timings: Record<string, string>): boolean {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const ishaMins  = parseTime(timings['Isha']    ?? '20:00').totalMinutes
  const fajrMins  = parseTime(timings['Fajr']    ?? '04:00').totalMinutes
  return nowMins >= ishaMins || nowMins < fajrMins
}

function isTahajjudActive(timings: Record<string, string>): boolean {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const lastThirdMins = parseTime(timings['Lastthird'] ?? '02:00').totalMinutes
  const fajrMins      = parseTime(timings['Fajr']      ?? '04:00').totalMinutes
  if (lastThirdMins < fajrMins) {
    return nowMins >= lastThirdMins && nowMins < fajrMins
  }
  return nowMins >= lastThirdMins || nowMins < fajrMins
}

export function TahajjudMiniCard() {
  const { timings } = usePrayerData()
  const fajrTime  = timings?.['Fajr']      ?? '04:00'
  const lastThird = timings?.['Lastthird'] ?? addMinutes(fajrTime, -90)
  const countdown = usePrayerCountdown(fajrTime)

  if (!timings) return null
  if (!isNightTime(timings)) return null

  const active = isTahajjudActive(timings)

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-4 py-3 flex items-center justify-between gap-3 transition-all"
      style={active
        ? { background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.2)' }
        : { background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-2.5 relative z-10">
        <span className={`text-xl ${active ? 'animate-pulse' : 'opacity-60'}`}>🌙</span>
        <div>
          {active ? (
            <>
              <p className="text-xs font-bold" style={{ color: '#14B8A6' }}>তাহাজ্জুদ চলছে</p>
              <p className="text-[10px]" style={{ color: '#94A3B8' }}>{to12h(lastThird)} – {to12h(fajrTime)}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">তাহাজ্জুদ শুরু হবে</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{to12h(lastThird)} থেকে</p>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 text-right">
        <p className="text-[10px] mb-0.5 text-[var(--color-text-muted)]">ফজর পর্যন্ত</p>
        <p className="font-mono text-sm font-bold tabular-nums"
          style={{ color: active ? '#14B8A6' : '#94A3B8' }}>
          {countdown.short}
        </p>
      </div>
    </div>
  )
}
