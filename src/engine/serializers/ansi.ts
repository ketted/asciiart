import type { Cell } from '../types'

const RESET = '\x1b[0m'

function cellAnsi(c: Cell): string {
  if (!c.fg && !c.bg) return c.glyph
  let out = ''
  if (c.fg) out += `\x1b[38;2;${c.fg.r};${c.fg.g};${c.fg.b}m`
  if (c.bg) out += `\x1b[48;2;${c.bg.r};${c.bg.g};${c.bg.b}m`
  return out + c.glyph + RESET
}

export function toAnsi(grid: Cell[][]): string {
  return grid.map((row) => row.map(cellAnsi).join('')).join('\n')
}
