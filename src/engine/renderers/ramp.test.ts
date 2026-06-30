import { describe, it, expect } from 'vitest'
import { asciiRenderer } from './ascii'
import { blockRenderer } from './block'
import type { Tile, RenderOptions } from '../types'

const opts: RenderOptions = { color: false, threshold: 0.5, background: 'white' }

function tile(lum: number): Tile {
  const v = lum * 255
  return {
    pixels: [],
    average: { r: v, g: v, b: v, a: 255 },
    luminance: lum,
    detail: 0,
  }
}

describe('asciiRenderer', () => {
  it('maps a black pixel to the densest glyph "@"', () => {
    expect(asciiRenderer.renderCell(tile(0), opts).glyph).toBe('@')
  })
  it('maps a white pixel to a space', () => {
    expect(asciiRenderer.renderCell(tile(1), opts).glyph).toBe(' ')
  })
  it('attaches fg color only when color is on', () => {
    expect(asciiRenderer.renderCell(tile(0.5), opts).fg).toBeUndefined()
    const colored = asciiRenderer.renderCell(tile(0.5), { ...opts, color: true })
    expect(colored.fg).toEqual({ r: 128, g: 128, b: 128 })
  })
})

describe('blockRenderer', () => {
  it('maps black to full block, white to space', () => {
    expect(blockRenderer.renderCell(tile(0), opts).glyph).toBe('█')
    expect(blockRenderer.renderCell(tile(1), opts).glyph).toBe(' ')
  })
})

describe('invert option', () => {
  it('flips the luminance->glyph polarity for grayscale (light-on-dark)', () => {
    const inv: RenderOptions = { ...opts, invert: true }
    // black pixel now maps to a space, white pixel to the densest glyph
    expect(asciiRenderer.renderCell(tile(0), inv).glyph).toBe(' ')
    expect(asciiRenderer.renderCell(tile(1), inv).glyph).toBe('@')
    expect(blockRenderer.renderCell(tile(1), inv).glyph).toBe('█')
  })
})
