import { useEffect, useRef } from 'react'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useReadingStore } from '@/stores/readingStore'
import type { ReadingPosition } from '@/types'

// Syncs reading progress between localStorage and Supabase
export function useReadingSync() {
  const { user } = useAuthStore()
  const { lastRead, setLastRead } = useReadingStore()
  const prevUserIdRef = useRef<string | null>(null)

  // On login: fetch Supabase progress and merge (keep most recent)
  useEffect(() => {
    if (!SUPABASE_ENABLED || !user) return
    if (prevUserIdRef.current === user.id) return
    prevUserIdRef.current = user.id

    supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (!data) {
          // No remote progress — if local exists, push it up
          if (lastRead) {
            pushProgressToSupabase(user.id, lastRead)
          }
          return
        }
        const remoteTs = new Date(data.updated_at).getTime()
        const localTs = lastRead?.timestamp ?? 0
        if (remoteTs > localTs) {
          setLastRead({
            surahNumber: data.surah_number,
            ayahNumber: data.ayah_number,
            surahName: data.surah_name,
            timestamp: remoteTs,
          })
        } else if (localTs > remoteTs && lastRead) {
          pushProgressToSupabase(user.id, lastRead)
        }
      })
  }, [user, lastRead, setLastRead])

  // On logout: clear prevUserIdRef
  useEffect(() => {
    if (!user) {
      prevUserIdRef.current = null
    }
  }, [user])
}

export async function pushProgressToSupabase(userId: string, pos: ReadingPosition) {
  if (!SUPABASE_ENABLED) return
  await supabase.from('reading_progress').upsert({
    user_id: userId,
    surah_number: pos.surahNumber,
    ayah_number: pos.ayahNumber,
    surah_name: pos.surahName,
    updated_at: new Date(pos.timestamp).toISOString(),
  })
}
