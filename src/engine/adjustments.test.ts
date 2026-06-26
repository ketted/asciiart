import { describe, it, expect } from 'vitest'
import { applyBrightness, applyContrast } from './adjustments'
import type { PixelGrid } from './types'

function px(r: number, g: number, b: number, a = 255): PixelGrid {
  return { data: new Uint8ClampedArray([r, g, b, a]), width: 1, height: 1 }
}

describe('applyBrightness', () => {
  it('adds a positive offset and clamps', () => {
    const out = applyBrightness(px(100, 100, 100), 50)
    expect(Array.from(out.data)).toEqual([150, 150, 150, 255])
  })
  it('does not change alpha', () => {
    const out = applyBrightness(px(10, 10, 10, 128), 5)
    expect(out.data[3]).toBe(128)
  })
})

describe('applyContrast', () => {
  it('amount 0 is identity', () => {
    const out = applyContrast(px(100, 150, 200), 0)
    expect(Array.from(out.data)).toEqual([100, 150, 200, 255])
  })
  it('positive amount pushes away from midpoint (128)', () => {
    const out = applyContrast(px(200, 200, 200), 0.5)
    expect(out.data[0]).toBeGreaterThan(200)
  })
})
