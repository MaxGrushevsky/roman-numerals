import { describe, it, expect } from 'vitest'
import { toLatin, toCyrillic } from './index'

describe('toLatin', () => {
  it('converts simple phrase', () => {
    expect(toLatin('Привет мир')).toBe('Privet mir')
  })

  it('returns empty string for empty input', () => {
    expect(toLatin('')).toBe('')
  })

  it('passes through non-Cyrillic characters', () => {
    expect(toLatin('123 !')).toBe('123 !')
  })

  it('converts full lowercase Russian alphabet', () => {
    expect(toLatin('абвгдеёжзийклмнопрстуфхцчшщъыьэюя'))
      .toBe('abvgdeyozhzijklmnoprstufhtschshschyeyuya')
  })

  it('converts full uppercase Russian alphabet', () => {
    expect(toLatin('АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'))
      .toBe('ABVGDEYoZhZIJKLMNOPRSTUFHTsChShSchYEYuYa')
  })

  it('round-trips words with ы and й', () => {
    const words = ['мы', 'Крым', 'май', 'мой', 'йога']
    for (const word of words) {
      expect(toCyrillic(toLatin(word))).toBe(word)
    }
  })
})

describe('toCyrillic', () => {
  it('converts simple word', () => {
    expect(toCyrillic('Privet')).toBe('Привет')
  })

  it('converts phrase with space', () => {
    expect(toCyrillic('Privet mir')).toBe('Привет мир')
  })

  it('round-trips simple text', () => {
    const text = 'Привет, мир!'
    expect(toCyrillic(toLatin(text))).toBe(text)
  })

  it('passes through non-Latin characters', () => {
    expect(toCyrillic('123 ! Привет')).toBe('123 ! Привет')
  })

  it('handles multi-letter combinations', () => {
    expect(toCyrillic('Schyorst')).toBe('Щёрст')
  })

  it('maps y to ы', () => {
    expect(toCyrillic('my')).toBe('мы')
    expect(toCyrillic('Krym')).toBe('Крым')
  })
})

