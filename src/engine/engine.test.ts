import { describe, it, expect } from 'vitest'
import { render, selectRenderer } from './engine'
import { REGISTRY } from './renderers/index'
import type { PixelGrid, RenderOptions } from './types'

const opts: RenderOptions = { color: false, threshold: 0.5, background: 'white' }

function flatGrid(cols: number, rows: number, v = 128): PixelGrid {
  const w = cols * 2, h = rows * 4
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = v; data[i + 1] = v; data[i + 2] = v; data[i + 3] = 255
  }
  return { data, width: w, height: h }
}

describe('render', () => {
  it('produces a Cell[][] of the right dimensions', () => {
    const grid = render(flatGrid(3, 2), ['ascii'], opts)
    expect(grid).toHaveLength(2)
    expect(grid[0]).toHaveLength(3)
  })
  it('single mode uses that renderer for every cell', () => {
    const grid = render(flatGrid(2, 1), ['block'], opts)
    const expected = REGISTRY.block.renderCell(
      { pixels: [], average: { r: 128, g: 128, b: 128, a: 255 }, luminance: 128 / 255, detail: 0 },
      opts,
    ).glyph
    expect(grid[0][0].glyph).toBe(expected)
  })
})

describe('selectRenderer', () => {
  it('routes low detail to the lowest-rank renderer, high detail to highest', () => {
    const sorted = [REGISTRY.block, REGISTRY.braille] // ranks 0 and 4
    expect(selectRenderer(0.0, sorted).id).toBe('block')
    expect(selectRenderer(0.99, sorted).id).toBe('braille')
  })
})
