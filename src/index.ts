/**
 * Transliterate between Cyrillic and Latin scripts.
 * Supports Russian, Ukrainian, Belarusian, Bulgarian, Serbian,
 * Macedonian, Kazakh, Kyrgyz, and Mongolian alphabets.
 * Zero dependencies.
 */

/** Supported locale codes. */
export type TranslitLocale =
  | 'ru' // Russian
  | 'uk' // Ukrainian
  | 'be' // Belarusian
  | 'bg' // Bulgarian
  | 'sr' // Serbian
  | 'mk' // Macedonian
  | 'kk' // Kazakh
  | 'ky' // Kyrgyz
  | 'mn' // Mongolian

export interface TranslitOptions {
  /**
   * Locale for language-specific transliteration rules.
   *
   * Letters pronounced differently across languages
   * (e.g. Ukrainian Г → H, Russian Г → G) are handled
   * correctly when the appropriate locale is specified.
   *
   * Defaults to Russian (`'ru'`) rules when omitted.
   */
  locale?: TranslitLocale
}

// ─── Cyrillic → Latin ────────────────────────────────────────────────────────

/**
 * Base Cyrillic → Latin table using Russian defaults.
 * Covers all Slavic Cyrillic alphabets plus Central Asian scripts.
 */
const BASE_TO_LATIN: Record<string, string> = {
  // ── Russian / Common Slavic ─────────────────────────────────────────────
  'А': 'A',   'а': 'a',   'Б': 'B',   'б': 'b',
  'В': 'V',   'в': 'v',   'Г': 'G',   'г': 'g',
  'Д': 'D',   'д': 'd',   'Е': 'E',   'е': 'e',
  'Ё': 'Yo',  'ё': 'yo',  'Ж': 'Zh',  'ж': 'zh',
  'З': 'Z',   'з': 'z',   'И': 'I',   'и': 'i',
  'Й': 'J',   'й': 'j',   'К': 'K',   'к': 'k',
  'Л': 'L',   'л': 'l',   'М': 'M',   'м': 'm',
  'Н': 'N',   'н': 'n',   'О': 'O',   'о': 'o',
  'П': 'P',   'п': 'p',   'Р': 'R',   'р': 'r',
  'С': 'S',   'с': 's',   'Т': 'T',   'т': 't',
  'У': 'U',   'у': 'u',   'Ф': 'F',   'ф': 'f',
  'Х': 'H',   'х': 'h',   'Ц': 'Ts',  'ц': 'ts',
  'Ч': 'Ch',  'ч': 'ch',  'Ш': 'Sh',  'ш': 'sh',
  'Щ': 'Sch', 'щ': 'sch', 'Ъ': '',    'ъ': '',
  'Ы': 'Y',   'ы': 'y',   'Ь': '',    'ь': '',
  'Э': 'E',   'э': 'e',   'Ю': 'Yu',  'ю': 'yu',
  'Я': 'Ya',  'я': 'ya',

  // ── Ukrainian ────────────────────────────────────────────────────────────
  // І/і: Ukrainian І (sounds like Russian И)
  // Ї/ї: sounds like "yi"
  // Є/є: sounds like "ye"
  // Ґ/ґ: hard G (distinct from Г which in Ukrainian = H)
  'І': 'I',   'і': 'i',   'Ї': 'Yi',  'ї': 'yi',
  'Є': 'Ye',  'є': 'ye',  'Ґ': 'G',   'ґ': 'g',

  // ── Belarusian ───────────────────────────────────────────────────────────
  // Ў/ў: short U, sounds like English "w"
  'Ў': 'W',   'ў': 'w',

  // ── Serbian ──────────────────────────────────────────────────────────────
  'Ђ': 'Dj',  'ђ': 'dj',  'Ј': 'J',   'ј': 'j',
  'Љ': 'Lj',  'љ': 'lj',  'Њ': 'Nj',  'њ': 'nj',
  // Ћ sounds like soft Ch/Tj; using Tj to distinguish from Ч = Ch
  'Ћ': 'Tj',  'ћ': 'tj',
  'Џ': 'Dzh', 'џ': 'dzh',

  // ── Macedonian ───────────────────────────────────────────────────────────
  'Ѓ': 'Gj',  'ѓ': 'gj',  'Ѕ': 'Dz',  'ѕ': 'dz',
  'Ќ': 'Kj',  'ќ': 'kj',

  // ── Kazakh / Kyrgyz / Mongolian ──────────────────────────────────────────
  'Ә': 'Ae',  'ә': 'ae',  'Ғ': 'Gh',  'ғ': 'gh',
  'Қ': 'Q',   'қ': 'q',   'Ң': 'Ng',  'ң': 'ng',
  // Ө: back rounded vowel (like German ö); Oe to distinguish from О
  'Ө': 'Oe',  'ө': 'oe',
  // Ұ: Kazakh (similar to У but unrounded); shares U with У
  'Ұ': 'U',   'ұ': 'u',
  // Ү: Kazakh/Kyrgyz/Mongolian (like German ü); Ue to distinguish from У
  'Ү': 'Ue',  'ү': 'ue',

  // ── Central Asian / Tajik ────────────────────────────────────────────────
  // Ҳ: Uzbek/Tajik H (pharyngeal); H to distinguish from Х
  'Ҳ': 'H',   'ҳ': 'h',
  // Ҷ: Tajik J/Dj sound
  'Ҷ': 'Dj',  'ҷ': 'dj',
  // Ӣ: Tajik long I
  'Ӣ': 'I',   'ӣ': 'i',
  // Ӯ: Tajik long U; Uu to distinguish from У
  'Ӯ': 'Uu',  'ӯ': 'uu',
}

