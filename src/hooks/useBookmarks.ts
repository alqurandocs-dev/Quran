import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Bookmark } from '@/types'

export function useBookmarks() {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Bookmark[]
    },
    enabled: !!user,
  })

  const addMutation = useMutation({
    mutationFn: async (bookmark: Omit<Bookmark, 'id' | 'userId' | 'createdAt'>) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('bookmarks').upsert({
        user_id: user.id,
        surah_number: bookmark.surahNumber,
        ayah_number: bookmark.ayahNumber,
        surah_name: bookmark.surahName,
        ayah_text: bookmark.ayahText,
        note: bookmark.note,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookmarks', user?.id] }),
  })

  const removeMutation = useMutation({
    mutationFn: async ({ surahNumber, ayahNumber }: { surahNumber: number; ayahNumber: number }) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber)
        .eq('ayah_number', ayahNumber)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookmarks', user?.id] }),
  })

  const isBookmarked = (surahNumber: number, ayahNumber: number) =>
    query.data?.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber) ?? false

  return { bookmarks: query.data ?? [], isBookmarked, addBookmark: addMutation.mutate, removeBookmark: removeMutation.mutate, isLoading: query.isLoading }
}
