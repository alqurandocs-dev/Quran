export interface UserProfile {
  id: string
  email: string | null
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface Bookmark {
  id: string
  userId: string
  surahNumber: number
  ayahNumber: number
  surahName: string
  ayahText: string
  note?: string
  createdAt: string
}

export interface Note {
  id: string
  userId: string
  surahNumber: number
  ayahNumber: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface Favorite {
  id: string
  userId: string
  surahNumber: number
  ayahNumber: number
  createdAt: string
}

export interface ReadingProgress {
  id: string
  userId: string
  surahNumber: number
  ayahNumber: number
  surahName: string
  updatedAt: string
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  arabicFontSize: 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
  translationLanguage: 'bangla' | 'english'
  banglaTranslation: 'bn.muhiuddinkhan' | 'bn.zakaria' | 'bn.zohurul'
  showTransliteration: boolean
  showTafsir: boolean
  preferredQari: string
  updatedAt: string
}
