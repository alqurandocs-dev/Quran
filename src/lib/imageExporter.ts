import { toPng, toJpeg } from 'html-to-image'

export type ExportFormat = 'png' | 'jpeg'

export interface ExportOptions {
  format?: ExportFormat
  quality?: number   // 0–1 for jpeg
  scale?: number     // pixel ratio multiplier
  width?: number
  height?: number
}

async function waitForFonts(): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
  // Extra buffer for Arabic fonts to render
  await new Promise((r) => setTimeout(r, 200))
}

export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> {
  const { format = 'png', quality = 0.95, scale = 2, width, height } = options

  await waitForFonts()

  const config = {
    pixelRatio: scale,
    ...(width && { width }),
    ...(height && { height }),
    style: {
      // Ensure element renders correctly when off-screen
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
    // Embed all fonts
    fontEmbedCSS: undefined as string | undefined,
  }

  let dataUrl: string
  if (format === 'jpeg') {
    dataUrl = await toJpeg(element, { ...config, quality })
  } else {
    dataUrl = await toPng(element, config)
  }

  // Convert data URL to Blob
  const res = await fetch(dataUrl)
  return res.blob()
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportAndDownload(
  element: HTMLElement,
  filename: string,
  options?: ExportOptions
): Promise<void> {
  const blob = await exportElementAsImage(element, options)
  downloadBlob(blob, filename)
}
