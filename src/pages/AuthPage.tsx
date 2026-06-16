import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'

export function AuthPage() {
  const { user } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'কিছু একটা সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14B8A6] text-[#0B1120] font-bold text-3xl mb-3">
            N
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Nooraya</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">লগইন করুন</p>
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
              {showPw ? <EyeOff className="h-4 w-4 text-[var(--color-text-muted)]" /> : <Eye className="h-4 w-4 text-[var(--color-text-muted)]" />}
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
