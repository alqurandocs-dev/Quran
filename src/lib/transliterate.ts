/**
 * Converts Arabic romanization (AlQuran.cloud en.transliteration format) to Bangla script.
 * API conventions: AA=ayn(ع), doubled-cons=shadda, oo/ee=long vowels, al=definite article.
 */

// ── Word-level map (whole-word exact match after lowercasing) ─────────────────
const WORD_MAP: Record<string, string> = {
  // Allah & forms
  allah: 'আল্লাহ',
  allahu: 'আল্লাহু',
  allaha: 'আল্লাহা',
  allahi: 'আল্লাহি',
  allahumma: 'আল্লাহুম্মা',
  lillahi: 'লিল্লাহি',
  lillah: 'লিল্লাহ',
  billahi: 'বিল্লাহি',
  billah: 'বিল্লাহ',

  // Bismillah components
  bismi: 'বিসমি',
  bism: 'বিসম',
  bismillahi: 'বিসমিল্লাহি',
  bismillah: 'বিসমিল্লাহ',

  // Al-Fatiha word forms (API exact strings)
  alhamdu: 'আলহামদু',
  alhamdulillah: 'আলহামদুলিল্লাহ',
  rabbi: 'রব্বি',
  rabb: 'রব',
  rabbika: 'রব্বিকা',
  rabbina: 'রব্বিনা',
  alAAalameena: 'আলআমীন',
  alAAalameen: 'আলআমীন',
  alrrahmani: 'আর-রহমানি',
  alrrahmaan: 'আর-রহমান',
  alrrahman: 'আর-রহমান',
  alrraheemi: 'আর-রহীমি',
  alrraheem: 'আর-রহীম',
  maliki: 'মালিকি',
  yawmi: 'ইয়াওমি',
  alddeeni: 'আদ-দীনি',
  addeen: 'আদ-দীন',
  deen: 'দীন',
  deeni: 'দীনি',
  'iyyaka': 'ইয়্যাকা',
  iyyaaka: 'ইয়্যাকা',
  lyyaaka: 'ইয়্যাকা',
  naAAbudu: 'নাবুদু',
  "na'budu": 'নাবুদু',
  'wa-iyyaka': 'ওয়া ইয়্যাকা',
  nastaAAeenu: 'নাস্তাঈনু',
  nastaAAeen: 'নাস্তাঈন',
  "nasta'een": 'নাস্তাঈন',
  ihdina: 'ইহদিনা',
  alssirata: 'আস-সিরাতা',
  alssiraata: 'আস-সিরাতা',
  almustaqeema: 'আল-মুস্তাকীমা',
  almustaqeem: 'আল-মুস্তাকীম',
  sirata: 'সিরাতা',
  siraat: 'সিরাত',
  sirat: 'সিরাত',
  allatheena: 'আল্লাযীনা',
  alatheen: 'আল্লাযীন',
  anamta: 'আনআমতা',
  anamtu: 'আনআমতু',
  AAalayhim: 'আলাইহিম',
  AAalayhimoo: 'আলাইহিম',
  ghayri: 'গাইরি',
  ghayr: 'গাইর',
  almaghdoobi: 'আল-মাগদূবি',
  almaghdoob: 'আল-মাগদূব',
  maghdoobi: 'মাগদূবি',
  wala: 'ওয়ালা',
  'wa-la': 'ওয়ালা',
  alddalleena: 'আদ-দাল্লীনা',
  addalleen: 'আদ-দাল্লীন',
  alddalleen: 'আদ-দাল্লীন',
  ddalleena: 'দাল্লীনা',

  // Divine attributes
  rahman: 'রহমান',
  raheem: 'রহীম',
  rahim: 'রহীম',
  karim: 'কারীম',
  hakeem: 'হাকীম',
  aleem: 'আলীম',
  qadeer: 'কাদীর',
  qadir: 'কাদির',
  samee: 'সামী',
  baseer: 'বাসীর',
  lateef: 'লতীফ',
  khabeer: 'খাবীর',
  haleem: 'হালীম',
  azeez: 'আযীয',
  aziz: 'আযীয',
  jabbar: 'জাব্বার',
  mutakabbir: 'মুতাকাব্বির',
  khaliq: 'খালিক',
  bari: 'বারী',
  musawwir: 'মুসাওয়ির',
  ghaffar: 'গাফফার',
  qahhar: 'কাহহার',
  wahhab: 'ওয়াহহাব',
  razzaq: 'রাজ্জাক',
  fattah: 'ফাত্তাহ',
  hafiz: 'হাফিয',
  hayy: 'হাইয়্য',
  qayyum: 'কাইয়্যূম',
  wahid: 'ওয়াহিদ',
  ahad: 'আহাদ',
  samad: 'সামাদ',
  noor: 'নূর',

  // Common particles
  wa: 'ওয়া',
  walam: 'ওয়ালাম',
  waman: 'ওয়ামান',
  wama: 'ওয়ামা',
  wal: 'ওয়াল',
  la: 'লা',
  lan: 'লান',
  lam: 'লাম',
  lahu: 'লাহু',
  laha: 'লাহা',
  lahum: 'লাহুম',
  li: 'লি',
  lil: 'লিল',
  fi: 'ফী',
  min: 'মিন',
  ila: 'ইলা',
  an: 'আন',
  aw: 'আও',
  in: 'ইন',
  inna: 'ইন্না',
  innahu: 'ইন্নাহু',
  innaka: 'ইন্নাকা',
  innama: 'ইন্নামা',
  bal: 'বাল',
  fa: 'ফা',
  qad: 'কাদ',
  thumma: 'ছুম্মা',
  hatta: 'হাত্তা',

  // Pronouns
  huwa: 'হুওয়া',
  hiya: 'হিয়া',
  hum: 'হুম',
  huna: 'হুনা',
  anta: 'আনতা',
  anti: 'আনতি',
  ana: 'আনা',
  nahnu: 'নাহনু',
  ma: 'মা',
  man: 'মান',

  // Verbs
  qul: 'কুল',
  qaala: 'কালা',
  qala: 'কালা',
  amana: 'আমানা',

  // Common nouns
  yawm: 'ইয়াওম',
  quran: 'কুরআন',
  nabi: 'নবী',
  rasul: 'রাসূল',
  rasool: 'রাসূল',
  islam: 'ইসলাম',
  muslim: 'মুসলিম',
  iman: 'ঈমান',
  jannah: 'জান্নাত',
  jahannam: 'জাহান্নাম',
  aakhirah: 'আখিরাহ',
  dunya: 'দুনিয়া',
  kitab: 'কিতাব',
  rahmah: 'রহমাহ',

  // Common phrases
  subhanallah: 'সুবহানাল্লাহ',
  alhamdulillah2: 'আলহামদুলিল্লাহ',
  astaghfirullah: 'আস্তাগফিরুল্লাহ',
  inshallah: 'ইনশাআল্লাহ',
  mashallah: 'মাশাআল্লাহ',
  ameen: 'আমীন',

  // Definite-article combos (API returns these as single tokens)
  alnas: 'আন-নাস',
  alfalaq: 'আল-ফালাক',
  alikhlas: 'আল-ইখলাস',
  almasad: 'আল-মাসাদ',
  alnasr: 'আন-নাসর',
  alkafiroon: 'আল-কাফিরূন',
  alkawther: 'আল-কাওছার',
  almaAAoon: 'আল-মাঊন',
  alquraysh: 'কুরাইশ',
  alfeel: 'আল-ফীল',
  alhumazah: 'আল-হুমাযাহ',
  alAAasr: 'আল-আসর',
  alttakathur: 'আত-তাকাছুর',
  alqariAAah: 'আল-কারিআহ',
  alzalzalah: 'আয-যালযালাহ',
  albayyinah: 'আল-বায়্যিনাহ',
  alqadr: 'আল-কাদর',
  alalaq: 'আল-আলাক',
  alshsharh: 'আশ-শারহ',
  alfajr: 'আল-ফাজর',
  alghashiyah: 'আল-গাশিয়াহ',
  allayl: 'আল-লাইল',
  alshams: 'আশ-শামস',
  albalad: 'আল-বালাদ',
  alduha: 'আদ-দুহা',
  altteen: 'আত-তীন',
  alttariq: 'আত-তারিক',
  alburuj: 'আল-বুরূজ',
  almanshirah: 'আল-মানশিরাহ',
  almulk: 'আল-মুলক',
  alhaaqqah: 'আল-হাক্কাহ',
  alqalam: 'আল-কালাম',
  alnaziAAat: 'আন-নাযিআত',
  alnaba: 'আন-নাবা',
  almursalat: 'আল-মুরসালাত',
  alinsaan: 'আল-ইনসান',
  alqiyamah: 'আল-কিয়ামাহ',
  almudaththir: 'আল-মুদ্দাছির',
  almuzzammil: 'আল-মুযযাম্মিল',
  aljinn: 'আল-জিন',
  alnoor: 'আন-নূর',
  alhajj: 'আল-হজ্জ',
  almuminoon: 'আল-মুমিনূন',
  alfurqan: 'আল-ফুরকান',
  alnoor2: 'আন-নূর',
  alankabut: 'আল-আনকাবূত',
  alroom: 'আর-রূম',
  alsajdah: 'আস-সাজদাহ',
  alahzab: 'আল-আহযাব',
  alzumar: 'আয-যুমার',
  alttawbah: 'আত-তাওবাহ',
  alaAnfal: 'আল-আনফাল',
  almaidah: 'আল-মায়িদাহ',
  alnisaa: 'আন-নিসা',
  alAAimran: 'আলে-ইমরান',
  albaqarah: 'আল-বাকারাহ',
  alfatihah: 'আল-ফাতিহাহ',

  // Prophet names
  ibrahim: 'ইবরাহীম',
  ibrahim2: 'ইবরাহিম',
  musa: 'মূসা',
  eesa: 'ঈসা',
  isa: 'ঈসা',
  nooh: 'নূহ',
  yusuf: 'ইউসুফ',
  yunus: 'ইউনুস',
  idrees: 'ইদরীস',
  ilyas: 'ইলিয়াস',
  dawood: 'দাউদ',
  dawud: 'দাউদ',
  sulayman: 'সুলাইমান',
  ayyub: 'আইয়্যুব',
  zakariyya: 'যাকারিয়া',
  yahya: 'ইয়াহইয়া',
  hud: 'হূদ',
  salih: 'সালিহ',
  luqman: 'লুকমান',
  maryam: 'মারইয়াম',
}

