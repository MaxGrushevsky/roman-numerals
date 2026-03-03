import { describe, it, expect } from 'vitest'
import { toLatin, toCyrillic } from './index'

// ─────────────────────────────────────────────────────────────────────────────
// Russian (default)
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Russian (default)', () => {
  it('converts a simple phrase', () => {
    expect(toLatin('Привет мир')).toBe('Privet mir')
  })

  it('converts full lowercase Russian alphabet', () => {
    expect(toLatin('абвгдеёжзийклмнопрстуфхцчшщъыьэюя'))
      .toBe('abvgdeyozhzijklmnoprstufhtschshschyeyuya')
  })

  it('converts full uppercase Russian alphabet', () => {
    expect(toLatin('АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'))
      .toBe('ABVGDEYoZhZIJKLMNOPRSTUFHTsChShSchYEYuYa')
  })

  it('passes through non-Cyrillic characters', () => {
    expect(toLatin('123 !')).toBe('123 !')
  })

  it('returns empty string for empty input', () => {
    expect(toLatin('')).toBe('')
  })

  it('returns empty string for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(toLatin(null)).toBe('')
  })
})

describe('toCyrillic — Russian (default)', () => {
  it('converts a simple word', () => {
    expect(toCyrillic('Privet')).toBe('Привет')
  })

  it('converts a phrase with spaces', () => {
    expect(toCyrillic('Privet mir')).toBe('Привет мир')
  })

  it('handles sch → щ', () => {
    expect(toCyrillic('Schyorst')).toBe('Щёрст')
  })

  it('handles shch → щ (alternative spelling)', () => {
    expect(toCyrillic('shch')).toBe('щ')
    expect(toCyrillic('Shch')).toBe('Щ')
  })

  it('maps y to ы', () => {
    expect(toCyrillic('my')).toBe('мы')
    expect(toCyrillic('Krym')).toBe('Крым')
  })

  it('passes through non-Latin characters', () => {
    expect(toCyrillic('123 ! Привет')).toBe('123 ! Привет')
  })

  it('returns empty string for empty input', () => {
    expect(toCyrillic('')).toBe('')
  })
})

