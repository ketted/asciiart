import { describe, it, expect } from 'vitest'
import { toPlainText } from './text'
import { toHtml } from './html'
import type { Cell } from '../types'

const grid: Cell[][] = [
  [{ glyph: 'a' }, { glyph: 'b', fg: { r: 255, g: 0, b: 0 } }],
  [{ glyph: '<' }, { glyph: 'd' }],
]

describe('toPlainText', () => {
  it('joins glyphs by row with newlines', () => {
    expect(toPlainText(grid)).toBe('ab\n<d')
  })
  it('returns empty string for empty grid', () => {
    expect(toPlainText([])).toBe('')
  })
})

describe('toHtml', () => {
  it('wraps colored cells in styled spans and escapes html', () => {
    const html = toHtml(grid)
    expect(html).toContain('<span style="color:rgb(255,0,0)">b</span>')
    expect(html).toContain('&lt;') // the '<' glyph is escaped
  })
  it('returns empty string for empty grid', () => {
    expect(toHtml([])).toBe('')
  })
  it('styles a bg-only cell (no fg)', () => {
    const html = toHtml([[{ glyph: 'x', bg: { r: 4, g: 5, b: 6 } }]])
    expect(html).toContain('<span style="background:rgb(4,5,6)">x</span>')
  })
  it('escapes & first so existing entities are not double-escaped', () => {
    expect(toHtml([[{ glyph: '&' }]])).toContain('&amp;')
  })
})
