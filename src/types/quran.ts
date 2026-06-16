export interface Surah {
  number: number
  name: string          // Arabic
  englishName: string
  englishNameTranslation: string
  banglaName: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  juz: number[]
}

export interface Ayah {
  number: number        // global ayah number (1-6236)
  numberInSurah: number
  surahNumber: number
  text: string          // Uthmani Arabic
  transliteration?: string
  audio?: string        // audio URL
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean }
}

export interface Translation {
  ayahNumber: number
  text: string
  edition: TranslationEdition
}

export type TranslationEdition =
  | 'bn.muhiuddinkhan'
  | 'bn.zakaria'
  | 'bn.zohurul'
  | 'en.sahih'

export type TranslationLanguage = 'bangla' | 'english'

export interface Juz {
  number: number
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
}

export interface ReadingPosition {
  surahNumber: number
  ayahNumber: number
  surahName: string
  timestamp: number
}

export interface AudioState {
  isPlaying: boolean
  currentSurah: number | null
  currentAyah: number | null
  duration: number
  currentTime: number
  qari: string
}

export interface Qari {
  id: string
  name: string
  style: string
  bitrate: string
  urlPattern: string
}
