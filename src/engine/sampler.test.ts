import { describe, it, expect } from 'vitest'
import { computeDimensions } from './sampler'

describe('computeDimensions', () => {
  it('keeps grid pixel aspect equal to image aspect for a square image', () => {
    const { cols, rows } = computeDimensions(100, 100, 80, true)
    expect(cols).toBe(80)
    expect(rows).toBe(40)
  })

  it('halves rows for a 2:1 wide image', () => {
    expect(computeDimensions(200, 100, 80, true).rows).toBe(20)
  })

  it('never returns fewer than 1 row', () => {
    expect(computeDimensions(1000, 1, 10, true).rows).toBe(1)
  })

  it('with preserveAspect off, rows defaults to explicit height', () => {
    expect(computeDimensions(100, 100, 80, false, 25).rows).toBe(25)
  })
})
