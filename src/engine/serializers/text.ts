import type { Cell } from '../types'

export function toPlainText(grid: Cell[][]): string {
  return grid.map((row) => row.map((c) => c.glyph).join('')).join('\n')
}
