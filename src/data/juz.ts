export interface JuzInfo {
  number: number
  arabicName: string
  banglaName: string
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
  startSurahBangla: string
  endSurahBangla: string
  totalAyahs: number
}

export const JUZ_DATA: JuzInfo[] = [
  { number: 1,  arabicName: 'الم',           banglaName: 'আলিফ-লাম-মীম',     startSurah: 1,   startAyah: 1,   endSurah: 2,   endAyah: 141, startSurahBangla: 'আল-ফাতিহা',   endSurahBangla: 'আল-বাকারা',    totalAyahs: 148 },
  { number: 2,  arabicName: 'سَيَقُولُ',      banglaName: 'সায়াকুলু',          startSurah: 2,   startAyah: 142, endSurah: 2,   endAyah: 252, startSurahBangla: 'আল-বাকারা',   endSurahBangla: 'আল-বাকারা',    totalAyahs: 111 },
  { number: 3,  arabicName: 'تِلْكَ الرُّسُلُ', banglaName: 'তিলকার রুসুল',     startSurah: 2,   startAyah: 253, endSurah: 3,   endAyah: 92,  startSurahBangla: 'আল-বাকারা',   endSurahBangla: 'আলে-ইমরান',    totalAyahs: 92 },
  { number: 4,  arabicName: 'لَنْ تَنَالُوا',  banglaName: 'লান তানালু',        startSurah: 3,   startAyah: 93,  endSurah: 4,   endAyah: 23,  startSurahBangla: 'আলে-ইমরান',   endSurahBangla: 'আন-নিসা',      totalAyahs: 131 },
  { number: 5,  arabicName: 'وَالْمُحْصَنَاتُ', banglaName: 'ওয়ালমুহসানাত',    startSurah: 4,   startAyah: 24,  endSurah: 4,   endAyah: 147, startSurahBangla: 'আন-নিসা',     endSurahBangla: 'আন-নিসা',      totalAyahs: 124 },
  { number: 6,  arabicName: 'لَا يُحِبُّ اللَّه', banglaName: 'লা ইউহিব্বুল্লাহ', startSurah: 4, startAyah: 148, endSurah: 5,   endAyah: 81,  startSurahBangla: 'আন-নিসা',     endSurahBangla: 'আল-মায়িদা',    totalAyahs: 110 },
  { number: 7,  arabicName: 'وَإِذَا سَمِعُوا', banglaName: 'ওয়া ইযা সামিউ',   startSurah: 5,   startAyah: 82,  endSurah: 6,   endAyah: 110, startSurahBangla: 'আল-মায়িদা',  endSurahBangla: 'আল-আনআম',      totalAyahs: 149 },
  { number: 8,  arabicName: 'وَلَوْ أَنَّنَا',   banglaName: 'ওয়ালাও আন্নানা',  startSurah: 6,   startAyah: 111, endSurah: 7,   endAyah: 87,  startSurahBangla: 'আল-আনআম',     endSurahBangla: 'আল-আরাফ',      totalAyahs: 142 },
  { number: 9,  arabicName: 'قَالَ الْمَلَأُ',  banglaName: 'কালাল মালাউ',      startSurah: 7,   startAyah: 88,  endSurah: 8,   endAyah: 40,  startSurahBangla: 'আল-আরাফ',     endSurahBangla: 'আল-আনফাল',     totalAyahs: 127 },
  { number: 10, arabicName: 'وَاعْلَمُوا',      banglaName: 'ওয়া-লামু',         startSurah: 8,   startAyah: 41,  endSurah: 9,   endAyah: 92,  startSurahBangla: 'আল-আনফাল',   endSurahBangla: 'আত-তাওবা',     totalAyahs: 87 },
  { number: 11, arabicName: 'يَعْتَذِرُونَ',    banglaName: 'ইয়াতাযিরুন',      startSurah: 9,   startAyah: 93,  endSurah: 11,  endAyah: 5,   startSurahBangla: 'আত-তাওবা',    endSurahBangla: 'হুদ',           totalAyahs: 151 },
  { number: 12, arabicName: 'وَمَا مِنْ دَابَّة', banglaName: 'ওয়ামা মিন দাব্বা', startSurah: 11, startAyah: 6,   endSurah: 12,  endAyah: 52,  startSurahBangla: 'হুদ',          endSurahBangla: 'ইউসুফ',         totalAyahs: 170 },
  { number: 13, arabicName: 'وَمَا أُبَرِّئُ',  banglaName: 'ওয়ামা উবাররিউ',   startSurah: 12,  startAyah: 53,  endSurah: 14,  endAyah: 52,  startSurahBangla: 'ইউসুফ',       endSurahBangla: 'ইবরাহীম',       totalAyahs: 154 },
  { number: 14, arabicName: 'رُبَمَا',          banglaName: 'রুবামা',            startSurah: 15,  startAyah: 1,   endSurah: 16,  endAyah: 128, startSurahBangla: 'আল-হিজর',     endSurahBangla: 'আন-নাহল',      totalAyahs: 227 },
  { number: 15, arabicName: 'سُبْحَانَ الَّذِي', banglaName: 'সুবহানাল্লাযি',   startSurah: 17,  startAyah: 1,   endSurah: 18,  endAyah: 74,  startSurahBangla: 'আল-ইসরা',     endSurahBangla: 'আল-কাহফ',      totalAyahs: 185 },
  { number: 16, arabicName: 'قَالَ أَلَمْ',     banglaName: 'কালা আলাম',         startSurah: 18,  startAyah: 75,  endSurah: 20,  endAyah: 135, startSurahBangla: 'আল-কাহফ',     endSurahBangla: 'ত্বা-হা',       totalAyahs: 196 },
  { number: 17, arabicName: 'اقْتَرَبَ',        banglaName: 'ইকতারাবা',          startSurah: 21,  startAyah: 1,   endSurah: 22,  endAyah: 78,  startSurahBangla: 'আল-আম্বিয়া', endSurahBangla: 'আল-হাজ্জ',     totalAyahs: 190 },
  { number: 18, arabicName: 'قَدْ أَفْلَحَ',    banglaName: 'কাদ আফলাহা',        startSurah: 23,  startAyah: 1,   endSurah: 25,  endAyah: 20,  startSurahBangla: 'আল-মুমিনুন',  endSurahBangla: 'আল-ফুরকান',    totalAyahs: 202 },
  { number: 19, arabicName: 'وَقَالَ الَّذِينَ', banglaName: 'ওয়া কালাল্লাযিনা', startSurah: 25, startAyah: 21,  endSurah: 27,  endAyah: 55,  startSurahBangla: 'আল-ফুরকান',   endSurahBangla: 'আন-নামল',      totalAyahs: 167 },
  { number: 20, arabicName: 'أَمَّنْ خَلَقَ',   banglaName: 'আম্মান খালাকা',    startSurah: 27,  startAyah: 56,  endSurah: 29,  endAyah: 45,  startSurahBangla: 'আন-নামল',     endSurahBangla: 'আল-আনকাবুত',   totalAyahs: 172 },
  { number: 21, arabicName: 'اتْلُ مَا أُوحِيَ', banglaName: 'উতলু মা উহিয়া',  startSurah: 29,  startAyah: 46,  endSurah: 33,  endAyah: 30,  startSurahBangla: 'আল-আনকাবুত',  endSurahBangla: 'আল-আহযাব',     totalAyahs: 180 },
  { number: 22, arabicName: 'وَمَنْ يَقْنُتْ',  banglaName: 'ওয়া মান ইয়াকনুত', startSurah: 33,  startAyah: 31,  endSurah: 36,  endAyah: 27,  startSurahBangla: 'আল-আহযাব',   endSurahBangla: 'ইয়াসীন',       totalAyahs: 171 },
  { number: 23, arabicName: 'وَمَا لِيَ',       banglaName: 'ওয়ামা লিয়া',      startSurah: 36,  startAyah: 28,  endSurah: 39,  endAyah: 31,  startSurahBangla: 'ইয়াসীন',     endSurahBangla: 'আয-যুমার',      totalAyahs: 357 },
  { number: 24, arabicName: 'فَمَنْ أَظْلَمُ',  banglaName: 'ফামান আযলামু',     startSurah: 39,  startAyah: 32,  endSurah: 41,  endAyah: 46,  startSurahBangla: 'আয-যুমার',    endSurahBangla: 'ফুসসিলাত',      totalAyahs: 176 },
  { number: 25, arabicName: 'إِلَيْهِ يُرَدُّ', banglaName: 'ইলাইহি ইউরাদ্দু', startSurah: 41,  startAyah: 47,  endSurah: 45,  endAyah: 37,  startSurahBangla: 'ফুসসিলাত',    endSurahBangla: 'আল-জাসিয়া',    totalAyahs: 246 },
  { number: 26, arabicName: 'حم',               banglaName: 'হা-মীম',            startSurah: 46,  startAyah: 1,   endSurah: 51,  endAyah: 30,  startSurahBangla: 'আল-আহকাফ',   endSurahBangla: 'আয-যারিয়াত',   totalAyahs: 195 },
  { number: 27, arabicName: 'قَالَ فَمَا خَطْبُكُمْ', banglaName: 'কালা ফামা খাতবুকুম', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, startSurahBangla: 'আয-যারিয়াত', endSurahBangla: 'আল-হাদীদ',     totalAyahs: 203 },
  { number: 28, arabicName: 'قَدْ سَمِعَ اللَّه', banglaName: 'কাদ সামিয়াল্লাহ', startSurah: 58, startAyah: 1,   endSurah: 66,  endAyah: 12,  startSurahBangla: 'আল-মুজাদিলা', endSurahBangla: 'আত-তাহরীম',    totalAyahs: 137 },
  { number: 29, arabicName: 'تَبَارَكَ الَّذِي', banglaName: 'তাবারাকাল্লাযি',  startSurah: 67,  startAyah: 1,   endSurah: 77,  endAyah: 50,  startSurahBangla: 'আল-মুলক',     endSurahBangla: 'আল-মুরসালাত',  totalAyahs: 431 },
  { number: 30, arabicName: 'عَمَّ يَتَسَاءَلُونَ', banglaName: 'আম্মা ইয়াতাসায়ালুন', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, startSurahBangla: 'আন-নাবা',     endSurahBangla: 'আন-নাস',        totalAyahs: 564 },
]
