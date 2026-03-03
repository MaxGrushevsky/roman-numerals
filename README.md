# cyrillic-latin-transliteration

Transliterate between Cyrillic and Latin scripts (Russian alphabet, including `Ё/ё`). Zero dependencies.

## Install

```bash
npm install cyrillic-latin-transliteration
```

## Usage

```ts
import { toLatin, toCyrillic } from 'cyrillic-latin-transliteration'

toLatin('Привет мир')  // 'Privet mir'
toCyrillic('Privet')   // 'Привет'

// Mixed text is preserved
toLatin('Привет, world!') // 'Privet, world!'

// Round-trip for simple phrases
const original = 'Привет, мир!'
toCyrillic(toLatin(original)) // 'Привет, мир!'
```

## Module format

This package is **ESM-only** (`"type": "module"` in `package.json`).  
Use `import` syntax in Node.js and bundlers. If you need to use it from CommonJS, import it via dynamic `import()` or a compatible tooling setup.

## API

- **`toLatin(cyrillic: string): string`** — Cyrillic → Latin.
- **`toCyrillic(latin: string): string`** — Latin → Cyrillic.

### Notes and limitations

- **Alphabet coverage**: all 33 Russian letters (`А-Я`, including `Ё/ё`) are mapped in both directions.
- **Fully reversible (except ь/ъ)**: for Russian text that does not contain `ь` or `ъ`, `toCyrillic(toLatin(text))` restores the original string.
- **Soft/hard signs**: `ь` and `ъ` are dropped when converting to Latin and therefore cannot be recovered when converting back.
- **Scheme**: `й` is transliterated as `j` (`Й` → `J`), `ы` as `y` (`Ы` → `Y`), and `ё` as `yo` / `Yo`.

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
