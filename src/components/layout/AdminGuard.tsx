import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'

const ALLOWED_EMAILS = ['alquran.docs@gmail.com', 'mahbubcontact@gmail.com']

interface Props {
  children: React.ReactNode
}

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-2xl mb-3"
            style={{ background: '#14B8A6', color: '#0B1120' }}>
            N
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">Nooraya Admin</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">অনুমোদিত অ্যাকাউন্ট দিয়ে লগইন করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ইমেইল"
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড"
              required
              minLength={6}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-10 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPw
                ? <EyeOff className="h-4 w-4 text-[var(--color-text-muted)]" />
                : <Eye className="h-4 w-4 text-[var(--color-text-muted)]" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'অপেক্ষা করুন...' : 'লগইন'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export function AdminGuard({ children }: Props) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[rgba(255,255,255,0.1)] border-t-[#14B8A6]" />
      </div>
    )
  }

  // Not logged in → show admin login form
  if (!user) {
    return <AdminLoginForm />
  }

  // Logged in but not an allowed admin → fake 404
  if (!ALLOWED_EMAILS.includes(user.email ?? '')) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 select-none">
        <p className="text-6xl font-bold" style={{ color: 'rgba(255,255,255,0.04)' }}>404</p>
        <p className="text-sm" style={{ color: '#475569' }}>পৃষ্ঠাটি পাওয়া যায়নি।</p>
      </div>
    )
  }

  return <>{children}</>
}
