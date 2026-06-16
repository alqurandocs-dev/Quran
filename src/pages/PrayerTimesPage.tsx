import { PrayerTimesSection } from '@/components/prayer/PrayerTimesSection'

export function PrayerTimesPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[var(--color-text)]">নামাজের সময়সূচী</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          আপনার অবস্থান অনুযায়ী স্বয়ংক্রিয়ভাবে আপডেট হয়
        </p>
      </div>
      <PrayerTimesSection />
    </div>
  )
}
