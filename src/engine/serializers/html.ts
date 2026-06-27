import type { Cell } from '../types'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function cellHtml(c: Cell): string {
  const g = escapeHtml(c.glyph)
  if (!c.fg && !c.bg) return g
  const styles: string[] = []
  if (c.fg) styles.push(`color:rgb(${c.fg.r},${c.fg.g},${c.fg.b})`)
  if (c.bg) styles.push(`background:rgb(${c.bg.r},${c.bg.g},${c.bg.b})`)
  return `<span style="${styles.join(';')}">${g}</span>`
}

export function toHtml(grid: Cell[][]): string {
  return grid.map((row) => row.map(cellHtml).join('')).join('\n')
}
