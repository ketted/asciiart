import type { Cell, Renderer, RenderOptions, Tile } from '../types'
import { luminance } from '../color'
import { fgFor, effLuminance } from './shared'

// bit position for each tile pixel index (row*2 + col)
const BIT_FOR_INDEX = [0, 3, 1, 4, 2, 5, 6, 7]

export const brailleRenderer: Renderer = {
  id: 'braille',
  detailRank: 4,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    let bits = 0
    tile.pixels.forEach((p, i) => {
      if (effLuminance(luminance(p), opts) < opts.threshold) bits |= 1 << BIT_FOR_INDEX[i]
    })
    return { glyph: String.fromCodePoint(0x2800 + bits), fg: fgFor(tile, opts) }
  },
}
