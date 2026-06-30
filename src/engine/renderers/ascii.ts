import type { Cell, Renderer, RenderOptions, Tile } from '../types'
import { rampGlyph, fgFor, effLuminance } from './shared'

// Ordered light -> dark (increasing ink).
const RAMP = ' .:-=+*#%@'

export const asciiRenderer: Renderer = {
  id: 'ascii',
  detailRank: 2,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    return { glyph: rampGlyph(effLuminance(tile.luminance, opts), RAMP), fg: fgFor(tile, opts) }
  },
}
