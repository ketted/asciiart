import type { Cell, Renderer, RenderOptions, Tile } from '../types'
import { rampGlyph, fgFor } from './shared'

// Ordered light -> dark (increasing ink).
const RAMP = ' .:-=+*#%@'

export const asciiRenderer: Renderer = {
  id: 'ascii',
  detailRank: 2,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    return { glyph: rampGlyph(tile.luminance, RAMP), fg: fgFor(tile, opts) }
  },
}
