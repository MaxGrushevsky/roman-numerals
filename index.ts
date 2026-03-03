/**
 * Transliterate between Cyrillic and Latin scripts.
 * Zero dependencies.
 */

const CYRILLIC_TO_LATIN: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
}

const LATIN_TO_CYRILLIC: Record<string, string> = {
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
  'zh': 'ж', 'z': 'з', 'i': 'и', 'j': 'й', 'k': 'к', 'l': 'л', 'm': 'м',
  'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
  'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sch': 'щ',
  'yu': 'ю', 'ya': 'я', 'y': 'ы',
  'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'E': 'Е', 'Yo': 'Ё',
  'Zh': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Й', 'K': 'К', 'L': 'Л', 'M': 'М',
  'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У',
  'F': 'Ф', 'H': 'Х', 'Ts': 'Ц', 'Ch': 'Ч', 'Sh': 'Ш', 'Sch': 'Щ',
  'Yu': 'Ю', 'Ya': 'Я', 'Y': 'Ы'
}

/**
 * Convert Cyrillic text to Latin.
 */
export function toLatin(cyrillic: string): string {
  if (!cyrillic || typeof cyrillic !== 'string') return ''
  let output = ''
  for (let i = 0; i < cyrillic.length; i++) {
    if (i < cyrillic.length - 2 && CYRILLIC_TO_LATIN[cyrillic.substring(i, i + 3)]) {
      output += CYRILLIC_TO_LATIN[cyrillic.substring(i, i + 3)]
      i += 2
      continue
    }
    if (i < cyrillic.length - 1 && CYRILLIC_TO_LATIN[cyrillic.substring(i, i + 2)]) {
      output += CYRILLIC_TO_LATIN[cyrillic.substring(i, i + 2)]
      i += 1
      continue
    }
    output += CYRILLIC_TO_LATIN[cyrillic[i]] ?? cyrillic[i]
  }
  return output
}

/**
 * Convert Latin text to Cyrillic.
 */
export function toCyrillic(latin: string): string {
  if (!latin || typeof latin !== 'string') return ''
  let output = ''
  let i = 0
  while (i < latin.length) {
    let found = false
    if (i < latin.length - 2 && LATIN_TO_CYRILLIC[latin.substring(i, i + 3)]) {
      output += LATIN_TO_CYRILLIC[latin.substring(i, i + 3)]
      i += 3
      found = true
    }
    if (!found && i < latin.length - 1 && LATIN_TO_CYRILLIC[latin.substring(i, i + 2)]) {
      output += LATIN_TO_CYRILLIC[latin.substring(i, i + 2)]
      i += 2
      found = true
    }
    if (!found) {
      output += LATIN_TO_CYRILLIC[latin[i]] ?? latin[i]
      i++
    }
  }
  return output
}

