import { useState, useEffect } from 'react'
import { secondsUntil, formatCountdown, formatCountdownShort } from '@/lib/prayerCalculations'

interface CountdownResult {
  seconds: number
  formatted: string      // "XX ঘণ্টা XX মিনিট XX সেকেন্ড"
  short: string          // "HH:MM:SS"
}

export function usePrayerCountdown(targetHHMM: string | undefined): CountdownResult {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!targetHHMM) return

    const tick = () => setSeconds(secondsUntil(targetHHMM))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetHHMM])

  return {
    seconds,
    formatted: formatCountdown(seconds),
    short: formatCountdownShort(seconds),
  }
}
