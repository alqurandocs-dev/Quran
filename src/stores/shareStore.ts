import { create } from 'zustand'
import type { ImageFormat } from '@/components/share/themes'

export interface ShareAyahData {
  surahNumber: number
  ayahNumber: number
  surahNameBn: string
  surahNameAr: string
  arabicText: string
  transliteration?: string
  translation?: string
}

interface ShareStore {
  isOpen: boolean
  ayahData: ShareAyahData | null

  // Customization
  selectedTheme: string
  showTranslation: boolean
  showTransliteration: boolean
  showWatermark: boolean
  showLogo: boolean
  imageFormat: ImageFormat
  arabicFontSize: number
  translationFontSize: number

  // Actions
  openShare: (ayah: ShareAyahData) => void
  closeShare: () => void
  setTheme: (id: string) => void
  setImageFormat: (f: ImageFormat) => void
  setArabicFontSize: (n: number) => void
  setTranslationFontSize: (n: number) => void
  toggleTranslation: () => void
  toggleTransliteration: () => void
  toggleWatermark: () => void
  toggleLogo: () => void
}

export const useShareStore = create<ShareStore>((set) => ({
  isOpen: false,
  ayahData: null,
  selectedTheme: 'green',
  showTranslation: true,
  showTransliteration: true,
  showWatermark: true,
  showLogo: true,
  imageFormat: 'square',
  arabicFontSize: 38,
  translationFontSize: 18,

  openShare: (ayahData) => set({ isOpen: true, ayahData }),
  closeShare: () => set({ isOpen: false }),
  setTheme: (selectedTheme) => set({ selectedTheme }),
  setImageFormat: (imageFormat) => set({ imageFormat }),
  setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
  setTranslationFontSize: (translationFontSize) => set({ translationFontSize }),
  toggleTranslation: () => set((s) => ({ showTranslation: !s.showTranslation })),
  toggleTransliteration: () => set((s) => ({ showTransliteration: !s.showTransliteration })),
  toggleWatermark: () => set((s) => ({ showWatermark: !s.showWatermark })),
  toggleLogo: () => set((s) => ({ showLogo: !s.showLogo })),
}))
