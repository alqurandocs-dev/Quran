import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

interface GuestFavorite {
  id: string
  surahNumber: number
  ayahNumber: number
  surahName: string
  ayahText: string
  createdAt: string
}

interface GuestFavoritesStore {
  favorites: GuestFavorite[]
  add: (fav: Omit<GuestFavorite, 'id' | 'createdAt'>) => void
  remove: (surahNumber: number, ayahNumber: number) => void
}

export const useGuestFavoritesStore = create<GuestFavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      add: (fav) => {
        const exists = get().favorites.some(
          (f) => f.surahNumber === fav.surahNumber && f.ayahNumber === fav.ayahNumber
        )
        if (!exists) {
          set((s) => ({
            favorites: [
              { ...fav, id: `${fav.surahNumber}-${fav.ayahNumber}`, createdAt: new Date().toISOString() },
              ...s.favorites,
            ],
          }))
        }
      },
      remove: (surahNumber, ayahNumber) =>
        set((s) => ({
          favorites: s.favorites.filter(
            (f) => !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
          ),
        })),
    }),
    { name: 'quran-guest-favorites' }
  )
)

export function useFavorites() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const guestStore = useGuestFavoritesStore()

  const supabaseQuery = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Array<{
        id: string
        user_id: string
        surah_number: number
        ayah_number: number
        surah_name: string
        ayah_text: string
        created_at: string
      }>
    },
    enabled: !!user,
  })

  const addMutation = useMutation({
    mutationFn: async (fav: { surahNumber: number; ayahNumber: number; surahName: string; ayahText: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('favorites').upsert({
        user_id: user.id,
        surah_number: fav.surahNumber,
        ayah_number: fav.ayahNumber,
        surah_name: fav.surahName,
        ayah_text: fav.ayahText,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', user?.id] }),
  })

  const removeMutation = useMutation({
    mutationFn: async ({ surahNumber, ayahNumber }: { surahNumber: number; ayahNumber: number }) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber)
        .eq('ayah_number', ayahNumber)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', user?.id] }),
  })

  if (user) {
    const favorites = (supabaseQuery.data ?? []).map((f) => ({
      id: f.id,
      surahNumber: f.surah_number,
      ayahNumber: f.ayah_number,
      surahName: f.surah_name,
      ayahText: f.ayah_text,
      createdAt: f.created_at,
    }))

    return {
      favorites,
      isLoading: supabaseQuery.isLoading,
      isFavorite: (s: number, a: number) => favorites.some((f) => f.surahNumber === s && f.ayahNumber === a),
      addFavorite: (fav: { surahNumber: number; ayahNumber: number; surahName: string; ayahText: string }) =>
        addMutation.mutate(fav),
      removeFavorite: ({ surahNumber, ayahNumber }: { surahNumber: number; ayahNumber: number }) =>
        removeMutation.mutate({ surahNumber, ayahNumber }),
    }
  }

  return {
    favorites: guestStore.favorites,
    isLoading: false,
    isFavorite: (s: number, a: number) =>
      guestStore.favorites.some((f) => f.surahNumber === s && f.ayahNumber === a),
    addFavorite: (fav: { surahNumber: number; ayahNumber: number; surahName: string; ayahText: string }) =>
      guestStore.add(fav),
    removeFavorite: ({ surahNumber, ayahNumber }: { surahNumber: number; ayahNumber: number }) =>
      guestStore.remove(surahNumber, ayahNumber),
  }
}