/** Locale-specific overrides applied on top of BASE_TO_LATIN. */
const LOCALE_TO_LATIN: Partial<Record<TranslitLocale, Record<string, string>>> = {
  uk: {
    // Ukrainian Г is a voiced H (unlike Russian Г = hard G)
    'Г': 'H',    'г': 'h',
    // Ukrainian Ґ is the hard G (distinct phoneme from Г)
    'Ґ': 'G',    'ґ': 'g',
    // Ukrainian standard romanization: Х → Kh
    'Х': 'Kh',   'х': 'kh',
    // Ukrainian: Щ = Shch (not Sch as in Russian)
    'Щ': 'Shch', 'щ': 'shch',
    // Ukrainian И sounds like Russian Ы (a back unrounded vowel) → Y
    'И': 'Y',    'и': 'y',
  },
  be: {
    // Belarusian national standard: Х → Kh
    'Х': 'Kh',   'х': 'kh',
  },
  bg: {
    // Bulgarian Щ is pronounced Sht (not Sch)
    'Щ': 'Sht',  'щ': 'sht',
    // Bulgarian Ъ is a full mid-central vowel /ɐ/ (not a silent hard sign)
    'Ъ': 'A',    'ъ': 'a',
    // Bulgarian Х sounds like English H
    'Х': 'H',    'х': 'h',
  },
}

// ─── Latin → Cyrillic ────────────────────────────────────────────────────────

/**
 * Base Latin → Cyrillic table — Russian letters only.
 *
 * Only sequences that are unambiguously Russian are here.
 * Language-specific multi-char sequences (ng, ae, lj, dzh, etc.)
 * are kept in locale tables to avoid collisions with Russian letter
 * combinations (нг→ng, аэ→ae, дж→dzh, дз→dz, etc.).
 *
 * 'q'/'Q' and 'w'/'W' are safe in the base because Russian/Ukrainian
 * transliteration never produces those characters.
 */
