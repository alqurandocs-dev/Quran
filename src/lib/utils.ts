import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBanglaNumber(num: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d)])
}

export function getAudioUrl(qariId: string, surahNumber: number, ayahNumber?: number): string {
  const paddedSurah = String(surahNumber).padStart(3, '0')
  if (ayahNumber !== undefined) {
    const paddedAyah = String(ayahNumber).padStart(3, '0')
    return `https://cdn.islamic.network/quran/audio/128/${qariId}/${paddedSurah}${paddedAyah}.mp3`
  }
  return `https://cdn.islamic.network/quran/audio/128/${qariId}/${paddedSurah}001.mp3`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
