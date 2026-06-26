import type { Cell, Renderer, RenderOptions, Tile } from '../types'

const PALETTE: { glyph: string; r: number; g: number; b: number }[] = [
  { glyph: '⬛', r: 0, g: 0, b: 0 },
  { glyph: '⬜', r: 255, g: 255, b: 255 },
  { glyph: '🟥', r: 229, g: 57, b: 53 },
  { glyph: '🟧', r: 245, g: 124, b: 0 },
  { glyph: '🟨', r: 253, g: 216, b: 53 },
  { glyph: '🟩', r: 67, g: 160, b: 71 },
  { glyph: '🟦', r: 30, g: 136, b: 229 },
  { glyph: '🟪', r: 142, g: 68, b: 173 },
  { glyph: '🟫', r: 121, g: 85, b: 72 },
]

export const emojiRenderer: Renderer = {
  id: 'emoji',
  detailRank: 1,
  renderCell(tile: Tile, _opts: RenderOptions): Cell {
    const { r, g, b } = tile.average
    let best = PALETTE[0]
    let bestDist = Infinity
    for (const c of PALETTE) {
      const d = (c.r - r) ** 2 + (c.g - g) ** 2 + (c.b - b) ** 2
      if (d < bestDist) { bestDist = d; best = c }
    }
    return { glyph: best.glyph }
  },
}