const BASE_TO_CYRILLIC: Record<string, string> = {
  // ── Core Russian sequences ─────────────────────────────────────────────
  'a': 'а',   'b': 'б',   'v': 'в',   'g': 'г',   'd': 'д',
  'e': 'е',   'yo': 'ё',  'zh': 'ж',  'z': 'з',   'i': 'и',
  'j': 'й',   'k': 'к',   'l': 'л',   'm': 'м',   'n': 'н',
  'o': 'о',   'p': 'п',   'r': 'р',   's': 'с',   't': 'т',
  'u': 'у',   'f': 'ф',   'h': 'х',   'ts': 'ц',  'ch': 'ч',
  'shch': 'щ','sh': 'ш',  'sch': 'щ', 'yu': 'ю',  'ya': 'я',  'y': 'ы',
  // 'q' → Қ and 'w' → Ў are safe (never appear in Russian transliteration output)
  'q': 'қ',   'w': 'ў',
  // ── Uppercase ─────────────────────────────────────────────────────────
  'A': 'А',   'B': 'Б',   'V': 'В',   'G': 'Г',   'D': 'Д',
  'E': 'Е',   'Yo': 'Ё',  'Zh': 'Ж',  'Z': 'З',   'I': 'И',
  'J': 'Й',   'K': 'К',   'L': 'Л',   'M': 'М',   'N': 'Н',
  'O': 'О',   'P': 'П',   'R': 'Р',   'S': 'С',   'T': 'Т',
  'U': 'У',   'F': 'Ф',   'H': 'Х',   'Ts': 'Ц',  'Ch': 'Ч',
  'Shch': 'Щ','Sh': 'Ш',  'Sch': 'Щ', 'Yu': 'Ю',  'Ya': 'Я',  'Y': 'Ы',
  'Q': 'Қ',   'W': 'Ў',
}

/** Locale-specific overrides applied on top of BASE_TO_CYRILLIC. */
const LOCALE_TO_CYRILLIC: Partial<Record<TranslitLocale, Record<string, string>>> = {
  uk: {
    // h/H → Г/г  (Ukrainian Г = voiced H)
    'h': 'г',      'H': 'Г',
    // kh/Kh → Х/х
    'kh': 'х',     'Kh': 'Х',
    // g/G → Ґ/ґ  (hard G; Г = H in Ukrainian)
    'g': 'ґ',      'G': 'Ґ',
    // shch/Shch → Щ/щ
    'shch': 'щ',   'Shch': 'Щ',
    'sch': 'щ',    'Sch': 'Щ',  // compatibility alias
    // i/I → І/і  (Ukrainian І, not Russian И)
    'i': 'і',      'I': 'І',
    // yi/Yi → Ї/ї
    'yi': 'ї',     'Yi': 'Ї',
    // ye/Ye → Є/є
    'ye': 'є',     'Ye': 'Є',
    // y/Y → И/и  (Ukrainian И = Y sound, like Russian Ы)
    'y': 'и',      'Y': 'И',
    // yo/Yo → йо (Ukrainian has no Ё; yo = й + о)
    'yo': 'йо',    'Yo': 'Йо',
  },
  be: {
    // kh → Х  (Belarusian national standard)
    'kh': 'х',     'Kh': 'Х',
    'h': 'х',      'H': 'Х',
    // w/W → Ў/ў (already in base as safe, but explicit here for clarity)
    'w': 'ў',      'W': 'Ў',
    // i/I → І/і  (Belarusian І)
    'i': 'і',      'I': 'І',
  },
  bg: {
    // sht/Sht → Щ/щ (Bulgarian pronunciation)
    'sht': 'щ',    'Sht': 'Щ',
    // Bulgarian doesn't distinguish А from Ъ in reverse; leave 'a' → 'а'
  },
  sr: {
    // Serbian-specific digraphs
    'lj': 'љ',   'Lj': 'Љ',
    'nj': 'њ',   'Nj': 'Њ',
    'dj': 'ђ',   'Dj': 'Ђ',
    'tj': 'ћ',   'Tj': 'Ћ',
    'dzh': 'џ',  'Dzh': 'Џ',
  },
  mk: {
    // Macedonian includes Serbian digraphs plus its own
    'lj': 'љ',   'Lj': 'Љ',
    'nj': 'њ',   'Nj': 'Њ',
    'dj': 'ђ',   'Dj': 'Ђ',
    'tj': 'ћ',   'Tj': 'Ћ',
    'dzh': 'џ',  'Dzh': 'Џ',
    'gj': 'ѓ',   'Gj': 'Ѓ',
    'dz': 'ѕ',   'Dz': 'Ѕ',
    'kj': 'ќ',   'Kj': 'Ќ',
  },
  kk: {
    // Kazakh-specific sequences
    'ae': 'ә',   'Ae': 'Ә',
    'gh': 'ғ',   'Gh': 'Ғ',
    'ng': 'ң',   'Ng': 'Ң',
    'oe': 'ө',   'Oe': 'Ө',
    'ue': 'ү',   'Ue': 'Ү',
  },
  ky: {
    // Kyrgyz (same Central Asian sequences as Kazakh)
    'ae': 'ә',   'Ae': 'Ә',
    'gh': 'ғ',   'Gh': 'Ғ',
    'ng': 'ң',   'Ng': 'Ң',
    'oe': 'ө',   'Oe': 'Ө',
    'ue': 'ү',   'Ue': 'Ү',
  },
  mn: {
    // Mongolian uses Ө and Ү
    'oe': 'ө',   'Oe': 'Ө',
    'ue': 'ү',   'Ue': 'Ү',
  },
}

