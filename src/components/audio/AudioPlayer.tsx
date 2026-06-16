import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from 'lucide-react'
import { useAudioStore } from '@/stores/audioStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildAyahAudioUrl } from '@/services/quranApi'
import { SURAHS } from '@/data/surahs'
import { formatBanglaNumber } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const isMountedRef = useRef(true)

  const {
    isPlaying, currentSurah, currentAyah, totalAyahs,
    duration, currentTime, qari,
    setPlaying, setDuration, setCurrentTime, nextAyah, prevAyah, stop, savePosition,
  } = useAudioStore()

  const { playbackSpeed } = useSettingsStore()

  const surah = currentSurah ? SURAHS[currentSurah - 1] : null

  const getGlobalAyahNumber = useCallback(() => {
    if (!currentSurah || !currentAyah) return null
    const offset = SURAHS.slice(0, currentSurah - 1).reduce((sum, s) => sum + s.numberOfAyahs, 0)
    return offset + currentAyah
  }, [currentSurah, currentAyah])

  // Single effect: handle src change + play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentSurah || !currentAyah) {
      audio.pause()
      return
    }

    const globalAyah = getGlobalAyahNumber()
    if (!globalAyah) return

    const newUrl = buildAyahAudioUrl(qari, globalAyah)
    const srcChanged = !audio.src.endsWith(newUrl.split('/').pop()!) || audio.src !== newUrl

    if (srcChanged) {
      audio.pause()
      audio.src = newUrl
      audio.load()
      audio.playbackRate = playbackSpeed

      if (isPlaying) {
        const tryPlay = () => {
          if (!isMountedRef.current) return
          audio.play().catch(() => {
            if (isMountedRef.current) setPlaying(false)
          })
        }
        audio.addEventListener('canplay', tryPlay, { once: true })
      }
    } else {
      audio.playbackRate = playbackSpeed
      if (isPlaying) {
        audio.play().catch(() => setPlaying(false))
      } else {
        audio.pause()
      }
    }
  }, [currentAyah, currentSurah, qari, isPlaying, playbackSpeed, getGlobalAyahNumber, setPlaying])

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const handleEnded = useCallback(() => {
    savePosition()
    const { currentAyah: ca, totalAyahs: ta, bismillahSurah: bs } = useAudioStore.getState()
    // If we just played bismillah, switch to the target surah
    if (bs) {
      useAudioStore.setState({ currentSurah: bs.surah, totalAyahs: bs.totalAyahs, currentAyah: 1, bismillahSurah: null, currentTime: 0 })
      return
    }
    if (ca && ca < ta) {
      nextAyah()
    } else {
      setPlaying(false)
    }
  }, [nextAyah, savePosition, setPlaying])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  if (!currentSurah || !currentAyah) return null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleEnded}
        onError={() => {
          // On error, skip to next ayah automatically
          if (isMountedRef.current) nextAyah()
        }}
      />

      <div className="fixed bottom-16 left-0 right-0 z-40 md:bottom-0 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md">
        {/* Thin progress bar at top */}
        <div className="h-0.5 bg-[var(--color-border)] w-full">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto max-w-2xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-green-600/20">
                <Volume2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                  {surah?.banglaName}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  আয়াত {formatBanglaNumber(currentAyah)} / {formatBanglaNumber(totalAyahs)}
                </p>
              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-[var(--color-text-muted)] tabular-nums hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={prevAyah}
                disabled={currentAyah <= 1}
                aria-label="আগের আয়াত"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 flex-shrink-0"
                onClick={() => setPlaying(!isPlaying)}
                aria-label={isPlaying ? 'পজ' : 'প্লে'}
              >
                {isPlaying
                  ? <Pause className="h-5 w-5 text-white" />
                  : <Play className="h-5 w-5 text-white" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={nextAyah}
                disabled={currentAyah >= totalAyahs}
                aria-label="পরের আয়াত"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={stop}
                aria-label="বন্ধ করুন"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seekbar */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-[var(--color-text-muted)] w-7 sm:hidden">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 accent-green-500 cursor-pointer"
              aria-label="সময়"
            />
            <span className="text-[10px] text-[var(--color-text-muted)] w-7 sm:hidden">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  )
}
