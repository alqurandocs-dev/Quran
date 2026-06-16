export interface SharePayload {
  blob: Blob
  filename: string
  title?: string
  text?: string
}

export async function shareImage(payload: SharePayload): Promise<'shared' | 'downloaded'> {
  const { blob, filename, title = 'আল-কুরআন', text = 'আল-কুরআন থেকে' } = payload

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: blob.type })
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ title, text, files: [file] })
      return 'shared'
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}

export function buildFilename(surahName: string, ayahNumber: number, format: string): string {
  const safe = surahName.replace(/[^a-zA-Zঀ-৿]/g, '_')
  return `quran_${safe}_ayah_${ayahNumber}.${format}`
}
