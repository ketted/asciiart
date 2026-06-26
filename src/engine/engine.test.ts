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

describe('render (blended modes)', () => {
  it('routes cells to different renderers based on per-tile detail', () => {
    // 2 cells wide x 1 cell tall -> width 4, height 4.
    const w = 4, h = 4
    const data = new Uint8ClampedArray(w * h * 4)
    const set = (x: number, y: number, v: number) => {
      const i = (y * w + x) * 4
      data[i] = v; data[i + 1] = v; data[i + 2] = v; data[i + 3] = 255
    }
    for (let y = 0; y < h; y++) {
      // Left cell (cols 0-1): flat mid-gray -> detail 0.
      set(0, y, 128)
      set(1, y, 128)
      // Right cell (cols 2-3): col 0 black, col 1 white -> detail 1.
      set(2, y, 0)
      set(3, y, 255)
    }
    const grid: PixelGrid = { data, width: w, height: h }

    const out = render(grid, ['block', 'braille'], opts)
    expect(out).toHaveLength(1)
    expect(out[0]).toHaveLength(2)

    // Left, flat (detail 0) -> block-ramp glyph (luminance 0.5 -> '▒').
    expect(out[0][0].glyph).toBe('▒')
    // Right, high detail -> a braille codepoint (U+2800..U+28FF).
    const cp = out[0][1].glyph.codePointAt(0)!
    expect(cp).toBeGreaterThanOrEqual(0x2800)
    expect(cp).toBeLessThanOrEqual(0x28ff)
  })
})
