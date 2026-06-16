import { useEffect, useCallback } from 'react'
import { usePrayerStore } from '@/stores/prayerStore'
import { parseTime, FIVE_PRAYERS } from '@/lib/prayerCalculations'

export function usePrayerNotifications(timings: Record<string, string> | undefined) {
  const { notifEnabled, notifLead } = usePrayerStore()

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  // Schedule notifications for today whenever timings or settings change
  useEffect(() => {
    if (!timings || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const scheduled: ReturnType<typeof setTimeout>[] = []

    for (const { key, nameBn } of FIVE_PRAYERS) {
      if (!notifEnabled[key as keyof typeof notifEnabled]) continue
      const timeStr = timings[key]
      if (!timeStr) continue

      const { hours, minutes } = parseTime(timeStr)
      const now = new Date()
      const target = new Date(now)
      target.setHours(hours, minutes - notifLead, 0, 0)

      const delay = target.getTime() - now.getTime()
      if (delay < 0) continue  // already passed today

      const id = setTimeout(() => {
        new Notification(`🕌 ${nameBn}${notifLead > 0 ? ` (${notifLead} মিনিট পরে)` : ''}`, {
          body: `${nameBn} নামাজের সময় হয়েছে`,
          icon: '/favicon.ico',
          tag: key,
        })
      }, delay)
      scheduled.push(id)
    }

    return () => scheduled.forEach(clearTimeout)
  }, [timings, notifEnabled, notifLead])

  return { requestPermission }
}
