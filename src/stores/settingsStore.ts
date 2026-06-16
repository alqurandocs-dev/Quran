import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BanglaTranslation = 'bn.bengali' | 'bn.hoque'
export type TranslationLanguage = 'bangla' | 'english'
export type LineHeight = 'normal' | 'relaxed' | 'loose'
export type PlaybackSpeed = 0.75 | 1 | 1.25 | 1.5

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  arabicFontSize: 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
  lineHeight: LineHeight
  translationLanguage: TranslationLanguage
  banglaTranslation: BanglaTranslation
  showTransliteration: boolean
  showTafsir: boolean
  showAyahNumbers: boolean
  autoSaveProgress: boolean
  resumeAudioPosition: boolean
  preferredQari: string
  playbackSpeed: PlaybackSpeed
  setTheme: (theme: SettingsState['theme']) => void
  setFontSize: (size: SettingsState['fontSize']) => void
  setArabicFontSize: (size: SettingsState['arabicFontSize']) => void
  setLineHeight: (lh: LineHeight) => void
  setTranslationLanguage: (lang: TranslationLanguage) => void
  setBanglaTranslation: (t: BanglaTranslation) => void
  toggleTransliteration: () => void
  toggleTafsir: () => void
  toggleShowAyahNumbers: () => void
  toggleAutoSaveProgress: () => void
  toggleResumeAudioPosition: () => void
  setQari: (qari: string) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'md',
      arabicFontSize: 'xl',
      lineHeight: 'relaxed',
      translationLanguage: 'bangla',
      banglaTranslation: 'bn.bengali',
      showTransliteration: true,
      showTafsir: false,
      showAyahNumbers: true,
      autoSaveProgress: true,
      resumeAudioPosition: false,
      preferredQari: 'ar.alafasy',
      playbackSpeed: 1,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setTranslationLanguage: (translationLanguage) => set({ translationLanguage }),
      setBanglaTranslation: (banglaTranslation) => set({ banglaTranslation }),
      toggleTransliteration: () => set((s) => ({ showTransliteration: !s.showTransliteration })),
      toggleTafsir: () => set((s) => ({ showTafsir: !s.showTafsir })),
      toggleShowAyahNumbers: () => set((s) => ({ showAyahNumbers: !s.showAyahNumbers })),
      toggleAutoSaveProgress: () => set((s) => ({ autoSaveProgress: !s.autoSaveProgress })),
      toggleResumeAudioPosition: () => set((s) => ({ resumeAudioPosition: !s.resumeAudioPosition })),
      setQari: (preferredQari) => set({ preferredQari }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
    }),
    { name: 'quran-settings' }
  )
)
