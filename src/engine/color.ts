import type { RGB } from './types'

/** Relative luminance, normalized to 0..1. */
export function luminance(c: RGB): number {
  return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255
}

/** Round and clamp to a 0..255 integer. */
export function clamp8(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}
