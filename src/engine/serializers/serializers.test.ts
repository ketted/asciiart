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
})

describe('toHtml', () => {
  it('wraps colored cells in styled spans and escapes html', () => {
    const html = toHtml(grid)
    expect(html).toContain('<span style="color:rgb(255,0,0)">b</span>')
    expect(html).toContain('&lt;') // the '<' glyph is escaped
  })
})
