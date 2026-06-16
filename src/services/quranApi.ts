// AlQuran Cloud API - Free, no API key required
// Docs: https://alquran.cloud/api

const BASE_URL = 'https://api.alquran.cloud/v1'

export interface AlQuranAyah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean }
}

export interface AlQuranSurahData {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: string
  numberOfAyahs: number
  ayahs: AlQuranAyah[]
}

export interface AlQuranEditionSurah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: string
  numberOfAyahs: number
  ayahs: Array<{ number: number; text: string; numberInSurah: number }>
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  if (data.code !== 200) throw new Error(data.status)
  return data.data as T
}

export const quranApi = {
  // Fetch a surah with Arabic Uthmani text
  getSurah: (surahNumber: number) =>
    fetchApi<AlQuranSurahData>(`/surah/${surahNumber}/quran-uthmani`),

  // Fetch surah with a specific translation edition
  getSurahTranslation: (surahNumber: number, edition: string) =>
    fetchApi<AlQuranEditionSurah>(`/surah/${surahNumber}/${edition}`),

  // Fetch surah with multiple editions at once (max 3)
  getSurahMultiEdition: (surahNumber: number, editions: string[]) =>
    fetchApi<AlQuranEditionSurah[]>(`/surah/${surahNumber}/editions/${editions.join(',')}`),

  // Fetch single ayah
  getAyah: (reference: string, edition = 'quran-uthmani') =>
    fetchApi<AlQuranAyah>(`/ayah/${reference}/${edition}`),

  // Fetch Juz (ayahs include surah info from the API)
  getJuz: (juzNumber: number, edition = 'quran-uthmani') =>
    fetchApi<{ ayahs: (AlQuranAyah & { surah: { number: number; name: string; englishName: string; numberOfAyahs: number } })[] }>(
      `/juz/${juzNumber}/${edition}`
    ),

  // Search
  search: (query: string, surah = 'all', language = 'bn') =>
    fetchApi<{ count: number; matches: Array<{ number: number; text: string; surah: { number: number; englishName: string }; numberInSurah: number }> }>(
      `/search/${encodeURIComponent(query)}/${surah}/${language}`
    ),
}

// Audio URL builder - cdn.islamic.network is free
export function buildAyahAudioUrl(qariId: string, globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${qariId}/${globalAyahNumber}.mp3`
}

export function buildSurahAudioUrl(qariId: string, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0')
  return `https://download.quranicaudio.com/quran/${qariId.replace('ar.', '')}/${padded}.mp3`
}
