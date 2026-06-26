import { describe, it, expect } from 'vitest'
import { buildTile } from './tile'
import type { PixelGrid } from './types'

/** Build a 2x4 grid (one tile) from 8 [r,g,b] triples, row-major. */
function tileGrid(colors: [number, number, number][]): PixelGrid {
  const data = new Uint8ClampedArray(8 * 4)
  colors.forEach((c, i) => {
    data[i * 4] = c[0]
    data[i * 4 + 1] = c[1]
    data[i * 4 + 2] = c[2]
    data[i * 4 + 3] = 255
  })
  return { data, width: 2, height: 4 }
}

describe('buildTile', () => {
  it('collects 8 pixels in row-major order', () => {
    const grid = tileGrid([
      [0, 0, 0], [255, 255, 255],
      [0, 0, 0], [0, 0, 0],
      [0, 0, 0], [0, 0, 0],
      [0, 0, 0], [0, 0, 0],
    ])
    const tile = buildTile(grid, 0, 0)
    expect(tile.pixels).toHaveLength(8)
    expect(tile.pixels[1]).toEqual({ r: 255, g: 255, b: 255, a: 255 })
  })

  it('detail is 1 for a half-black half-white tile, 0 for a flat tile', () => {
    const flat = tileGrid(Array(8).fill([128, 128, 128]))
    expect(buildTile(flat, 0, 0).detail).toBeCloseTo(0, 5)

    const split = tileGrid([
      [0, 0, 0], [255, 255, 255],
      [0, 0, 0], [255, 255, 255],
      [0, 0, 0], [255, 255, 255],
      [0, 0, 0], [255, 255, 255],
    ])
    expect(buildTile(split, 0, 0).detail).toBeCloseTo(1, 5)
  })

  it('clamps reads at the grid edge', () => {
    const grid: PixelGrid = { data: new Uint8ClampedArray([10, 20, 30, 255]), width: 1, height: 1 }
    const tile = buildTile(grid, 0, 0)
    expect(tile.average).toEqual({ r: 10, g: 20, b: 30, a: 255 })
  })
})
