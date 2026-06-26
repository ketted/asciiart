import { describe, it, expect } from 'vitest'
import { halfblockRenderer } from './halfblock'
import type { Tile, RenderOptions } from '../types'

function tile(pixels: [number, number, number][]): Tile {
  const rgba = pixels.map((c) => ({ r: c[0], g: c[1], b: c[2], a: 255 }))
  return { pixels: rgba, average: { r: 0, g: 0, b: 0, a: 255 }, luminance: 0.5, detail: 0 }
}

const colorOpts: RenderOptions = { color: true, threshold: 0.5, background: 'black' }

describe('halfblockRenderer (color)', () => {
  it('uses ▀ with fg=top half avg, bg=bottom half avg', () => {
    const t = tile([
      [255, 0, 0], [255, 0, 0],
      [255, 0, 0], [255, 0, 0],
      [0, 0, 255], [0, 0, 255],
      [0, 0, 255], [0, 0, 255],
    ])
    const cell = halfblockRenderer.renderCell(t, colorOpts)
    expect(cell.glyph).toBe('▀')
    expect(cell.fg).toEqual({ r: 255, g: 0, b: 0 })
    expect(cell.bg).toEqual({ r: 0, g: 0, b: 255 })
  })
})

describe('halfblockRenderer (no color)', () => {
  it('falls back to a block ramp glyph and no colors', () => {
    const t = tile(Array(8).fill([0, 0, 0]))
    const cell = halfblockRenderer.renderCell(t, { color: false, threshold: 0.5, background: 'white' })
    expect(cell.fg).toBeUndefined()
    expect(cell.bg).toBeUndefined()
    expect(cell.glyph).toBe('▒')
  })
})
