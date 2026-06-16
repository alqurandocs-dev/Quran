import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DuaFavorite {
  duaId: string
  addedAt: number
}

interface DuaState {
  // Guest favorites (persisted to localStorage)
  guestFavorites: DuaFavorite[]
  // Display settings
  showPronunciation: boolean
  showMeaning: boolean

  // Actions
  addGuestFavorite: (duaId: string) => void
  removeGuestFavorite: (duaId: string) => void
  isGuestFavorite: (duaId: string) => boolean
  toggleShowPronunciation: () => void
  toggleShowMeaning: () => void
}

export const useDuaStore = create<DuaState>()(
  persist(
    (set, get) => ({
      guestFavorites: [],
      showPronunciation: true,
      showMeaning: true,

      addGuestFavorite: (duaId) =>
        set((s) => ({
          guestFavorites: s.guestFavorites.some((f) => f.duaId === duaId)
            ? s.guestFavorites
            : [...s.guestFavorites, { duaId, addedAt: Date.now() }],
        })),

      removeGuestFavorite: (duaId) =>
        set((s) => ({
          guestFavorites: s.guestFavorites.filter((f) => f.duaId !== duaId),
        })),

      isGuestFavorite: (duaId) => get().guestFavorites.some((f) => f.duaId === duaId),

      toggleShowPronunciation: () =>
        set((s) => ({ showPronunciation: !s.showPronunciation })),

      toggleShowMeaning: () =>
        set((s) => ({ showMeaning: !s.showMeaning })),
    }),
    {
      name: 'dua-store',
      partialize: (s) => ({
        guestFavorites: s.guestFavorites,
        showPronunciation: s.showPronunciation,
        showMeaning: s.showMeaning,
      }),
    }
  )
)
