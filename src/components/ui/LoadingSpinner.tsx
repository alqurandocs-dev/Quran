import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className, label = 'লোড হচ্ছে...' }: Props) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn('animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[#14B8A6]', sizes[size])}
        role="status"
        aria-label={label}
      />
      {size !== 'sm' && <p className="text-sm text-[var(--color-text-muted)]">{label}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" label="কুরআন লোড হচ্ছে..." />
    </div>
  )
}
