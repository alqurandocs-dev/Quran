import { useState } from 'react'
import { X, Bell, BellOff, Settings2 } from 'lucide-react'

import { usePrayerStore, type NotificationLead, type NotificationPrefs } from '@/stores/prayerStore'
import { usePrayerNotifications } from '@/hooks/usePrayerNotifications'
import { FIVE_PRAYERS } from '@/lib/prayerCalculations'
import { cn } from '@/lib/utils'

const LEAD_OPTIONS: { value: NotificationLead; label: string }[] = [
  { value: 0,  label: 'নামাজের সময়' },
  { value: 5,  label: '৫ মিনিট আগে' },
  { value: 10, label: '১০ মিনিট আগে' },
  { value: 15, label: '১৫ মিনিট আগে' },
]

interface Props {
  timings: Record<string, string> | undefined
}

export function PrayerSettingsModal({ timings }: Props) {
  const [open, setOpen] = useState(false)
  const { notifEnabled, notifLead, toggleNotif, setNotifLead } = usePrayerStore()
  const { requestPermission } = usePrayerNotifications(timings)

  const handleToggle = async (key: keyof NotificationPrefs) => {
    if (!notifEnabled[key]) {
      const granted = await requestPermission()
      if (!granted) {
        alert('নোটিফিকেশন অনুমতি প্রয়োজন। ব্রাউজার সেটিংস থেকে অনুমতি দিন।')
        return
      }
    }
    toggleNotif(key)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[rgba(20,184,166,0.4)] transition-colors"
        aria-label="নামাজ সেটিংস"
      >
        <Settings2 className="h-4 w-4 text-[var(--color-text-muted)]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--color-text)]">নামাজ সেটিংস</h3>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            {/* Notification per prayer */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                নোটিফিকেশন
              </p>
              <div className="space-y-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
                {FIVE_PRAYERS.map(({ key, nameBn }) => {
                  const k = key as keyof NotificationPrefs
                  const on = notifEnabled[k]
                  return (
                    <div key={key} className="flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {on ? <Bell className="h-3.5 w-3.5 text-[#14B8A6]" /> : <BellOff className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />}
                        <span className="text-sm text-[var(--color-text)]">{nameBn}</span>
                      </div>
                      <button
                        onClick={() => handleToggle(k)}
                        className={cn(
                          'relative h-6 w-11 rounded-full transition-colors',
                          on ? 'bg-[#14B8A6]' : 'bg-[rgba(255,255,255,0.12)]'
                        )}
                      >
                        <span className={cn(
                          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                          on ? 'left-5' : 'left-0.5'
                        )} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lead time */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                কতক্ষণ আগে জানাবে
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LEAD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNotifLead(opt.value)}
                    className="rounded-lg border py-2 text-sm font-medium transition-colors"
                    style={notifLead === opt.value
                      ? { borderColor: 'rgba(20,184,166,0.4)', background: 'rgba(20,184,166,0.1)', color: '#14B8A6' }
                      : { borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
