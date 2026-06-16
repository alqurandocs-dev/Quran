import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

const QUICK_LINKS = [
  { to: '/quran', label: 'কুরআন' },
  { to: '/dua', label: 'দোয়া' },
  { to: '/prayer', label: 'নামাজের সময়' },
  { to: '/juz', label: 'পারা' },
]

const OTHER_FEATURES = [
  { to: '/daily-dua', label: 'আজকের দোয়া' },
  { to: '/bookmarks', label: 'বুকমার্ক' },
  { to: '/favorites', label: 'প্রিয় আয়াত' },
  { to: '/settings', label: 'সেটিংস' },
]

export function Footer() {
  return (
    <footer className="hidden md:block border-t mt-8"
      style={{ background: '#0B1120', borderColor: 'rgba(255,255,255,0.08)' }}>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl font-arabic text-xl font-bold"
                style={{ background: '#14B8A6', color: '#0B1120' }}>
                ق
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: '#F9FAFB' }}>আল-কুরআন</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Al-Quran Bangla</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              বাংলাভাষী মুসলমানদের জন্য একটি সহজ ও আধুনিক কুরআন পড়ার অ্যাপ। যেকোনো স্থান থেকে, যেকোনো সময়।
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:opacity-80 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                f
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:opacity-80 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                ▶
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#14B8A6' }}>
              গুরুত্বপূর্ণ লিংক
            </p>
            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <ul className="space-y-3">
              {QUICK_LINKS.map(item => (
                <li key={item.to} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: '#14B8A6' }} />
                  <Link to={item.to}
                    className="text-sm transition-colors hover:text-[#14B8A6]"
                    style={{ color: '#94A3B8' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Features */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#14B8A6' }}>
              অন্যান্য ফিচার
            </p>
            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <ul className="space-y-3">
              {OTHER_FEATURES.map(item => (
                <li key={item.to} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: '#14B8A6' }} />
                  <Link to={item.to}
                    className="text-sm transition-colors hover:text-[#14B8A6]"
                    style={{ color: '#94A3B8' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#14B8A6' }}>
              যোগাযোগ
            </p>
            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#14B8A6' }} />
                <span className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  Microvex, Shiber Bazar,<br />Sylhet Sadar, Sylhet
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#14B8A6' }} />
                <a href="tel:01310012276"
                  className="text-sm transition-colors hover:text-[#14B8A6]"
                  style={{ color: '#94A3B8' }}>
                  01310012276
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#14B8A6' }} />
                <a href="mailto:sendtomicrovex@gmail.com"
                  className="text-sm transition-colors hover:text-[#14B8A6]"
                  style={{ color: '#94A3B8' }}>
                  sendtomicrovex@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: '#475569' }}>
            © {new Date().getFullYear()} আল-কুরআন বাংলা। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs" style={{ color: '#475569' }}>
            তৈরি করেছে <span style={{ color: '#14B8A6' }}>Microvex</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
