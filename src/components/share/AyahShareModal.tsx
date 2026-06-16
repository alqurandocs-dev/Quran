import { useRef, useState, useCallback } from 'react'
import { X, Download, Share2, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useShareStore } from '@/stores/shareStore'
import { AyahCardPreview } from './AyahCardPreview'
import { ThemeSelector } from './ThemeSelector'
import { IMAGE_FORMATS, type ImageFormat } from './themes'
import { exportElementAsImage } from '@/lib/imageExporter'
import { shareImage, buildFilename } from '@/lib/shareService'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { formatBanglaNumber } from '@/lib/utils'

type Status = 'idle' | 'generating' | 'success' | 'error'

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--color-text)]">{label}</span>
      <button
        onClick={onToggle}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          value ? 'bg-green-600' : 'bg-[var(--color-border)]'
        )}
        role="switch"
        aria-checked={value}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            value ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

export function AyahShareModal() {
  const {
    isOpen, ayahData, closeShare,
    selectedTheme, setTheme,
    showTranslation, toggleTranslation,
    showTransliteration, toggleTransliteration,
    showWatermark, toggleWatermark,
    showLogo, toggleLogo,
    imageFormat, setImageFormat,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
  } = useShareStore()

  // Hidden full-res card ref for export
  const exportRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleExport = useCallback(
    async (mode: 'download' | 'share') => {
      if (!exportRef.current || !ayahData) return
      setStatus('generating')
      try {
        const fmt = IMAGE_FORMATS[imageFormat]
        const blob = await exportElementAsImage(exportRef.current, {
          format: 'png',
          scale: 2,
          width: fmt.width,
          height: fmt.height,
        })
        const filename = buildFilename(ayahData.surahNameBn, ayahData.ayahNumber, 'png')

        if (mode === 'share') {
          await shareImage({
            blob,
            filename,
            title: `${ayahData.surahNameBn} - আয়াত ${ayahData.ayahNumber}`,
            text: ayahData.translation ?? ayahData.arabicText,
          })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.click()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        }
        setStatus('success')
        setTimeout(() => setStatus('idle'), 2500)
      } catch (err) {
        console.error(err)
        setStatus('error')
        setTimeout(() => setStatus('idle'), 2000)
      }
    },
    [ayahData, imageFormat]
  )

  if (!isOpen || !ayahData) return null

  const fmtKeys = Object.keys(IMAGE_FORMATS) as ImageFormat[]
  const isGenerating = status === 'generating'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closeShare}
        aria-label="닫기"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label="আয়াত শেয়ার করুন"
      >
        <div className="relative w-full sm:max-w-lg bg-[var(--color-bg)] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
            <div>
              <h2 className="font-bold text-[var(--color-text)]">আয়াত শেয়ার করুন</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {ayahData.surahNameBn} • আয়াত {formatBanglaNumber(ayahData.ayahNumber)}
              </p>
            </div>
            <button
              onClick={closeShare}
              className="rounded-full p-1.5 hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]"
              aria-label="বন্ধ করুন"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* ── PREVIEW ── */}
            <div className="flex justify-center overflow-hidden rounded-xl bg-[var(--color-surface)] p-3">
              <div style={{ overflow: 'hidden', borderRadius: 12 }}>
                <AyahCardPreview
                  ayah={ayahData}
                  themeId={selectedTheme}
                  format={imageFormat}
                  showTranslation={showTranslation}
                  showTransliteration={showTransliteration}
                  showWatermark={showWatermark}
                  showLogo={showLogo}
                  arabicFontSize={arabicFontSize}
                  translationFontSize={translationFontSize}
                  fullSize={false}
                />
              </div>
            </div>

            {/* ── FORMAT ── */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                ফরম্যাট
              </p>
              <div className="grid grid-cols-3 gap-2">
                {fmtKeys.map((key) => {
                  const f = IMAGE_FORMATS[key]
                  return (
                    <button
                      key={key}
                      onClick={() => setImageFormat(key)}
                      className={cn(
                        'rounded-xl border px-2 py-2 text-xs text-center transition-all',
                        imageFormat === key
                          ? 'border-green-500 bg-green-600/10 text-green-500 font-semibold'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-green-500/50'
                      )}
                    >
                      <p className="text-base mb-0.5">{f.icon}</p>
                      <p>{f.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── THEME ── */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                থিম
              </p>
              <ThemeSelector selected={selectedTheme} onChange={setTheme} />
            </div>

            {/* ── DISPLAY TOGGLES ── */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                প্রদর্শন
              </p>
              <div className="bg-[var(--color-surface)] rounded-xl p-3 space-y-3">
                <Toggle label="অনুবাদ দেখান" value={showTranslation} onToggle={toggleTranslation} />
                <Toggle label="উচ্চারণ দেখান" value={showTransliteration} onToggle={toggleTransliteration} />
                <Toggle label="অ্যাপ লোগো" value={showLogo} onToggle={toggleLogo} />
                <Toggle label="ওয়াটারমার্ক" value={showWatermark} onToggle={toggleWatermark} />
              </div>
            </div>

            {/* ── ADVANCED (collapsible) ── */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-green-500 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                উন্নত বিকল্প
              </button>

              {showAdvanced && (
                <div className="mt-2 bg-[var(--color-surface)] rounded-xl p-3 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[var(--color-text)]">আরবি ফন্ট</span>
                      <span className="text-xs text-green-500 font-mono">{arabicFontSize}px</span>
                    </div>
                    <input
                      type="range" min={24} max={72} step={2}
                      value={arabicFontSize}
                      onChange={(e) => setArabicFontSize(Number(e.target.value))}
                      className="w-full accent-green-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[var(--color-text)]">অনুবাদ ফন্ট</span>
                      <span className="text-xs text-green-500 font-mono">{translationFontSize}px</span>
                    </div>
                    <input
                      type="range" min={12} max={28} step={1}
                      value={translationFontSize}
                      onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                      className="w-full accent-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── STATUS MESSAGE ── */}
            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-xl bg-green-600/10 border border-green-500/30 px-3 py-2.5">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-500">আয়াতের ছবিটি সফলভাবে তৈরি হয়েছে ✨</p>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-xl bg-red-600/10 border border-red-500/30 px-3 py-2.5">
                <p className="text-sm text-red-400">সমস্যা হয়েছে, আবার চেষ্টা করুন।</p>
              </div>
            )}

            {/* ── ACTION BUTTONS ── */}
            <div className="grid grid-cols-2 gap-3 pb-2">
              <Button
                variant="outline"
                className="gap-2"
                disabled={isGenerating}
                onClick={() => handleExport('download')}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                ডাউনলোড
              </Button>

              <Button
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                disabled={isGenerating}
                onClick={() => handleExport('share')}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                শেয়ার করুন
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-resolution card for export */}
      <div
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <AyahCardPreview
          ref={exportRef}
          ayah={ayahData}
          themeId={selectedTheme}
          format={imageFormat}
          showTranslation={showTranslation}
          showTransliteration={showTransliteration}
          showWatermark={showWatermark}
          showLogo={showLogo}
          arabicFontSize={arabicFontSize}
          translationFontSize={translationFontSize}
          fullSize={true}
        />
      </div>
    </>
  )
}
