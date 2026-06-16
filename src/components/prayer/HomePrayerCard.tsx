import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePrayerData, useCurrentPrayerState } from '@/hooks/usePrayerData'
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown'

const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌃',
}

export function HomePrayerCard() {
  const { entries, timings } = usePrayerData()
  const { current, next } = useCurrentPrayerState(entries)
  const countdown = usePrayerCountdown(next?.time)

  const progressPct = timings
    ? Math.max(4, 100 - (countdown.seconds / 86400) * 100)
    : 10

  return (
    <Link to="/prayer" className="block group">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d4a2e] via-[#0f5c38] to-[#0a3d26] shadow-2xl shadow-green-950/60 ring-1 ring-green-500/20 transition-all group-hover:ring-green-400/40 group-hover:shadow-green-900/70">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-green-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-green-500/8 blur-xl" />

        <div className="relative z-10 p-5">
          {/* Row 1: label + link */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <p className="text-xs font-medium tracking-wide text-green-300/80 uppercase">পরবর্তী নামাজ</p>
            </div>
            <div className="flex items-center gap-1 text-green-400/60 group-hover:text-green-300 transition-colors">
              <span className="text-xs">বিস্তারিত</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Row 2: name + countdown */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-4xl font-black tracking-tight text-white leading-none">
                {next?.nameBn ?? '—'}
              </p>
              <p className="mt-1.5 font-mono text-lg font-semibold text-green-200">
                {next?.time12 ?? '——'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-green-400/60 mb-1 uppercase tracking-wider">বাকি</p>
              <p className="font-mono text-2xl font-bold text-white tabular-nums leading-none">
                {countdown.short}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-300 via-emerald-400 to-white transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* 5 prayers row */}
          <div className="grid grid-cols-5 gap-1">
            {entries.map((e) => {
              const isActive = current?.key === e.key
              const isNext   = next?.key === e.key && !isActive
              const highlight = isActive || isNext
              return (
                <div
                  key={e.key}
                  className={`flex flex-col items-center rounded-xl py-2.5 px-1 transition-colors ${
                    isActive
                      ? 'bg-white/15 ring-1 ring-white/25'
                      : isNext
                      ? 'bg-white/8 ring-1 ring-green-400/30'
                      : 'bg-white/5'
                  }`}
                >
                  <span className="mb-1 text-sm leading-none">{PRAYER_ICONS[e.key]}</span>
                  <p className={`text-[10px] font-semibold mb-0.5 ${highlight ? 'text-green-200' : 'text-green-400/60'}`}>
                    {e.nameBn}
                  </p>
                  <p className={`font-mono text-[11px] font-bold tabular-nums leading-tight ${isActive ? 'text-white' : highlight ? 'text-green-100' : 'text-green-300/70'}`}>
                    {e.time12.replace(' AM', '').replace(' PM', '')}
                  </p>
                  <p className={`text-[9px] mt-0.5 ${highlight ? 'text-green-300/70' : 'text-green-500/40'}`}>
                    {e.time12.slice(-2)}
                  </p>
                  {isActive && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-green-300 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
