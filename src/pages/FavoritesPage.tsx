import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ChevronRight, Trash2 } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatBanglaNumber } from '@/lib/utils'

export function FavoritesPage() {
  const { favorites, removeFavorite, isLoading } = useFavorites()
  const { user } = useAuthStore()
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<{ surahNumber: number; ayahNumber: number } | null>(null)

  const filtered = favorites.filter((f) => {
    if (!query) return true
    const q = query.toLowerCase()
    return f.surahName.toLowerCase().includes(q) || f.ayahText?.includes(q)
  })

  const handleRemove = (surahNumber: number, ayahNumber: number) => {
    removeFavorite({ surahNumber, ayahNumber })
    setConfirmDelete(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            প্রিয় আয়াত
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {formatBanglaNumber(favorites.length)} টি আয়াত সংরক্ষিত
          </p>
        </div>
        {!user && (
          <Link to="/auth">
            <Button size="sm" variant="outline">লগইন করুন</Button>
          </Link>
        )}
      </div>

      {!user && (
        <Card className="mb-5 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-center py-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            লগইন করলে আপনার প্রিয় আয়াত সব ডিভাইসে সিনক হবে।
          </p>
          <Link to="/auth" className="mt-2 inline-block text-sm text-[#14B8A6] hover:underline">
            লগইন / রেজিস্ট্রেশন →
          </Link>
        </Card>
      )}

      {/* Search */}
      {favorites.length > 0 && (
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="সূরার নাম বা আরবি দিয়ে খুঁজুন..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[rgba(20,184,166,0.4)]"
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-[var(--color-text-muted)]">লোড হচ্ছে...</div>
      )}

      {/* Favorites List */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((fav) => (
            <div key={`${fav.surahNumber}-${fav.ayahNumber}`} className="relative group">
              <Link to={`/quran/${fav.surahNumber}#ayah-${fav.ayahNumber}`}>
                <Card hover className="pr-12">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-[#14B8A6] bg-[rgba(20,184,166,0.1)] px-2 py-0.5 rounded-full">
                          {fav.surahName}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          আয়াত {formatBanglaNumber(fav.ayahNumber)}
                        </span>
                      </div>
                      {fav.ayahText && (
                        <p
                          className="font-arabic text-right text-lg leading-loose text-[var(--color-text)] mb-1"
                          dir="rtl"
                          lang="ar"
                        >
                          {fav.ayahText.length > 120 ? fav.ayahText.slice(0, 120) + '...' : fav.ayahText}
                        </p>
                      )}
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(fav.createdAt).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setConfirmDelete({ surahNumber: fav.surahNumber, ayahNumber: fav.ayahNumber })
                }}
                className="absolute right-3 top-3 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="মুছুন"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && favorites.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] mb-2 font-medium">কোনো প্রিয় আয়াত নেই</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            কুরআন পড়তে পড়তে হৃদয়ের আয়াতে ♥ চাপ দিন
          </p>
          <Link to="/quran">
            <Button>কুরআন পড়ুন</Button>
          </Link>
        </div>
      )}

      {!isLoading && filtered.length === 0 && favorites.length > 0 && (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          কোনো ফলাফল পাওয়া যায়নি
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-[var(--color-text)] mb-2">প্রিয় তালিকা থেকে সরাবেন?</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              এই আয়াতটি আপনার প্রিয় তালিকা থেকে মুছে ফেলা হবে।
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
                বাতিল
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => handleRemove(confirmDelete.surahNumber, confirmDelete.ayahNumber)}
              >
                মুছুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
