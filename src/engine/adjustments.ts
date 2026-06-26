import type { PixelGrid } from './types'
import { clamp8, luminance } from './color'

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

/** amount: -1 (grayscale) .. 1 (more saturated). */
export function applySaturation(grid: PixelGrid, amount: number): PixelGrid {
  if (amount === 0) return grid
  const data = new Uint8ClampedArray(grid.data.length)
  for (let i = 0; i < grid.data.length; i += 4) {
    const r = grid.data[i]
    const g = grid.data[i + 1]
    const b = grid.data[i + 2]
    const lum = luminance({ r, g, b }) * 255
    data[i] = clamp8(lum + (r - lum) * (1 + amount))
    data[i + 1] = clamp8(lum + (g - lum) * (1 + amount))
    data[i + 2] = clamp8(lum + (b - lum) * (1 + amount))
    data[i + 3] = grid.data[i + 3]
  }
  return { data, width: grid.width, height: grid.height }
}

/** Floyd–Steinberg dithering to black/white per channel. */
export function applyDither(grid: PixelGrid): PixelGrid {
  const { width, height } = grid
  const buf = Float32Array.from(grid.data)
  const at = (x: number, y: number, c: number) => (y * width + x) * 4 + c
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        const old = buf[at(x, y, c)]
        const next = old < 128 ? 0 : 255
        const err = old - next
        buf[at(x, y, c)] = next
        if (x + 1 < width) buf[at(x + 1, y, c)] += (err * 7) / 16
        if (y + 1 < height) {
          if (x > 0) buf[at(x - 1, y + 1, c)] += (err * 3) / 16
          buf[at(x, y + 1, c)] += (err * 5) / 16
          if (x + 1 < width) buf[at(x + 1, y + 1, c)] += (err * 1) / 16
        }
      }
    }
  }
  const data = new Uint8ClampedArray(grid.data.length)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp8(buf[i])
    data[i + 1] = clamp8(buf[i + 1])
    data[i + 2] = clamp8(buf[i + 2])
    data[i + 3] = grid.data[i + 3]
  }
  return { data, width, height }
}
