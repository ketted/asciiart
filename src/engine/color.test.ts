import { describe, it, expect } from 'vitest'
import { luminance, clamp8 } from './color'

describe('luminance', () => {
  it('is 0 for black, 1 for white', () => {
    expect(luminance({ r: 0, g: 0, b: 0 })).toBe(0)
    expect(luminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5)
  })

  it('weights green most heavily', () => {
    const green = luminance({ r: 0, g: 255, b: 0 })
    const red = luminance({ r: 255, g: 0, b: 0 })
    const blue = luminance({ r: 0, g: 0, b: 255 })
    expect(green).toBeGreaterThan(red)
    expect(red).toBeGreaterThan(blue)
  })
})

describe('clamp8', () => {
  it('clamps to 0..255', () => {
    expect(clamp8(-5)).toBe(0)
    expect(clamp8(300)).toBe(255)
    expect(clamp8(128.7)).toBe(129)
  })
})
