import { usePrayerData } from '@/hooks/usePrayerData'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'
import { parseTime, to12h, addMinutes } from '@/lib/prayerCalculations'

function isNightTime(timings: Record<string, string>): boolean {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const ishaMins  = parseTime(timings['Isha']    ?? '20:00').totalMinutes
  const fajrMins  = parseTime(timings['Fajr']    ?? '04:00').totalMinutes
  // Night = after Isha OR before Fajr
  return nowMins >= ishaMins || nowMins < fajrMins
}

function isTahajjudActive(timings: Record<string, string>): boolean {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const lastThirdMins = parseTime(timings['Lastthird'] ?? '02:00').totalMinutes
  const fajrMins      = parseTime(timings['Fajr']      ?? '04:00').totalMinutes
  // Active if after last-third AND before fajr (handles midnight crossing)
  if (lastThirdMins < fajrMins) {
    return nowMins >= lastThirdMins && nowMins < fajrMins
  }
  return nowMins >= lastThirdMins || nowMins < fajrMins
}

export function TahajjudMiniCard() {
  const { timings } = usePrayerData()
  const fajrTime      = timings?.['Fajr']      ?? '04:00'
  const lastThird     = timings?.['Lastthird'] ?? addMinutes(fajrTime, -90)
  const countdown     = usePrayerCountdown(fajrTime)

  if (!timings) return null
  if (!isNightTime(timings)) return null

  const active = isTahajjudActive(timings)

  return (
    <div className={`relative overflow-hidden rounded-2xl px-4 py-3 flex items-center justify-between gap-3 ring-1 transition-all ${
      active
        ? 'bg-gradient-to-r from-indigo-950/80 to-violet-950/60 ring-indigo-400/30 shadow-lg shadow-indigo-950/40'
        : 'bg-[var(--color-surface)] ring-[var(--color-border)]'
    }`}>
      {/* Glow when active */}
      {active && (
        <div className="pointer-events-none absolute -top-6 left-1/3 h-16 w-32 rounded-full bg-indigo-400/15 blur-2xl" />
      )}

      <div className="flex items-center gap-2.5 relative z-10">
        <span className={`text-xl ${active ? 'animate-pulse' : 'opacity-60'}`}>🌙</span>
        <div>
          {active ? (
            <>
              <p className="text-xs font-bold text-indigo-300">তাহাজ্জুদ চলছে</p>
              <p className="text-[10px] text-indigo-400/70">{to12h(lastThird)} – {to12h(fajrTime)}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">তাহাজ্জুদ শুরু হবে</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{to12h(lastThird)} থেকে</p>
            </>
          )}
        </div>
      </div>

      {/* Countdown to Fajr */}
      <div className="relative z-10 text-right">
        <p className={`text-[10px] mb-0.5 ${active ? 'text-indigo-400/70' : 'text-[var(--color-text-muted)]'}`}>
          ফজর পর্যন্ত
        </p>
        <p className={`font-mono text-sm font-bold tabular-nums ${active ? 'text-indigo-200' : 'text-[var(--color-text-muted)]'}`}>
          {countdown.short}
        </p>
      </div>
    </div>
  )
}
