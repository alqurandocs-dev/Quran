export interface ShareTheme {
  id: string
  name: string
  background: string
  arabicColor: string
  translitColor: string
  translationColor: string
  metaColor: string
  decorColor: string
  watermarkColor: string
  border?: string
  patternOpacity: number
}

export const SHARE_THEMES: ShareTheme[] = [
  {
    id: 'green',
    name: 'ক্লাসিক সবুজ',
    background: 'linear-gradient(145deg, #064e3b 0%, #065f46 40%, #047857 100%)',
    arabicColor: '#fbbf24',
    translitColor: '#a7f3d0',
    translationColor: '#ecfdf5',
    metaColor: '#6ee7b7',
    decorColor: '#059669',
    watermarkColor: '#34d399',
    border: '2px solid #059669',
    patternOpacity: 0.07,
  },
  {
    id: 'dark',
    name: 'ডার্ক নাইট',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    arabicColor: '#fbbf24',
    translitColor: '#7dd3fc',
    translationColor: '#e2e8f0',
    metaColor: '#64748b',
    decorColor: '#334155',
    watermarkColor: '#475569',
    border: '2px solid #1e40af',
    patternOpacity: 0.06,
  },
  {
    id: 'white',
    name: 'ইলেগ্যান্ট সাদা',
    background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)',
    arabicColor: '#064e3b',
    translitColor: '#047857',
    translationColor: '#1e293b',
    metaColor: '#059669',
    decorColor: '#d1fae5',
    watermarkColor: '#6ee7b7',
    border: '2px solid #bbf7d0',
    patternOpacity: 0.05,
  },
  {
    id: 'gold',
    name: 'কাবা গোল্ড',
    background: 'linear-gradient(145deg, #0c0a00 0%, #1c1400 40%, #0c0a00 100%)',
    arabicColor: '#f59e0b',
    translitColor: '#d97706',
    translationColor: '#fef3c7',
    metaColor: '#b45309',
    decorColor: '#78350f',
    watermarkColor: '#92400e',
    border: '2px solid #92400e',
    patternOpacity: 0.1,
  },
  {
    id: 'mosque',
    name: 'মসজিদ নীল',
    background: 'linear-gradient(160deg, #1e3a5f 0%, #0f2744 50%, #0a1f3d 100%)',
    arabicColor: '#fef9c3',
    translitColor: '#93c5fd',
    translationColor: '#dbeafe',
    metaColor: '#60a5fa',
    decorColor: '#1d4ed8',
    watermarkColor: '#3b82f6',
    border: '2px solid #1d4ed8',
    patternOpacity: 0.07,
  },
]

export type ImageFormat = 'square' | 'story' | 'landscape'

export const IMAGE_FORMATS: Record<ImageFormat, { width: number; height: number; label: string; icon: string }> = {
  square:    { width: 1080, height: 1080, label: 'স্কোয়ার ১:১',    icon: '⬛' },
  story:     { width: 1080, height: 1920, label: 'স্টোরি ৯:১৬',    icon: '📱' },
  landscape: { width: 1200, height: 630,  label: 'ল্যান্ডস্কেপ',   icon: '🖼️' },
}
