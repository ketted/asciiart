import { describe, it, expect } from 'vitest'
import { emojiRenderer } from './emoji'
import type { Tile, RenderOptions } from '../types'

const opts: RenderOptions = { color: false, threshold: 0.5, background: 'white' }

function tile(r: number, g: number, b: number): Tile {
  return { pixels: [], average: { r, g, b, a: 255 }, luminance: 0, detail: 0 }
}

describe('emojiRenderer', () => {
  it('maps near-red to the red square', () => {
    expect(emojiRenderer.renderCell(tile(230, 30, 30), opts).glyph).toBe('🟥')
  })
  it('maps near-black to the black square', () => {
    expect(emojiRenderer.renderCell(tile(5, 5, 5), opts).glyph).toBe('⬛')
  })
  it('maps near-white to the white square', () => {
    expect(emojiRenderer.renderCell(tile(250, 250, 250), opts).glyph).toBe('⬜')
  })
  it('never attaches fg/bg (emoji carry their own color)', () => {
    expect(emojiRenderer.renderCell(tile(230, 30, 30), opts).fg).toBeUndefined()
  })
})
