import type { PixelGrid, RGBA, Tile } from './types'
import { luminance } from './color'

const TILE_W = 2
const TILE_H = 4

function readPixel(grid: PixelGrid, x: number, y: number): RGBA {
  const cx = Math.min(grid.width - 1, Math.max(0, x))
  const cy = Math.min(grid.height - 1, Math.max(0, y))
  const i = (cy * grid.width + cx) * 4
  return { r: grid.data[i], g: grid.data[i + 1], b: grid.data[i + 2], a: grid.data[i + 3] }
}

/** Build the Tile for character cell (cellX, cellY). */
export function buildTile(grid: PixelGrid, cellX: number, cellY: number): Tile {
  const baseX = cellX * TILE_W
  const baseY = cellY * TILE_H
  const pixels: RGBA[] = []
  let sr = 0, sg = 0, sb = 0, sa = 0
  let minL = Infinity, maxL = -Infinity
  for (let row = 0; row < TILE_H; row++) {
    for (let col = 0; col < TILE_W; col++) {
      const p = readPixel(grid, baseX + col, baseY + row)
      pixels.push(p)
      sr += p.r; sg += p.g; sb += p.b; sa += p.a
      const l = luminance(p)
      if (l < minL) minL = l
      if (l > maxL) maxL = l
    }
  }
  const n = pixels.length
  const average: RGBA = { r: sr / n, g: sg / n, b: sb / n, a: sa / n }
  return {
    pixels,
    average,
    luminance: luminance(average),
    detail: maxL - minL,
  }
}
