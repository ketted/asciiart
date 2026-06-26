import { describe, it, expect } from 'vitest'
import { brailleRenderer } from './braille'
import type { Tile, RenderOptions } from '../types'

const opts: RenderOptions = { color: false, threshold: 0.5, background: 'white' }

function tileFromLums(lums: number[]): Tile {
  const pixels = lums.map((l) => ({ r: l * 255, g: l * 255, b: l * 255, a: 255 }))
  return { pixels, average: { r: 0, g: 0, b: 0, a: 255 }, luminance: 0, detail: 0 }
}

describe('brailleRenderer', () => {
  it('all-dark tile -> all dots set (U+28FF)', () => {
    const tile = tileFromLums([0, 0, 0, 0, 0, 0, 0, 0])
    expect(brailleRenderer.renderCell(tile, opts).glyph).toBe('⣿')
  })
  it('all-light tile -> blank braille (U+2800)', () => {
    const tile = tileFromLums([1, 1, 1, 1, 1, 1, 1, 1])
    expect(brailleRenderer.renderCell(tile, opts).glyph).toBe('⠀')
  })
  it('only top-left pixel dark -> dot 1 (U+2801)', () => {
    const tile = tileFromLums([0, 1, 1, 1, 1, 1, 1, 1])
    expect(brailleRenderer.renderCell(tile, opts).glyph).toBe('⠁')
  })
})
