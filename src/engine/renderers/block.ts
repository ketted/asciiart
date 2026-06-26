import type { Cell, Renderer, RenderOptions, Tile } from '../types'
import { rampGlyph, fgFor } from './shared'

// Light -> dark (increasing fill).
const RAMP = ' ░▒▓█'

export const blockRenderer: Renderer = {
  id: 'block',
  detailRank: 0,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    return { glyph: rampGlyph(tile.luminance, RAMP), fg: fgFor(tile, opts) }
  },
}
