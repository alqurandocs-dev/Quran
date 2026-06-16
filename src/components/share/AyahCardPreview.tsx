import { forwardRef } from 'react'
import { SHARE_THEMES, IMAGE_FORMATS, type ImageFormat } from './themes'
import type { ShareAyahData } from '@/stores/shareStore'
import { formatBanglaNumber } from '@/lib/utils'

interface AyahCardPreviewProps {
  ayah: ShareAyahData
  themeId: string
  format: ImageFormat
  showTranslation: boolean
  showTransliteration: boolean
  showWatermark: boolean
  showLogo: boolean
  arabicFontSize: number
  translationFontSize: number
  /** When true renders at full export resolution; false = preview mode */
  fullSize?: boolean
}

// Islamic geometric star SVG (inline, no external deps)
function StarDecor({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12,2 14.4,9.2 22,9.2 15.8,13.8 18.2,21 12,16.4 5.8,21 8.2,13.8 2,9.2 9.6,9.2" />
    </svg>
  )
}

// Bismillah-style decorative divider
function Divider({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', padding: '0 24px' }}>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.5 }} />
      <StarDecor color={color} size={14} />
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.5 }} />
    </div>
  )
}

// Arabic geometric corner pattern (SVG)
function CornerPattern({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg
      width="80" height="80" viewBox="0 0 80 80"
      style={{ transform: flip ? 'rotate(180deg)' : undefined, opacity: 0.3 }}
    >
      <path d="M0,0 L40,0 L0,40 Z" fill={color} />
      <path d="M0,0 L20,0 L0,20 Z" fill={color} opacity="0.5" />
      <circle cx="40" cy="40" r="3" fill={color} />
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  )
}

// Islamic border pattern across top/bottom
function BorderStrip({ color }: { color: string }) {
  const items = Array.from({ length: 16 })
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '8px 0' }}>
      {items.map((_, i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6,
            background: color,
            opacity: i % 2 === 0 ? 0.6 : 0.3,
            transform: 'rotate(45deg)',
          }}
        />
      ))}
    </div>
  )
}

