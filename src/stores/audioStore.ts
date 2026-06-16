import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AudioStore {
  isPlaying: boolean
  currentSurah: number | null
  currentAyah: number | null
  totalAyahs: number
  duration: number
  currentTime: number
  qari: string
  lastPosition: { surah: number; ayah: number } | null
  bismillahSurah: { surah: number; totalAyahs: number } | null  // surah to play after bismillah

  setPlaying: (playing: boolean) => void
  setSurah: (surah: number, totalAyahs: number) => void
  setAyah: (ayah: number) => void
  setDuration: (d: number) => void
  setCurrentTime: (t: number) => void
  setQari: (qari: string) => void
  nextAyah: () => void
  prevAyah: () => void
  stop: () => void
  savePosition: () => void
  playSurahWithBismillah: (surahNumber: number, totalAyahs: number) => void
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentSurah: null,
      currentAyah: null,
      totalAyahs: 0,
      duration: 0,
      currentTime: 0,
      qari: 'ar.alafasy',
      lastPosition: null,
      bismillahSurah: null,

      setPlaying: (isPlaying) => set({ isPlaying }),
      setSurah: (surah, totalAyahs) => set({ currentSurah: surah, totalAyahs, currentAyah: 1 }),
      setAyah: (ayah) => set({ currentAyah: ayah, currentTime: 0 }),
      setDuration: (duration) => set({ duration }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setQari: (qari) => set({ qari }),

      nextAyah: () => {
        const { currentAyah, totalAyahs } = get()
        if (currentAyah && currentAyah < totalAyahs) {
          set({ currentAyah: currentAyah + 1, currentTime: 0 })
        }
      },

      prevAyah: () => {
        const { currentAyah } = get()
        if (currentAyah && currentAyah > 1) {
          set({ currentAyah: currentAyah - 1, currentTime: 0 })
        }
      },

      stop: () => set({ isPlaying: false, currentSurah: null, currentAyah: null, bismillahSurah: null }),

      playSurahWithBismillah: (surahNumber, totalAyahs) => {
        if (surahNumber === 1 || surahNumber === 9) {
          set({ currentSurah: surahNumber, totalAyahs, currentAyah: 1, bismillahSurah: null, isPlaying: true })
        } else {
          set({ currentSurah: 1, totalAyahs: 7, currentAyah: 1, bismillahSurah: { surah: surahNumber, totalAyahs }, isPlaying: true })
        }
      },

      savePosition: () => {
        const { currentSurah, currentAyah } = get()
        if (currentSurah && currentAyah) {
          set({ lastPosition: { surah: currentSurah, ayah: currentAyah } })
        }
      },
    }),
    { name: 'quran-audio', partialize: (s) => ({ qari: s.qari, lastPosition: s.lastPosition }) }
  )
)
