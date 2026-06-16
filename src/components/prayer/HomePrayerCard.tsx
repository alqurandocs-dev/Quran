import { Link } from 'react-router-dom'
import { MapPin, ChevronRight, Info } from 'lucide-react'
import { usePrayerData, useCurrentPrayerState } from '@/hooks/usePrayerData'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'

const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌃',
}

export function HomePrayerCard() {
  const { entries, timings, hijriDate, cityName } = usePrayerData()
  const { current, next } = useCurrentPrayerState(entries)

  // Countdown to END of current prayer (= next prayer start)
  const currentEndTime = next?.time
  const countdown = usePrayerCountdown(currentEndTime)

  // Build time ranges: each prayer ends when next one starts
  const getEndTime = (idx: number): string => {
    if (idx + 1 < entries.length) return entries[idx + 1].time12
    // Isha ends at Fajr (next day) — just show Fajr time
    return entries[0]?.time12 ?? ''
  }

  // Fajr ends at sunrise
  const sunrise = timings?.['Sunrise']
  const getFajrEnd = (): string => {
    if (!sunrise) return entries[1]?.time12 ?? ''
    const [h, m] = sunrise.replace(' (UTC)', '').split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hr = h % 12 || 12
    return `${String(hr).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
  }

  const hijriText = hijriDate
    ? `${hijriDate.day} ${hijriDate.month?.en ?? ''}, ${hijriDate.year} হিজরি`
    : null

  const todayStr = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: '#0F172A', borderColor: '#1E293B' }}>

      {/* Hijri date chip */}
      {hijriText && (
        <div className="flex justify-center pt-4 pb-2">
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: '#334155', color: '#94A3B8', background: '#1E293B' }}>
            {hijriText}
            <Info className="h-3 w-3 opacity-50" />
          </div>
        </div>
      )}

      {/* Current prayer info */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#10B981' }}>চলমান নামাজ</p>
            <p className="text-3xl font-bold leading-none mb-2" style={{ color: '#F8FAFC' }}>
              {current?.nameBn ?? next?.nameBn ?? '—'}
            </p>
            {/* Location */}
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1 w-fit"
              style={{ background: '#1E293B', border: '1px solid #334155' }}>
              <MapPin className="h-3 w-3" style={{ color: '#10B981' }} />
              <span className="text-xs" style={{ color: '#CBD5E1' }}>{cityName}</span>
            </div>
          </div>

          {/* Countdown box */}
          <div className="rounded-xl px-4 py-3 text-right flex-shrink-0"
            style={{ background: '#166534' }}>
            <p className="text-xs mb-1" style={{ color: '#86efac' }}>সময় বাকি</p>
            <p className="font-mono text-xl font-bold leading-none" style={{ color: '#FFFFFF' }}>
              {countdown.short}
            </p>
            <p className="text-[10px] mt-1" style={{ color: '#86efac' }}>
              {current?.nameBn ?? next?.nameBn} শেষ হতে
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1E293B' }} />

      {/* Prayer rows */}
      <div className="px-3 py-2">
        {entries.map((e, idx) => {
          const isActive = current?.key === e.key
          const endTime = e.key === 'Fajr' ? getFajrEnd() : getEndTime(idx)

          return (
            <div
              key={e.key}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 mb-1 transition-colors"
              style={isActive
                ? { background: '#14532d', border: '1px solid #166534' }
                : { background: 'transparent', border: '1px solid transparent' }
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base w-5 text-center">{PRAYER_ICONS[e.key]}</span>
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : ''}`}
                  style={{ color: isActive ? '#F8FAFC' : '#CBD5E1' }}>
                  {e.nameBn}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums"
                  style={{ color: isActive ? '#86efac' : '#94A3B8' }}>
                  {e.time12.replace(' AM','').replace(' PM','')} - {endTime.replace(' AM','').replace(' PM','')}
                </span>
                {isActive && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: '#10B981', color: '#fff' }}>
                    চলছে
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1E293B' }}
        className="flex items-center justify-between px-4 py-3">
        <p className="text-xs" style={{ color: '#64748B' }}>{todayStr}</p>
        <Link to="/prayer"
          className="flex items-center gap-0.5 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: '#10B981' }}>
          পূর্ণ সময়সূচি
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