export const AyahCardPreview = forwardRef<HTMLDivElement, AyahCardPreviewProps>(
  (
    {
      ayah,
      themeId,
      format,
      showTranslation,
      showTransliteration,
      showWatermark,
      showLogo,
      arabicFontSize,
      translationFontSize,
      fullSize = false,
    },
    ref
  ) => {
    const theme = SHARE_THEMES.find((t) => t.id === themeId) ?? SHARE_THEMES[0]
    const { width, height } = IMAGE_FORMATS[format]

    const scale = fullSize ? 1 : 340 / width
    const scaledH = Math.round(height * scale)

    const cardStyle: React.CSSProperties = {
      width: fullSize ? width : 340,
      height: fullSize ? height : scaledH,
      background: theme.background,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Noto Serif Bengali", "SolaimanLipi", serif',
      border: theme.border ?? 'none',
      borderRadius: fullSize ? 0 : 16,
      flexShrink: 0,
    }

    const isLandscape = format === 'landscape'
    const px = fullSize ? 72 : 24
    void (format === 'story') // unused but kept for future story format

    return (
      <div ref={ref} style={cardStyle}>
        {/* Background Pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme.decorColor} 1px, transparent 1px),
                              radial-gradient(circle at 80% 80%, ${theme.decorColor} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: theme.patternOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <CornerPattern color={theme.decorColor} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <CornerPattern color={theme.decorColor} flip />
        </div>

        {/* Top border strip */}
        <div style={{ paddingTop: fullSize ? 40 : 10 }}>
          <BorderStrip color={theme.decorColor} />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: isLandscape ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${fullSize ? 20 : 8}px ${px}px`,
            gap: fullSize ? 32 : 10,
          }}
        >
          {/* Left column (landscape only) */}
          <div style={{ flex: isLandscape ? '0 0 50%' : undefined, width: isLandscape ? '50%' : '100%' }}>
            {/* Surah badge top */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: fullSize ? 12 : 6,
                marginBottom: fullSize ? 28 : 10,
              }}
            >
              <StarDecor color={theme.decorColor} size={fullSize ? 18 : 10} />
              <span
                style={{
                  color: theme.metaColor,
                  fontSize: fullSize ? 24 : 11,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {ayah.surahNameBn} • আয়াত {formatBanglaNumber(ayah.ayahNumber)}
              </span>
              <StarDecor color={theme.decorColor} size={fullSize ? 18 : 10} />
            </div>

            {/* Arabic Text */}
            <p
              style={{
                color: theme.arabicColor,
                fontSize: fullSize ? arabicFontSize * 1.8 : arabicFontSize * 0.6,
                fontFamily: '"KFGQPC Uthmanic Script HAFS", "Scheherazade New", "Noto Naskh Arabic", "Traditional Arabic", serif',
                textAlign: 'right',
                direction: 'rtl',
                lineHeight: 2,
                margin: 0,
                textShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                letterSpacing: '0.02em',
              }}
            >
              {ayah.arabicText}
            </p>
          </div>

          {/* Right column (landscape) / below (other formats) */}
          <div
            style={{
              flex: isLandscape ? '0 0 45%' : undefined,
              width: isLandscape ? '45%' : '100%',
              borderLeft: isLandscape ? `1px solid ${theme.decorColor}44` : 'none',
              paddingLeft: isLandscape ? (fullSize ? 40 : 16) : 0,
            }}
          >
            {!isLandscape && <Divider color={theme.decorColor} />}

            {/* Transliteration */}
            {showTransliteration && ayah.transliteration && (
              <p
                style={{
                  color: theme.translitColor,
                  fontSize: fullSize ? translationFontSize * 1.3 : translationFontSize * 0.52,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  margin: 0,
                  marginBottom: fullSize ? 24 : 8,
                  lineHeight: 1.7,
                  opacity: 0.9,
                }}
              >
                {ayah.transliteration}
              </p>
            )}

            {/* Translation */}
            {showTranslation && ayah.translation && (
              <p
                style={{
                  color: theme.translationColor,
                  fontSize: fullSize ? translationFontSize * 1.5 : translationFontSize * 0.6,
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.8,
                  fontFamily: '"Noto Serif Bengali", "SolaimanLipi", serif',
                }}
              >
                {ayah.translation}
              </p>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ padding: `0 ${px}px ${fullSize ? 40 : 12}px` }}>
          {/* Bottom divider */}
          <Divider color={theme.decorColor} />

          {/* Footer row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: fullSize ? 8 : 4,
            }}
          >
            {/* Logo */}
            {showLogo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: fullSize ? 10 : 5 }}>
                <div
                  style={{
                    width: fullSize ? 40 : 18,
                    height: fullSize ? 40 : 18,
                    borderRadius: '50%',
                    background: theme.decorColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: theme.arabicColor, fontSize: fullSize ? 22 : 10, fontFamily: 'serif' }}>ق</span>
                </div>
                <span
                  style={{
                    color: theme.metaColor,
                    fontSize: fullSize ? 18 : 9,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  Nooraya
                </span>
              </div>
            )}

            {/* Arabic surah name */}
            <p
              style={{
                color: theme.metaColor,
                fontSize: fullSize ? 28 : 13,
                fontFamily: 'serif',
                margin: 0,
                opacity: 0.8,
                direction: 'rtl',
              }}
            >
              {ayah.surahNameAr}
            </p>

            {/* Watermark */}
            {showWatermark && (
              <p
                style={{
                  color: theme.watermarkColor,
                  fontSize: fullSize ? 14 : 7,
                  margin: 0,
                  opacity: 0.7,
                  fontStyle: 'italic',
                }}
              >
                Nooraya App
              </p>
            )}
          </div>
        </div>

        {/* Bottom border strip */}
        <BorderStrip color={theme.decorColor} />
        <div style={{ paddingBottom: fullSize ? 20 : 4 }} />
      </div>
    )
  }
)

AyahCardPreview.displayName = 'AyahCardPreview'
