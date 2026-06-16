import { Bell, BellOff } from 'lucide-react'
import { usePrayerStore, type NotificationPrefs } from '@/stores/prayerStore'
import { cn } from '@/lib/utils'

interface Props {
  prayerKey: keyof NotificationPrefs
}

export function NotificationToggle({ prayerKey }: Props) {
  const { notifEnabled, toggleNotif } = usePrayerStore()
  const enabled = notifEnabled[prayerKey]

  return (
    <button
      onClick={() => toggleNotif(prayerKey)}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
        enabled
          ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      )}
      aria-label={enabled ? 'নোটিফিকেশন বন্ধ করুন' : 'নোটিফিকেশন চালু করুন'}
    >
      {enabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
    </button>
  )
}