// ── Character-level patterns (longest → shortest) ─────────────────────────────
// [latinPat, afterConsonant, standalone(null=same), type]
type Pat = [string, string, string | null, 'c' | 'v']

const PATTERNS: Pat[] = [
  // API ayn marker "AA" (ع) — produce آ standalone or nothing after consonant
  ['AA', 'আ', 'আ', 'v'],

  // Long vowels
  ['oo', 'ূ', 'ঊ', 'v'],
  ['uu', 'ূ', 'ঊ', 'v'],
  ['ee', 'ী', 'ঈ', 'v'],
  ['ii', 'ী', 'ঈ', 'v'],
  ['aa', 'া', 'আ', 'v'],

  // Consonant digraphs
  ['sh', 'শ', null, 'c'],
  ['kh', 'খ', null, 'c'],
  ['gh', 'গ', null, 'c'],
  ['th', 'ছ', null, 'c'],
  ['dh', 'য', null, 'c'],

  // Shadda (gemination) — doubled consonants → single Bangla
  ['ll', 'ল', null, 'c'],
  ['rr', 'র', null, 'c'],
  ['ss', 'স', null, 'c'],
  ['nn', 'ন', null, 'c'],
  ['mm', 'ম', null, 'c'],
  ['bb', 'ব', null, 'c'],
  ['tt', 'ত', null, 'c'],
  ['dd', 'দ', null, 'c'],
  ['ff', 'ফ', null, 'c'],
  ['qq', 'ক', null, 'c'],
  ['kk', 'ক', null, 'c'],
  ['jj', 'জ', null, 'c'],
  ['zz', 'য', null, 'c'],

  // Common short combinations
  ['wa', 'ওয়া', null, 'c'],
  ['ya', 'ইয়া', null, 'c'],
  ['al', 'আল', null, 'c'],

  // Single consonants
  ['b', 'ব', null, 'c'],
  ['c', 'ক', null, 'c'],
  ['d', 'দ', null, 'c'],
  ['f', 'ফ', null, 'c'],
  ['g', 'গ', null, 'c'],
  ['h', 'হ', null, 'c'],
  ['j', 'জ', null, 'c'],
  ['k', 'ক', null, 'c'],
  ['l', 'ল', null, 'c'],
  ['m', 'ম', null, 'c'],
  ['n', 'ন', null, 'c'],
  ['p', 'প', null, 'c'],
  ['q', 'ক', null, 'c'],
  ['r', 'র', null, 'c'],
  ['s', 'স', null, 'c'],
  ['t', 'ত', null, 'c'],
  ['v', 'ভ', null, 'c'],
  ['w', 'ও', null, 'c'],
  ['x', 'ক্স', null, 'c'],
  ['y', 'ই', null, 'c'],
  ['z', 'য', null, 'c'],

  // Short vowels (context-sensitive)
  ['a', 'া', 'আ', 'v'],
  ['i', 'ি', 'ই', 'v'],
  ['u', 'ু', 'উ', 'v'],
  ['e', 'ে', 'এ', 'v'],
  ['o', 'ো', 'ও', 'v'],
]

