import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReadingPosition } from '@/types'

interface ReadingStore {
  lastRead: ReadingPosition | null
  recentSurahs: number[]
  setLastRead: (pos: ReadingPosition) => void
  addRecentSurah: (surahNumber: number) => void
  clearHistory: () => void
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set, get) => ({
      lastRead: null,
      recentSurahs: [],

      setLastRead: (lastRead) => {
        const current = get().lastRead
        // Throttle: only update if surah/ayah changed or 30s passed
        if (
          current &&
          current.surahNumber === lastRead.surahNumber &&
          current.ayahNumber === lastRead.ayahNumber
        ) return
        set({ lastRead })
      },

      addRecentSurah: (surahNumber) => {
        const current = get().recentSurahs.filter((n) => n !== surahNumber)
        set({ recentSurahs: [surahNumber, ...current].slice(0, 10) })
      },

      clearHistory: () => set({ lastRead: null, recentSurahs: [] }),
    }),
    { name: 'quran-reading' }
  )
)
