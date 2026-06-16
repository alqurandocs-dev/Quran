import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'
import { DUAS, type Dua } from '@/data/duas'

// ── Types ──────────────────────────────────────────────────────────────────────

export type DuaFormData = Omit<Dua, 'id'> & { id?: string }

// ── Supabase helpers ───────────────────────────────────────────────────────────

async function fetchDuasFromDB(): Promise<Dua[]> {
  const { data, error } = await supabase
    .from('duas')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(row => ({
    id:              row.id,
    category:        row.category,
    titleBangla:     row.title_bangla,
    arabic:          row.arabic,
    transliteration: row.transliteration,
    meaning:         row.meaning,
    reference:       row.reference,
    authenticity:    row.authenticity ?? undefined,
  }))
}

async function upsertDuaToDB(dua: DuaFormData): Promise<void> {
  const id = dua.id ?? `dua_${Date.now()}`
  const { error } = await supabase.from('duas').upsert({
    id,
    category:        dua.category,
    title_bangla:    dua.titleBangla,
    arabic:          dua.arabic,
    transliteration: dua.transliteration,
    meaning:         dua.meaning,
    reference:       dua.reference,
    authenticity:    dua.authenticity ?? null,
  })
  if (error) throw error
}

async function deleteDuaFromDB(id: string): Promise<void> {
  const { error } = await supabase.from('duas').delete().eq('id', id)
  if (error) throw error
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useAdminDuas() {
  const qc = useQueryClient()

  const query = useQuery<Dua[]>({
    queryKey: ['admin-duas'],
    queryFn: SUPABASE_ENABLED ? fetchDuasFromDB : async () => DUAS,
    staleTime: 0,
  })

  const saveMutation = useMutation({
    mutationFn: async (dua: DuaFormData) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      await upsertDuaToDB(dua)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-duas'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      await deleteDuaFromDB(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-duas'] }),
  })

  return {
    duas:        query.data ?? [],
    isLoading:   query.isLoading,
    isDbEnabled: SUPABASE_ENABLED,
    save:        saveMutation.mutateAsync,
    remove:      deleteMutation.mutateAsync,
    isSaving:    saveMutation.isPending,
    isDeleting:  deleteMutation.isPending,
    saveError:   saveMutation.error,
    deleteError: deleteMutation.error,
  }
}
