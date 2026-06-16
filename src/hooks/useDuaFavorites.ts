import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDuaStore } from '@/stores/duaStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export function useDuaFavorites() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const {
    guestFavorites,
    addGuestFavorite,
    removeGuestFavorite,
    isGuestFavorite,
  } = useDuaStore()

  // Supabase favorites query (auth users only)
  const { data: supabaseFavs = [] } = useQuery({
    queryKey: ['dua-favorites', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data } = await supabase
        .from('favorite_duas')
        .select('dua_id')
        .eq('user_id', user.id)
      return (data ?? []).map((r: { dua_id: string }) => r.dua_id)
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  })

  const addMutation = useMutation({
    mutationFn: async (duaId: string) => {
      if (!user) return
      await supabase
        .from('favorite_duas')
        .upsert({ user_id: user.id, dua_id: duaId }, { onConflict: 'user_id,dua_id' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dua-favorites', user?.id] }),
  })

  const removeMutation = useMutation({
    mutationFn: async (duaId: string) => {
      if (!user) return
      await supabase
        .from('favorite_duas')
        .delete()
        .eq('user_id', user.id)
        .eq('dua_id', duaId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dua-favorites', user?.id] }),
  })

  const isDuaFavorite = useCallback(
    (duaId: string) => {
      if (user) return supabaseFavs.includes(duaId)
      return isGuestFavorite(duaId)
    },
    [user, supabaseFavs, isGuestFavorite]
  )

  const toggleFavorite = useCallback(
    (duaId: string) => {
      if (user) {
        if (supabaseFavs.includes(duaId)) removeMutation.mutate(duaId)
        else addMutation.mutate(duaId)
      } else {
        if (isGuestFavorite(duaId)) removeGuestFavorite(duaId)
        else addGuestFavorite(duaId)
      }
    },
    [user, supabaseFavs, isGuestFavorite, addGuestFavorite, removeGuestFavorite, addMutation, removeMutation]
  )

  const favoriteDuaIds: string[] = user
    ? supabaseFavs
    : guestFavorites.map((f) => f.duaId)

  return { isDuaFavorite, toggleFavorite, favoriteDuaIds }
}
