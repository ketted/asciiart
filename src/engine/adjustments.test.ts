import { describe, it, expect } from 'vitest'
import {
  applyBrightness,
  applyContrast,
  applySaturation,
  applyDither,
  applyAutoLevels,
} from './adjustments'
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

describe('applySaturation', () => {
  it('amount -1 produces gray (all channels equal)', () => {
    const out = applySaturation(px(200, 50, 50), -1)
    expect(out.data[0]).toBe(out.data[1])
    expect(out.data[1]).toBe(out.data[2])
  })
  it('amount 0 is identity', () => {
    const out = applySaturation(px(200, 50, 50), 0)
    expect(Array.from(out.data)).toEqual([200, 50, 50, 255])
  })
})

describe('applyAutoLevels', () => {
  it('stretches each channel from its min/max to the full 0..255 range', () => {
    // red channel spans 50..200 -> should map to 0..255
    const grid: PixelGrid = {
      data: new Uint8ClampedArray([50, 50, 50, 255, 200, 200, 200, 255]),
      width: 2,
      height: 1,
    }
    const out = applyAutoLevels(grid)
    expect(out.data[0]).toBe(0)
    expect(out.data[4]).toBe(255)
  })
  it('leaves alpha untouched', () => {
    const grid: PixelGrid = {
      data: new Uint8ClampedArray([10, 10, 10, 128, 240, 240, 240, 64]),
      width: 2,
      height: 1,
    }
    const out = applyAutoLevels(grid)
    expect(out.data[3]).toBe(128)
    expect(out.data[7]).toBe(64)
  })
})

describe('applyDither', () => {
  it('produces only pure black or white per channel', () => {
    const grid: PixelGrid = {
      data: new Uint8ClampedArray([128, 128, 128, 255, 128, 128, 128, 255]),
      width: 2,
      height: 1,
    }
    const out = applyDither(grid)
    for (let i = 0; i < out.data.length; i += 4) {
      expect([0, 255]).toContain(out.data[i])
    }
  })
})
