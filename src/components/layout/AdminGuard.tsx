import { useAuthStore } from '@/stores/authStore'

const ALLOWED_EMAILS = ['alquran.docs@gmail.com', 'mahbubcontact@gmail.com']

interface Props {
  children: React.ReactNode
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

  // Block everyone who is not in the allowed list — no login form, no message, just 404-like
  if (!user || !ALLOWED_EMAILS.includes(user.email ?? '')) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 select-none">
        <p className="text-6xl font-bold" style={{ color: 'rgba(255,255,255,0.04)' }}>404</p>
        <p className="text-sm" style={{ color: '#475569' }}>পৃষ্ঠাটি পাওয়া যায়নি।</p>
      </div>
    )
  }

  return <>{children}</>
}
