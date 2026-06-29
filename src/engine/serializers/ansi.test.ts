import { describe, it, expect } from 'vitest'
import { toAnsi } from './ansi'
import type { Cell } from '../types'

const RESET = '\x1b[0m'

describe('toAnsi', () => {
  it('emits plain glyphs when no color present', () => {
    const grid: Cell[][] = [[{ glyph: 'a' }, { glyph: 'b' }]]
    expect(toAnsi(grid)).toBe('ab')
  })
  it('wraps fg in a 24-bit truecolor code and resets', () => {
    const grid: Cell[][] = [[{ glyph: 'x', fg: { r: 10, g: 20, b: 30 } }]]
    expect(toAnsi(grid)).toBe(`\x1b[38;2;10;20;30mx${RESET}`)
  })
  it('includes background code when bg present', () => {
    const grid: Cell[][] = [[{ glyph: 'x', fg: { r: 1, g: 2, b: 3 }, bg: { r: 4, g: 5, b: 6 } }]]
    expect(toAnsi(grid)).toBe(`\x1b[38;2;1;2;3m\x1b[48;2;4;5;6mx${RESET}`)
  })
  it('separates rows with newlines', () => {
    const grid: Cell[][] = [[{ glyph: 'a' }], [{ glyph: 'b' }]]
    expect(toAnsi(grid)).toBe('a\nb')
  })
  it('returns empty string for empty grid', () => {
    expect(toAnsi([])).toBe('')
  })
  it('emits a bg-only code when no fg present', () => {
    const grid: Cell[][] = [[{ glyph: 'x', bg: { r: 4, g: 5, b: 6 } }]]
    expect(toAnsi(grid)).toBe(`\x1b[48;2;4;5;6mx${RESET}`)
  })
})
