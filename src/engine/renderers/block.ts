import type { Cell, Renderer, RenderOptions, Tile } from '../types'
import { rampGlyph, fgFor, effLuminance } from './shared'

// Light -> dark (increasing fill).
const RAMP = ' ░▒▓█'

export const blockRenderer: Renderer = {
  id: 'block',
  detailRank: 0,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    return { glyph: rampGlyph(effLuminance(tile.luminance, opts), RAMP), fg: fgFor(tile, opts) }
  },
}
