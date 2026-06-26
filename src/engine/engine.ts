import type { Cell, PixelGrid, Renderer, RendererId, RenderOptions } from './types'
import { REGISTRY } from './renderers/index'
import { buildTile } from './tile'

/** `sorted` is ascending by detailRank. Split [0,1] into N equal bands. */
export function selectRenderer(detail: number, sorted: Renderer[]): Renderer {
  const n = sorted.length
  const band = Math.min(n - 1, Math.floor(detail * n))
  return sorted[band]
}

export function render(grid: PixelGrid, modes: RendererId[], opts: RenderOptions): Cell[][] {
  const cols = Math.floor(grid.width / 2)
  const rows = Math.floor(grid.height / 4)
  const selected = modes.map((id) => REGISTRY[id]).sort((a, b) => a.detailRank - b.detailRank)
  if (selected.length === 0) return []
  const out: Cell[][] = []
  for (let y = 0; y < rows; y++) {
    const line: Cell[] = []
    for (let x = 0; x < cols; x++) {
      const tile = buildTile(grid, x, y)
      const renderer = selected.length === 1 ? selected[0] : selectRenderer(tile.detail, selected)
      line.push(renderer.renderCell(tile, opts))
    }
    out.push(line)
  }
  return out
}
