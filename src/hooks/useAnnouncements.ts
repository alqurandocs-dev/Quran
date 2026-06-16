import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'

export interface Announcement {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'ramadan'
  icon?: string
  linkText?: string
  linkUrl?: string
  isActive: boolean
  startsAt: string
  endsAt?: string
}

export type AnnouncementFormData = Omit<Announcement, 'id'> & { id?: string }

function toRow(a: AnnouncementFormData) {
  return {
    id:         a.id,
    message:    a.message,
    type:       a.type,
    icon:       a.icon ?? null,
    link_text:  a.linkText ?? null,
    link_url:   a.linkUrl ?? null,
    is_active:  a.isActive,
    starts_at:  a.startsAt,
    ends_at:    a.endsAt ?? null,
  }
}

function fromRow(r: Record<string, unknown>): Announcement {
  return {
    id:        r.id as string,
    message:   r.message as string,
    type:      r.type as Announcement['type'],
    icon:      (r.icon as string) ?? undefined,
    linkText:  (r.link_text as string) ?? undefined,
    linkUrl:   (r.link_url as string) ?? undefined,
    isActive:  r.is_active as boolean,
    startsAt:  r.starts_at as string,
    endsAt:    (r.ends_at as string) ?? undefined,
  }
}

async function fetchAll(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

async function fetchActive(): Promise<Announcement[]> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .lte('starts_at', now)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

// ── Admin hook (all announcements) ────────────────────────────

export function useAdminAnnouncements() {
  const qc = useQueryClient()

  const query = useQuery<Announcement[]>({
    queryKey: ['admin-announcements'],
    queryFn: SUPABASE_ENABLED ? fetchAll : async () => [],
    staleTime: 0,
  })

  const saveMutation = useMutation({
    mutationFn: async (a: AnnouncementFormData) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const row = toRow(a)
      const id = row.id ?? crypto.randomUUID()
      const { error } = await supabase.from('announcements').upsert({ ...row, id })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!SUPABASE_ENABLED) throw new Error('Supabase not configured')
      const { error } = await supabase.from('announcements').update({ is_active: isActive }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  return {
    announcements: query.data ?? [],
    isLoading:     query.isLoading,
    isDbEnabled:   SUPABASE_ENABLED,
    save:          saveMutation.mutateAsync,
    remove:        deleteMutation.mutateAsync,
    toggle:        toggleMutation.mutateAsync,
    isSaving:      saveMutation.isPending,
  }
}

// ── Public hook (active only, for home page) ──────────────────

export function useActiveAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ['active-announcements'],
    queryFn: SUPABASE_ENABLED ? fetchActive : async () => [],
    staleTime: 5 * 60 * 1000,
    enabled: SUPABASE_ENABLED,
  })
}
