import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useReadingSync } from '@/hooks/useReadingProgress'

const HomePage       = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const QuranPage      = lazy(() => import('@/pages/QuranPage').then((m) => ({ default: m.QuranPage })))
const SurahPage      = lazy(() => import('@/pages/SurahPage').then((m) => ({ default: m.SurahPage })))
const SearchPage     = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const DuaPage        = lazy(() => import('@/pages/DuaPage').then((m) => ({ default: m.DuaPage })))
const DailyDuaPage   = lazy(() => import('@/pages/DailyDuaPage').then((m) => ({ default: m.DailyDuaPage })))
const DuaDetailsPage = lazy(() => import('@/pages/DuaDetailsPage').then((m) => ({ default: m.DuaDetailsPage })))
const BookmarksPage  = lazy(() => import('@/pages/BookmarksPage').then((m) => ({ default: m.BookmarksPage })))
const SettingsPage   = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const AuthPage       = lazy(() => import('@/pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const JuzListPage    = lazy(() => import('@/pages/JuzListPage').then((m) => ({ default: m.JuzListPage })))
const JuzPage        = lazy(() => import('@/pages/JuzPage').then((m) => ({ default: m.JuzPage })))
const FavoritesPage  = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })))
const PrayerTimesPage = lazy(() => import('@/pages/PrayerTimesPage').then((m) => ({ default: m.PrayerTimesPage })))
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false } },
})

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [setSession, setLoading])

  return <>{children}</>
}

// Mounts reading progress sync (Supabase ↔ localStorage)
function ReadingSyncProvider() {
  useReadingSync()
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReadingSyncProvider />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/"             element={<HomePage />} />
                <Route path="/quran"        element={<QuranPage />} />
                <Route path="/quran/:surahId" element={<SurahPage />} />
                <Route path="/juz"          element={<JuzListPage />} />
                <Route path="/juz/:id"      element={<JuzPage />} />
                <Route path="/search"       element={<SearchPage />} />
                <Route path="/dua"          element={<DuaPage />} />
                <Route path="/dua/:id"      element={<DuaDetailsPage />} />
                <Route path="/daily-dua"    element={<DailyDuaPage />} />
                <Route path="/bookmarks"    element={<BookmarksPage />} />
                <Route path="/favorites"    element={<FavoritesPage />} />
                <Route path="/prayer"       element={<PrayerTimesPage />} />
                <Route path="/settings"     element={<SettingsPage />} />
                <Route path="/auth"         element={<AuthPage />} />
                <Route path="/admin"        element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
