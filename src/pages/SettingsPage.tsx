import { Moon, Sun, Monitor, LogOut, User, Heart, Bookmark } from 'lucide-react'
import { useSettingsStore, type BanglaTranslation, type LineHeight, type PlaybackSpeed } from '@/stores/settingsStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QARIS, TRANSLATION_OPTIONS } from '@/data/surahs'
import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 px-1">
        {title}
      </p>
      <Card className="divide-y divide-[var(--color-border)] p-0 overflow-hidden">
        {children}
      </Card>
    </div>
  )
}

function SettingRow({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="flex-1 min-w-0">
        <span className="text-sm text-[var(--color-text)]">{label}</span>
        {sublabel && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{sublabel}</p>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#14B8A6]' : 'bg-[var(--color-border)]'}`}
      role="switch"
      aria-checked={value}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 max-w-[180px]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function SettingsPage() {
  const {
    theme, setTheme,
    fontSize, setFontSize,
    arabicFontSize, setArabicFontSize,
    lineHeight, setLineHeight,
    translationLanguage, setTranslationLanguage,
    banglaTranslation, setBanglaTranslation,
    showTransliteration, toggleTransliteration,
    showTafsir, toggleTafsir,
    showAyahNumbers, toggleShowAyahNumbers,
    autoSaveProgress, toggleAutoSaveProgress,
    resumeAudioPosition, toggleResumeAudioPosition,
    preferredQari, setQari,
    playbackSpeed, setPlaybackSpeed,
  } = useSettingsStore()

  const { user } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const themeButtons = [
    { v: 'light' as const,  icon: <Sun className="h-3.5 w-3.5" />,     label: 'লাইট' },
    { v: 'dark' as const,   icon: <Moon className="h-3.5 w-3.5" />,    label: 'ডার্ক' },
    { v: 'system' as const, icon: <Monitor className="h-3.5 w-3.5" />, label: 'সিস্টেম' },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">সেটিংস</h1>

      {/* Account */}
      <Section title="অ্যাকাউন্ট">
        {user ? (
          <>
            <SettingRow label="ইমেইল">
              <span className="text-sm text-[var(--color-text-muted)] truncate max-w-[180px]">{user.email}</span>
            </SettingRow>
            <div className="flex gap-3 px-4 py-3">
              <Link to="/bookmarks">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" /> বুকমার্ক
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Heart className="h-3.5 w-3.5" /> প্রিয়
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleLogout} className="gap-1.5 ml-auto">
                <LogOut className="h-3.5 w-3.5" /> লগআউট
              </Button>
            </div>
          </>
        ) : (
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--color-text-muted)]" />
              <div>
                <p className="text-sm text-[var(--color-text)]">লগইন করুন</p>
                <p className="text-xs text-[var(--color-text-muted)]">সব ডিভাইসে সিনক হবে</p>
              </div>
            </div>
            <Link to="/auth">
              <Button size="sm">লগইন</Button>
            </Link>
          </div>
        )}
      </Section>

      {/* Appearance */}
      <Section title="চেহারা (Theme)">
        <SettingRow label="থিম">
          <div className="flex gap-1 rounded-lg bg-[var(--color-bg)] p-1">
            {themeButtons.map(({ v, icon, label }) => (
              <button
                key={v}
                onClick={() => setTheme(v)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                  theme === v ? 'bg-[#14B8A6] text-white' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </SettingRow>
      </Section>

      {/* Reading */}
      <Section title="পড়ার সেটিংস">
        <SettingRow label="আরবি ফন্ট সাইজ">
          <SelectInput
            value={arabicFontSize}
            onChange={setArabicFontSize}
            options={[
              { value: 'md',   label: 'মাঝারি' },
              { value: 'lg',   label: 'বড়' },
              { value: 'xl',   label: 'অনেক বড়' },
              { value: 'xxl',  label: 'সবচেয়ে বড়' },
              { value: 'xxxl', label: 'এক্সট্রা বড়' },
            ]}
          />
        </SettingRow>

        <SettingRow label="অনুবাদ ফন্ট সাইজ">
          <SelectInput
            value={fontSize}
            onChange={setFontSize}
            options={[
              { value: 'sm', label: 'ছোট' },
              { value: 'md', label: 'মাঝারি' },
              { value: 'lg', label: 'বড়' },
              { value: 'xl', label: 'অনেক বড়' },
            ]}
          />
        </SettingRow>

        <SettingRow label="লাইন স্পেসিং">
          <SelectInput<LineHeight>
            value={lineHeight}
            onChange={setLineHeight}
            options={[
              { value: 'normal',  label: 'স্বাভাবিক' },
              { value: 'relaxed', label: 'আরামদায়ক' },
              { value: 'loose',   label: 'প্রশস্ত' },
            ]}
          />
        </SettingRow>

        <SettingRow label="আয়াত নম্বর দেখান">
          <Toggle value={showAyahNumbers} onToggle={toggleShowAyahNumbers} />
        </SettingRow>

        <SettingRow label="তরজমা দেখান" sublabel="আরবির নিচে উচ্চারণ">
          <Toggle value={showTransliteration} onToggle={toggleTransliteration} />
        </SettingRow>

        <SettingRow label="তাফসীর দেখান" sublabel="প্রতিটি আয়াতের ব্যাখ্যা">
          <Toggle value={showTafsir} onToggle={toggleTafsir} />
        </SettingRow>
      </Section>

      {/* Translation */}
      <Section title="অনুবাদ সেটিংস">
        <SettingRow label="ভাষা">
          <div className="flex gap-1 rounded-lg bg-[var(--color-bg)] p-1">
            {(['bangla', 'english'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setTranslationLanguage(v)}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  translationLanguage === v ? 'bg-[#14B8A6] text-white' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {v === 'bangla' ? 'বাংলা' : 'English'}
              </button>
            ))}
          </div>
        </SettingRow>

        {translationLanguage === 'bangla' && (
          <SettingRow label="বাংলা অনুবাদক">
            <SelectInput<BanglaTranslation>
              value={banglaTranslation}
              onChange={setBanglaTranslation}
              options={TRANSLATION_OPTIONS.filter((t) => t.language === 'bangla').map((t) => ({
                value: t.id as BanglaTranslation,
                label: t.label,
              }))}
            />
          </SettingRow>
        )}
      </Section>

      {/* Audio */}
      <Section title="অডিও সেটিংস">
        <SettingRow label="ক্বারী (Qari)">
          <select
            value={preferredQari}
            onChange={(e) => setQari(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)] max-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40"
          >
            {QARIS.map((q) => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label="প্লেব্যাক স্পিড">
          <SelectInput<string>
            value={String(playbackSpeed)}
            onChange={(v) => setPlaybackSpeed(parseFloat(v) as PlaybackSpeed)}
            options={[
              { value: '0.75', label: '০.৭৫×' },
              { value: '1',    label: '১× (স্বাভাবিক)' },
              { value: '1.25', label: '১.২৫×' },
              { value: '1.5',  label: '১.৫×' },
            ]}
          />
        </SettingRow>
      </Section>

      {/* Behavior */}
      <Section title="আচরণ সেটিংস">
        <SettingRow
          label="পড়ার অগ্রগতি সংরক্ষণ"
          sublabel="স্বয়ংক্রিয়ভাবে সর্বশেষ অবস্থান মনে রাখবে"
        >
          <Toggle value={autoSaveProgress} onToggle={toggleAutoSaveProgress} />
        </SettingRow>

        <SettingRow
          label="অডিও পজিশন মনে রাখুন"
          sublabel="পরের বার একই স্থান থেকে শুরু হবে"
        >
          <Toggle value={resumeAudioPosition} onToggle={toggleResumeAudioPosition} />
        </SettingRow>
      </Section>

      {/* About */}
      <Section title="সম্পর্কে">
        <SettingRow label="সংস্করণ">
          <span className="text-sm text-[var(--color-text-muted)]">১.০.০</span>
        </SettingRow>
        <div className="px-4 py-3">
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            কুরআনের তথ্য: AlQuran.cloud API • অডিও: Islamic.Network CDN •
            নামাজের সময়: Aladhan.com API • সকল সেবা বিনামূল্যে।
          </p>
        </div>
      </Section>
    </div>
  )
}
