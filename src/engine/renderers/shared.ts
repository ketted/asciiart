import type { RGB, RenderOptions, Tile } from '../types'

function rampGlyph(luminance: number, ramp: string): string {
  const idx = Math.round((1 - luminance) * (ramp.length - 1))
  return ramp[idx]
}

export function fgFor(tile: Tile, opts: RenderOptions): RGB | undefined {
  if (!opts.color) return undefined
  return { r: Math.round(tile.average.r), g: Math.round(tile.average.g), b: Math.round(tile.average.b) }
}

export { rampGlyph }
