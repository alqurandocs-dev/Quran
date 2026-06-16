import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'

export interface FeaturedItem {
  id: string
  type: 'surah' | 'dua' | 'juz'
  refId: string
  title: string
  subtitle?: string
  badge?: string
  isActive: boolean
  sortOrder: number
}

export type FeaturedFormData = Omit<FeaturedItem, 'id'> & { id?: string }

function fromRow(r: Record<string, unknown>): FeaturedItem {
  return {
    id:        r.id as string,
    type:      r.type as FeaturedItem['type'],
    refId:     r.ref_id as string,
    title:     r.title as string,
    subtitle:  (r.subtitle as string) ?? undefined,
    badge:     (r.badge as string) ?? undefined,
    isActive:  r.is_active as boolean,
    sortOrder: r.sort_order as number,
  }
}

async function fetchAll(): Promise<FeaturedItem[]> {
  const { data, error } = await supabase
    .from('featured_content')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

async function fetchActive(): Promise<FeaturedItem[]> {
  const { data, error } = await supabase
    .from('featured_content')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

export function useAdminFeatured() {
  const qc = useQueryClient()

  const query = useQuery<FeaturedItem[]>({
    queryKey: ['admin-featured'],
    queryFn: SUPABASE_ENABLED ? fetchAll : async () => [],
    staleTime: 0,
  })

  const saveMutation = useMutation({
    mutationFn: async (item: FeaturedFormData) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const id = item.id ?? crypto.randomUUID()
      const { error } = await supabase.from('featured_content').upsert({
        id,
        type:       item.type,
        ref_id:     item.refId,
        title:      item.title,
        subtitle:   item.subtitle ?? null,
        badge:      item.badge ?? null,
        is_active:  item.isActive,
        sort_order: item.sortOrder,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-featured'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const { error } = await supabase.from('featured_content').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-featured'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const { error } = await supabase.from('featured_content').update({ is_active: isActive }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-featured'] }),
  })

  return {
    items:       query.data ?? [],
    isLoading:   query.isLoading,
    isDbEnabled: SUPABASE_ENABLED,
    save:        saveMutation.mutateAsync,
    remove:      deleteMutation.mutateAsync,
    toggle:      toggleMutation.mutateAsync,
    isSaving:    saveMutation.isPending,
  }
}

export function useActiveFeatured() {
  return useQuery<FeaturedItem[]>({
    queryKey: ['active-featured'],
    queryFn: SUPABASE_ENABLED ? fetchActive : async () => [],
    staleTime: 5 * 60 * 1000,
    enabled: SUPABASE_ENABLED,
  })
}
