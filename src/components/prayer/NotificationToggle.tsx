import { Bell, BellOff } from 'lucide-react'
import { usePrayerStore, type NotificationPrefs } from '@/stores/prayerStore'

interface Props {
  prayerKey: keyof NotificationPrefs
}

export function NotificationToggle({ prayerKey }: Props) {
  const { notifEnabled, toggleNotif } = usePrayerStore()
  const enabled = notifEnabled[prayerKey]

  return (
    <button
      onClick={() => toggleNotif(prayerKey)}
      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
      style={enabled
        ? { background: 'rgba(20,184,166,0.12)', color: '#14B8A6' }
        : { color: 'var(--color-text-muted)' }}
      aria-label={enabled ? 'নোটিফিকেশন বন্ধ করুন' : 'নোটিফিকেশন চালু করুন'}
    >
      {enabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
    </button>
  )
}
