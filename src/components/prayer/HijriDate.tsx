interface HijriDateProps {
  hijri: {
    day: string
    month: { ar: string; en: string; number: number }
    year: string
    weekday?: { ar: string }
  }
}

const HIJRI_MONTHS_BN: Record<number, string> = {
  1:  'মুহাররম',  2: 'সফর',     3: 'রবিউল আউয়াল', 4: 'রবিউস সানি',
  5:  'জুমাদাল উলা', 6: 'জুমাদাল আখিরাহ', 7: 'রজব', 8: 'শাবান',
  9:  'রমজান',    10: 'শাওয়াল', 11: 'জিলকদ',       12: 'জিলহজ',
}

export function HijriDate({ hijri }: HijriDateProps) {
  const monthBn = HIJRI_MONTHS_BN[hijri.month.number] ?? hijri.month.en
  return (
    <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
      {hijri.day} {monthBn} {hijri.year} হি.
    </p>
  )
}
