import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const SUPABASE_ENABLED = !!(supabaseUrl && supabaseAnonKey)

if (!SUPABASE_ENABLED) {
  console.warn('Supabase env vars missing — user features disabled')
}

// Use placeholder URLs when env vars are missing to avoid createClient throwing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: SUPABASE_ENABLED,
      persistSession: SUPABASE_ENABLED,
      detectSessionInUrl: SUPABASE_ENABLED,
    },
  }
)

export { SUPABASE_ENABLED }