function convertLatinWord(word: string): string {
  const lower = word.toLowerCase()

  // 1. Whole-word map first
  if (WORD_MAP[lower]) return WORD_MAP[lower]

  // 2. Strip trailing punctuation remnants and retry
  const stripped = lower.replace(/[''`]+$/, '')
  if (stripped !== lower && WORD_MAP[stripped]) return WORD_MAP[stripped]

  // 3. Character-by-character conversion
  let result = ''
  let i = 0
  let prevWasConsonant = false

  while (i < lower.length) {
    const ch = lower[i]

    // Skip apostrophes / hamza / ayn markers
    if (ch === "'" || ch === '`' || ch === '‘' || ch === '’') {
      i++
      continue
    }

    let matched = false
    for (const [pat, afterCons, standalone, type] of PATTERNS) {
      if (lower.startsWith(pat, i)) {
        if (type === 'v') {
          result += prevWasConsonant ? afterCons : (standalone ?? afterCons)
          prevWasConsonant = false
        } else {
          result += afterCons
          prevWasConsonant = true
        }
        i += pat.length
        matched = true
        break
      }
    }

    if (!matched) {
      // Numbers, hyphens, etc. — pass through unchanged
      result += lower[i]
      prevWasConsonant = false
      i++
    }
  }

  return result
}

/**
 * Main export: convert Latin Arabic transliteration to Bangla script.
 * Leaves already-Bangla text (Bangla/Arabic Unicode ranges) untouched.
 */
export function latinToBangla(text: string): string {
  if (!text) return ''

  // If text has no Latin letters, it's already in non-Latin script — leave it
  if (!/[a-zA-Z]/.test(text)) return text

  // Handle "wa-" prefixes (API sometimes hyphenates: "wa-iyyaka")
  let s = text.replace(/\bwa-/gi, 'wa ')

  // Replace each Latin token (letters + apostrophes)
  s = s.replace(/[a-zA-Z''`]+/g, convertLatinWord)

  // Clean up any double spaces
  return s.replace(/  +/g, ' ').trim()
}