describe('round-trip — Russian', () => {
  const cases = ['Привет, мир!', 'мы', 'Крым', 'май', 'мой', 'йога']
  for (const text of cases) {
    it(`"${text}"`, () => {
      expect(toCyrillic(toLatin(text))).toBe(text)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Ukrainian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Ukrainian (uk)', () => {
  const opts = { locale: 'uk' as const }

  it('Г → H (voiced H in Ukrainian)', () => {
    expect(toLatin('Г', opts)).toBe('H')
    expect(toLatin('г', opts)).toBe('h')
  })

  it('Ґ → G (hard G)', () => {
    expect(toLatin('Ґ', opts)).toBe('G')
    expect(toLatin('ґ', opts)).toBe('g')
  })

  it('Х → Kh', () => {
    expect(toLatin('Х', opts)).toBe('Kh')
    expect(toLatin('х', opts)).toBe('kh')
  })

  it('Щ → Shch', () => {
    expect(toLatin('Щ', opts)).toBe('Shch')
    expect(toLatin('щ', opts)).toBe('shch')
  })

  it('Ukrainian И → Y (sounds like Russian Ы)', () => {
    expect(toLatin('И', opts)).toBe('Y')
    expect(toLatin('и', opts)).toBe('y')
  })

  it('Ukrainian І → I', () => {
    expect(toLatin('І', opts)).toBe('I')
    expect(toLatin('і', opts)).toBe('i')
  })

  it('Ї → Yi', () => {
    expect(toLatin('Ї', opts)).toBe('Yi')
    expect(toLatin('ї', opts)).toBe('yi')
  })

  it('Є → Ye', () => {
    expect(toLatin('Є', opts)).toBe('Ye')
    expect(toLatin('є', opts)).toBe('ye')
  })

  it('converts a Ukrainian phrase', () => {
    expect(toLatin('Привіт світ', opts)).toBe('Pryvit svit')
  })

  it('converts "Київ"', () => {
    // К=K, и=y, ї=yi, в=v → Kyyiv
    // (context-free mapping; internationally "Kyiv" uses a simplified form)
    expect(toLatin('Київ', opts)).toBe('Kyyiv')
  })
})

describe('toCyrillic — Ukrainian (uk)', () => {
  const opts = { locale: 'uk' as const }

  it('h → Г', () => {
    expect(toCyrillic('h', opts)).toBe('г')
    expect(toCyrillic('H', opts)).toBe('Г')
  })

  it('kh → Х', () => {
    expect(toCyrillic('kh', opts)).toBe('х')
    expect(toCyrillic('Kh', opts)).toBe('Х')
  })

  it('g → Ґ', () => {
    expect(toCyrillic('g', opts)).toBe('ґ')
    expect(toCyrillic('G', opts)).toBe('Ґ')
  })

  it('shch → Щ', () => {
    expect(toCyrillic('shch', opts)).toBe('щ')
    expect(toCyrillic('Shch', opts)).toBe('Щ')
  })

  it('i → І (Ukrainian І)', () => {
    expect(toCyrillic('i', opts)).toBe('і')
    expect(toCyrillic('I', opts)).toBe('І')
  })

  it('yi → Ї', () => {
    expect(toCyrillic('yi', opts)).toBe('ї')
    expect(toCyrillic('Yi', opts)).toBe('Ї')
  })

  it('ye → Є', () => {
    expect(toCyrillic('ye', opts)).toBe('є')
    expect(toCyrillic('Ye', opts)).toBe('Є')
  })

  it('y → И (Ukrainian и = Y sound)', () => {
    expect(toCyrillic('y', opts)).toBe('и')
    expect(toCyrillic('Y', opts)).toBe('И')
  })

  it('round-trips "Київ"', () => {
    const opts = { locale: 'uk' as const }
    expect(toCyrillic(toLatin('Київ', opts), opts)).toBe('Київ')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Belarusian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Belarusian (be)', () => {
  const opts = { locale: 'be' as const }

  it('Ў → W', () => {
    expect(toLatin('Ў', opts)).toBe('W')
    expect(toLatin('ў', opts)).toBe('w')
  })

  it('Х → Kh', () => {
    expect(toLatin('Х', opts)).toBe('Kh')
  })

  it('converts a Belarusian phrase', () => {
    // д=d, о=o, б=b, р=r, ы=y (same as Russian default in be locale)
    // д=d, з=z, е=e, н=n, ь='' → dzen
    expect(toLatin('Добры дзень', opts)).toBe('Dobry dzen')
  })
})

describe('toCyrillic — Belarusian (be)', () => {
  const opts = { locale: 'be' as const }

  it('w → ў', () => {
    expect(toCyrillic('w', opts)).toBe('ў')
    expect(toCyrillic('W', opts)).toBe('Ў')
  })

  it('kh → х', () => {
    expect(toCyrillic('kh', opts)).toBe('х')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Bulgarian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Bulgarian (bg)', () => {
  const opts = { locale: 'bg' as const }

  it('Щ → Sht (Bulgarian pronunciation)', () => {
    expect(toLatin('Щ', opts)).toBe('Sht')
    expect(toLatin('щ', opts)).toBe('sht')
  })

  it('Ъ → A (Bulgarian vowel, not silent hard sign)', () => {
    expect(toLatin('Ъ', opts)).toBe('A')
    expect(toLatin('ъ', opts)).toBe('a')
  })

  it('Х → H', () => {
    expect(toLatin('Х', opts)).toBe('H')
  })

  it('converts a Bulgarian word', () => {
    expect(toLatin('България', opts)).toBe('Balgariya')
  })
})

describe('toCyrillic — Bulgarian (bg)', () => {
  const opts = { locale: 'bg' as const }

  it('sht → Щ', () => {
    expect(toCyrillic('sht', opts)).toBe('щ')
    expect(toCyrillic('Sht', opts)).toBe('Щ')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Serbian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Serbian (sr)', () => {
  const opts = { locale: 'sr' as const }

  it('converts Serbian-specific letters', () => {
    expect(toLatin('Ђ', opts)).toBe('Dj')
    expect(toLatin('ђ', opts)).toBe('dj')
    expect(toLatin('Љ', opts)).toBe('Lj')
    expect(toLatin('љ', opts)).toBe('lj')
    expect(toLatin('Њ', opts)).toBe('Nj')
    expect(toLatin('њ', opts)).toBe('nj')
    expect(toLatin('Ћ', opts)).toBe('Tj')
    expect(toLatin('ћ', opts)).toBe('tj')
    expect(toLatin('Џ', opts)).toBe('Dzh')
    expect(toLatin('џ', opts)).toBe('dzh')
    expect(toLatin('Ј', opts)).toBe('J')
    expect(toLatin('ј', opts)).toBe('j')
  })

  it('converts a Serbian phrase', () => {
    expect(toLatin('Добар дан', opts)).toBe('Dobar dan')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Macedonian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Macedonian (mk)', () => {
  const opts = { locale: 'mk' as const }

  it('converts Macedonian-specific letters', () => {
    expect(toLatin('Ѓ', opts)).toBe('Gj')
    expect(toLatin('ѓ', opts)).toBe('gj')
    expect(toLatin('Ѕ', opts)).toBe('Dz')
    expect(toLatin('ѕ', opts)).toBe('dz')
    expect(toLatin('Ќ', opts)).toBe('Kj')
    expect(toLatin('ќ', opts)).toBe('kj')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Kazakh / Kyrgyz / Mongolian
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — Kazakh (kk)', () => {
  const opts = { locale: 'kk' as const }

  it('converts Kazakh-specific letters', () => {
    expect(toLatin('Ә', opts)).toBe('Ae')
    expect(toLatin('ә', opts)).toBe('ae')
    expect(toLatin('Ғ', opts)).toBe('Gh')
    expect(toLatin('ғ', opts)).toBe('gh')
    expect(toLatin('Қ', opts)).toBe('Q')
    expect(toLatin('қ', opts)).toBe('q')
    expect(toLatin('Ң', opts)).toBe('Ng')
    expect(toLatin('ң', opts)).toBe('ng')
    expect(toLatin('Ө', opts)).toBe('Oe')
    expect(toLatin('ө', opts)).toBe('oe')
    expect(toLatin('Ү', opts)).toBe('Ue')
    expect(toLatin('ү', opts)).toBe('ue')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Universal: base table covers all new letters without locale
// ─────────────────────────────────────────────────────────────────────────────

describe('toLatin — universal (no locale)', () => {
  it('handles Ukrainian letters with base Russian-style rules', () => {
    expect(toLatin('Ї')).toBe('Yi')
    expect(toLatin('Є')).toBe('Ye')
    expect(toLatin('І')).toBe('I')
  })

  it('handles Serbian letters', () => {
    expect(toLatin('Љ')).toBe('Lj')
    expect(toLatin('Њ')).toBe('Nj')
    expect(toLatin('Џ')).toBe('Dzh')
  })

  it('handles Central Asian letters', () => {
    expect(toLatin('Ң')).toBe('Ng')
    expect(toLatin('Ө')).toBe('Oe')
    expect(toLatin('Ү')).toBe('Ue')
    expect(toLatin('Ғ')).toBe('Gh')
    expect(toLatin('Қ')).toBe('Q')
  })

  it('handles Belarusian Ў', () => {
    expect(toLatin('Ў')).toBe('W')
    expect(toLatin('ў')).toBe('w')
  })
})
