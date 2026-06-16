import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { AyahShareModal } from '@/components/share/AyahShareModal'
import { useSettingsStore } from '@/stores/settingsStore'
import { useEffect } from 'react'

export function AppLayout() {
  const { theme } = useSettingsStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <AudioPlayer />
      <AyahShareModal />
      <BottomNav />
    </div>
  )
}
