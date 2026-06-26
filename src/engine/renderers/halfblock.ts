import type { Cell, Renderer, RenderOptions, RGB, Tile } from '../types'
import { rampGlyph } from './ascii'

const BLOCK_RAMP = ' ░▒▓█'

function avg(pixels: Tile['pixels']): RGB {
  let r = 0, g = 0, b = 0
  for (const p of pixels) { r += p.r; g += p.g; b += p.b }
  const n = pixels.length
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) }
}

export const halfblockRenderer: Renderer = {
  id: 'halfblock',
  detailRank: 3,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    if (!opts.color) {
      return { glyph: rampGlyph(tile.luminance, BLOCK_RAMP) }
    }
    const top = avg(tile.pixels.slice(0, 4))
    const bottom = avg(tile.pixels.slice(4, 8))
    return { glyph: '▀', fg: top, bg: bottom }
  },
}