// ─── Table cache ─────────────────────────────────────────────────────────────

const toLatinTableCache = new Map<string, Record<string, string>>()
const toCyrillicTableCache = new Map<string, Record<string, string>>()

function getToLatinTable(locale?: TranslitLocale): Record<string, string> {
  const key = locale ?? 'ru'
  if (toLatinTableCache.has(key)) return toLatinTableCache.get(key)!
  const overrides = (locale && LOCALE_TO_LATIN[locale]) ?? {}
  const table = Object.assign({}, BASE_TO_LATIN, overrides)
  toLatinTableCache.set(key, table)
  return table
}

function getToCyrillicTable(locale?: TranslitLocale): Record<string, string> {
  const key = locale ?? 'ru'
  if (toCyrillicTableCache.has(key)) return toCyrillicTableCache.get(key)!
  const overrides = (locale && LOCALE_TO_CYRILLIC[locale]) ?? {}
  const table = Object.assign({}, BASE_TO_CYRILLIC, overrides)
  toCyrillicTableCache.set(key, table)
  return table
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convert Cyrillic text to Latin transliteration.
 *
 * - Non-Cyrillic characters are passed through unchanged.
 * - Returns `''` for empty or non-string input.
 * - Uses Russian rules by default; pass `{ locale }` for other languages.
 *
 * @example
 * toLatin('Привет мир')              // 'Privet mir'
 * toLatin('Привіт світ', { locale: 'uk' }) // 'Pryvit svit'
 * toLatin('Добрий день', { locale: 'uk' }) // 'Dobryj den'
 */
export function toLatin(text: string, options?: TranslitOptions): string {
  if (!text || typeof text !== 'string') return ''
  const table = getToLatinTable(options?.locale)
  let output = ''
  for (let i = 0; i < text.length; i++) {
    const c4 = text.substring(i, i + 4)
    const c3 = text.substring(i, i + 3)
    const c2 = text.substring(i, i + 2)
    if (table[c4] !== undefined) {
      output += table[c4]
      i += 3
    } else if (table[c3] !== undefined) {
      output += table[c3]
      i += 2
    } else if (table[c2] !== undefined) {
      output += table[c2]
      i += 1
    } else {
      const mapped = table[text[i]]
      output += mapped !== undefined ? mapped : text[i]
    }
  }
  return output
}

/**
 * Convert Latin transliteration back to Cyrillic text.
 *
 * - Non-Latin characters are passed through unchanged.
 * - Returns `''` for empty or non-string input.
 * - Uses Russian rules by default; pass `{ locale }` for other languages.
 *
 * @example
 * toCyrillic('Privet mir')                      // 'Привет мир'
 * toCyrillic('Pryvit svit', { locale: 'uk' })   // 'Привіт світ'
 */
export function toCyrillic(text: string, options?: TranslitOptions): string {
  if (!text || typeof text !== 'string') return ''
  const table = getToCyrillicTable(options?.locale)
  let output = ''
  let i = 0
  while (i < text.length) {
    const c5 = text.substring(i, i + 5)
    const c4 = text.substring(i, i + 4)
    const c3 = text.substring(i, i + 3)
    const c2 = text.substring(i, i + 2)
    if (table[c5] !== undefined) {
      output += table[c5]
      i += 5
    } else if (table[c4] !== undefined) {
      output += table[c4]
      i += 4
    } else if (table[c3] !== undefined) {
      output += table[c3]
      i += 3
    } else if (table[c2] !== undefined) {
      output += table[c2]
      i += 2
    } else {
      const mapped = table[text[i]]
      output += mapped !== undefined ? mapped : text[i]
      i++
    }
  }
  return output
}
