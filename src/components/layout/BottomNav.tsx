import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Heart, Settings, AlignJustify } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { path: '/',          label: 'হোম',    icon: Home },
  { path: '/quran',     label: 'কুরআন',  icon: BookOpen },
  { path: '/juz',       label: 'পারা',   icon: AlignJustify },
  { path: '/favorites', label: 'প্রিয়',  icon: Heart },
  { path: '/settings',  label: 'সেটিংস', icon: Settings },
]

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md md:hidden safe-area-pb">
      <div className="grid grid-cols-5">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path))
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
                active ? 'text-green-500' : 'text-[var(--color-text-muted)]'
              )}
            >
              <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
