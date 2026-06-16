import { Link } from 'react-router-dom'
import { Bookmark, Trash2, ChevronRight } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatBanglaNumber } from '@/lib/utils'

export function BookmarksPage() {
  const { user } = useAuthStore()
  const { bookmarks, removeBookmark, isLoading } = useBookmarks()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Bookmark className="h-16 w-16 text-[var(--color-text-muted)] mb-4" />
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">লগইন প্রয়োজন</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          বুকমার্ক সংরক্ষণ করতে লগইন করুন
        </p>
        <Link to="/auth">
          <Button>লগইন / সাইনআপ</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">বুকমার্ক</h1>
        <span className="text-sm text-[var(--color-text-muted)]">
          {formatBanglaNumber(bookmarks.length)}টি সংরক্ষিত
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔖</p>
          <p className="font-semibold text-[var(--color-text)] mb-1">কোনো বুকমার্ক নেই</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            কুরআন পড়ার সময় আয়াতে বুকমার্ক আইকনে ক্লিক করুন
          </p>
          <Link to="/quran">
            <Button>কুরআন পড়ুন</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <Card key={bm.id} className="group">
              <div className="flex items-start gap-3">
                <Link to={`/quran/${bm.surahNumber}#ayah-${bm.ayahNumber}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-600/10 px-2 py-0.5 rounded-full">
                      {bm.surahName}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      আয়াত {formatBanglaNumber(bm.ayahNumber)}
                    </span>
                  </div>
                  {bm.ayahText && (
                    <p className="font-arabic text-base text-right text-[var(--color-text)] dark:text-amber-100 leading-loose truncate" dir="rtl">
                      {bm.ayahText.slice(0, 80)}...
                    </p>
                  )}
                  {bm.note && (
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 italic">
                      📝 {bm.note}
                    </p>
                  )}
                </Link>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/quran/${bm.surahNumber}#ayah-${bm.ayahNumber}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                    onClick={() => removeBookmark({ surahNumber: bm.surahNumber, ayahNumber: bm.ayahNumber })}
                    aria-label="বুকমার্ক মুছুন"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
