import type { Cell, Renderer, RenderOptions, Tile } from '../types'

// Ordered light -> dark (increasing ink).
const RAMP = ' .:-=+*#%@'

function rampGlyph(luminance: number, ramp: string): string {
  const idx = Math.round((1 - luminance) * (ramp.length - 1))
  return ramp[idx]
}

export function fgFor(tile: Tile, opts: RenderOptions): { r: number; g: number; b: number } | undefined {
  if (!opts.color) return undefined
  return { r: Math.round(tile.average.r), g: Math.round(tile.average.g), b: Math.round(tile.average.b) }
}

export const asciiRenderer: Renderer = {
  id: 'ascii',
  detailRank: 2,
  renderCell(tile: Tile, opts: RenderOptions): Cell {
    return { glyph: rampGlyph(tile.luminance, RAMP), fg: fgFor(tile, opts) }
  },
}

export { rampGlyph }
