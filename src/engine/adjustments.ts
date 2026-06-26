import type { PixelGrid } from './types'
import { clamp8 } from './color'

/** Map each RGB channel (alpha untouched) through fn, returning a new grid. */
function mapChannels(grid: PixelGrid, fn: (v: number) => number): PixelGrid {
  const data = new Uint8ClampedArray(grid.data.length)
  for (let i = 0; i < grid.data.length; i += 4) {
    data[i] = clamp8(fn(grid.data[i]))
    data[i + 1] = clamp8(fn(grid.data[i + 1]))
    data[i + 2] = clamp8(fn(grid.data[i + 2]))
    data[i + 3] = grid.data[i + 3]
  }
  return { data, width: grid.width, height: grid.height }
}

/** offset: -255..255 added to each channel. */
export function applyBrightness(grid: PixelGrid, offset: number): PixelGrid {
  if (offset === 0) return grid
  return mapChannels(grid, (v) => v + offset)
}

/** amount: -1..1. Scales each channel around the 128 midpoint. */
export function applyContrast(grid: PixelGrid, amount: number): PixelGrid {
  if (amount === 0) return grid
  const factor = (1 + amount) / (1 - Math.min(0.999, Math.max(-0.999, amount)))
  return mapChannels(grid, (v) => factor * (v - 128) + 128)
}
