# cyrillic-latin-transliteration

> Transliterate between Cyrillic and Latin scripts with locale-aware rules.  
> Supports 9 languages. Zero dependencies. TypeScript-first.

[![npm](https://img.shields.io/npm/v/cyrillic-latin-transliteration)](https://www.npmjs.com/package/cyrillic-latin-transliteration)
[![license](https://img.shields.io/npm/l/cyrillic-latin-transliteration)](./LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/MaxGrushevsky/cyrillic-latin-transliteration/ci.yml)](https://github.com/MaxGrushevsky/cyrillic-latin-transliteration/actions)

## Features

- Transliterates **all Cyrillic characters** from all supported languages — no unknown characters are silently dropped
- **Locale-aware rules**: Ukrainian Г → H, Russian Г → G; Bulgarian Щ → Sht, Russian Щ → Sch, etc.
- **9 supported languages**: Russian, Ukrainian, Belarusian, Bulgarian, Serbian, Macedonian, Kazakh, Kyrgyz, Mongolian
- Case-preserving — uppercase Cyrillic maps to uppercase Latin and back
- Non-Cyrillic / non-Latin characters are **passed through unchanged**
- Written in **TypeScript** — ships with full type declarations
- **Zero runtime dependencies**
- Works in Node.js, Deno, Bun, and modern browsers
- ESM + CommonJS dual build

## Install

```bash
npm install cyrillic-latin-transliteration
# or
pnpm add cyrillic-latin-transliteration
# or
yarn add cyrillic-latin-transliteration
```

## Usage

```ts
import { toLatin, toCyrillic } from 'cyrillic-latin-transliteration'

// Russian (default)
toLatin('Привет мир')               // 'Privet mir'
toCyrillic('Privet mir')            // 'Привет мир'

// Ukrainian
toLatin('Добрий день', { locale: 'uk' })     // 'Dobryj den'
toLatin('Харків', { locale: 'uk' })          // 'Kharkiv'
toCyrillic('Kharkiv', { locale: 'uk' })      // 'Харків'

// Bulgarian
toLatin('България', { locale: 'bg' })        // 'Balgariya'

// Serbian
toLatin('Добар дан', { locale: 'sr' })       // 'Dobar dan'
toLatin('Љубав', { locale: 'sr' })           // 'Ljubav'

// Kazakh
toLatin('Қазақстан', { locale: 'kk' })       // 'Qazaqstan'

// Non-Cyrillic characters pass through unchanged
toLatin('Привет, world!', { locale: 'uk' })  // 'Pryvit, world!'
```

CommonJS (require) is also supported:

```js
const { toLatin, toCyrillic } = require('cyrillic-latin-transliteration')
```

## API

### `toLatin(text: string, options?: TranslitOptions): string`

Converts a Cyrillic string to its Latin transliteration.

| Detail | Behaviour |
|---|---|
| Case | Uppercase Cyrillic maps to uppercase Latin, lowercase to lowercase |
| Unknown chars | Non-Cyrillic characters are **passed through unchanged** |
| Soft / hard signs | `ь` / `ъ` map to `''` (dropped) in Russian; Bulgarian `ъ` maps to `a` |
| Empty / non-string | Returns `''` |

### `toCyrillic(text: string, options?: TranslitOptions): string`

Converts a Latin transliteration back to Cyrillic.

| Detail | Behaviour |
|---|---|
| Greedy matching | Always tries the longest matching sequence first (5→4→3→2→1 chars) |
| Unknown chars | Non-Latin characters are **passed through unchanged** |
| Empty / non-string | Returns `''` |

### `TranslitOptions`

```ts
interface TranslitOptions {
  locale?: TranslitLocale
}

type TranslitLocale =
  | 'ru'  // Russian (default)
  | 'uk'  // Ukrainian
  | 'be'  // Belarusian
  | 'bg'  // Bulgarian
  | 'sr'  // Serbian
  | 'mk'  // Macedonian
  | 'kk'  // Kazakh
  | 'ky'  // Kyrgyz
  | 'mn'  // Mongolian
```

### `detectScript(text: string): 'cyrillic' | 'latin' | 'mixed' | 'unknown'`

Heuristically detects the dominant script in a string.

```ts
detectScript('Привет')        // 'cyrillic'
detectScript('Privet')        // 'latin'
detectScript('Привет, world') // 'mixed'
detectScript('123 !')         // 'unknown'
```

### `isCyrillic(text: string): boolean`

Returns `true` if the string is written in Cyrillic (ignoring digits and punctuation).

```ts
isCyrillic('Привет')         // true
isCyrillic('Привет, world')  // false
isCyrillic('Privet')         // false
```

## Locale differences

The same Cyrillic letter can sound (and therefore transliterate) differently across languages:

| Letter | `ru` | `uk` | `bg` | `sr` / `mk` |
|--------|------|------|------|-------------|
| Г г | G g | **H h** | G g | G g |
| Х х | H h | **Kh kh** | H h | H h |
| Щ щ | Sch sch | **Shch shch** | **Sht sht** | Sch sch |
| Ъ ъ | *(dropped)* | — | **A a** (vowel) | *(dropped)* |
| И и | I i | **Y y** | I i | I i |

## Supported characters

### Slavic alphabets

| Language | Unique letters | Latin |
|---|---|---|
| Ukrainian | І і | I i |
| Ukrainian | Ї ї | Yi yi |
| Ukrainian | Є є | Ye ye |
| Ukrainian | Ґ ґ | G g *(locale `uk`)* |
| Belarusian | Ў ў | W w |
| Serbian | Ђ ђ | Dj dj |
| Serbian | Ј ј | J j |
| Serbian | Љ љ | Lj lj |
| Serbian | Њ њ | Nj nj |
| Serbian | Ћ ћ | Tj tj |
| Serbian | Џ џ | Dzh dzh |
| Macedonian | Ѓ ѓ | Gj gj |
| Macedonian | Ѕ ѕ | Dz dz |
| Macedonian | Ќ ќ | Kj kj |

### Central Asian alphabets (Kazakh, Kyrgyz, Mongolian)

| Letter | Latin | Note |
|---|---|---|
| Ә ә | Ae ae | Front low vowel |
| Ғ ғ | Gh gh | Voiced velar fricative |
| Қ қ | Q q | Uvular stop |
| Ң ң | Ng ng | Velar nasal |
| Ө ө | Oe oe | Front rounded vowel (like German ö) |
| Ұ ұ | U u | Back unrounded vowel (Kazakh) |
| Ү ү | Ue ue | Front rounded vowel (like German ü) |
| Ҳ ҳ | H h | Pharyngeal H (Tajik/Uzbek) |
| Ҷ ҷ | Dj dj | Affricate (Tajik) |
| Ӣ ӣ | I i | Long I (Tajik) |
| Ӯ ӯ | Uu uu | Long U (Tajik) |

## Russian transliteration reference

| Cyrillic | Latin | | Cyrillic | Latin |
|---|---|---|---|---|
| А а | A a | | Р р | R r |
| Б б | B b | | С с | S s |
| В в | V v | | Т т | T t |
| Г г | G g | | У у | U u |
| Д д | D d | | Ф ф | F f |
| Е е | E e | | Х х | H h |
| Ё ё | Yo yo | | Ц ц | Ts ts |
| Ж ж | Zh zh | | Ч ч | Ch ch |
| З з | Z z | | Ш ш | Sh sh |
| И и | I i | | Щ щ | Sch sch |
| Й й | J j | | Ъ ъ | *(dropped)* |
| К к | K k | | Ы ы | Y y |
| Л л | L l | | Ь ь | *(dropped)* |
| М м | M m | | Э э | E e |
| Н н | N n | | Ю ю | Yu yu |
| О о | O o | | Я я | Ya ya |
| П п | P p | | | |

## Development

```bash
git clone https://github.com/MaxGrushevsky/cyrillic-latin-transliteration.git
cd cyrillic-latin-transliteration
npm install

npm run build         # compile to dist/
npm test              # run tests once
npm run test:watch    # run tests in watch mode
npm run typecheck     # TypeScript type-check only
```

## License

[MIT](./LICENSE)
