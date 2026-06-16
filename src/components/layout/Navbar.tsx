import { Link, useLocation } from 'react-router-dom'
import { Search, Home, BookOpen, Bookmark, Settings, Moon, Sun, Menu, X, Mic2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settingsStore'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { path: '/', label: 'হোম', icon: Home },
  { path: '/quran', label: 'কুরআন', icon: BookOpen },
  { path: '/dua', label: 'দুআ', icon: Mic2 },
  { path: '/bookmarks', label: 'বুকমার্ক', icon: Bookmark },
  { path: '/settings', label: 'সেটিংস', icon: Settings },
]

export function Navbar() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useSettingsStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDark = theme === 'dark'

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-base" style={{ background: '#14B8A6', color: '#0B1120' }}>
              N
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none tracking-tight" style={{ color: '#14B8A6' }}>Nooraya</p>
              <p className="text-xs text-[var(--color-text-muted)]">Bangla Quran App</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === path
                    ? 'bg-[rgba(20,184,166,0.12)] text-[#14B8A6]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/search">
              <Button variant="ghost" size="icon" aria-label="অনুসন্ধান">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="থিম পরিবর্তন"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="মেনু"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors',
                    pathname === path
                      ? 'bg-[rgba(20,184,166,0.12)] text-[#14B8A6]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
