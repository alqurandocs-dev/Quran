import { SHARE_THEMES } from './themes'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  selected: string
  onChange: (id: string) => void
}

const THEME_PREVIEW_COLORS: Record<string, string> = {
  green:   'from-green-900 to-green-700',
  dark:    'from-slate-900 to-slate-700',
  white:   'from-white to-green-50',
  gold:    'from-stone-950 to-yellow-950',
  mosque:  'from-blue-950 to-blue-800',
}

const THEME_DOT_COLORS: Record<string, string> = {
  green:  'bg-amber-400',
  dark:   'bg-amber-400',
  white:  'bg-green-700',
  gold:   'bg-yellow-400',
  mosque: 'bg-yellow-200',
}

export function ThemeSelector({ selected, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SHARE_THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          title={theme.name}
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl p-1.5 border-2 transition-all',
            selected === theme.id
              ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20'
              : 'border-transparent hover:border-[var(--color-border)]'
          )}
        >
          {/* Color swatch */}
          <div
            className={cn(
              'h-9 w-9 rounded-lg bg-gradient-to-br relative overflow-hidden',
              THEME_PREVIEW_COLORS[theme.id] ?? 'from-green-900 to-green-700'
            )}
          >
            {/* Mini dot to represent Arabic text color */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center text-[10px] font-bold',
                THEME_DOT_COLORS[theme.id]
              )}
              style={{ color: 'inherit' }}
            >
              <span className={cn('text-[8px]', THEME_DOT_COLORS[theme.id].replace('bg-', 'text-'))}>
                ق
              </span>
            </div>
          </div>
          <span className="text-[9px] text-[var(--color-text-muted)] text-center leading-tight max-w-[44px]">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  )
}
