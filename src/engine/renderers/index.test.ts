import { describe, it, expect } from 'vitest'
import { REGISTRY, ALL_MODES } from './index'

describe('renderer registry', () => {
  it('exposes all four renderers keyed by id', () => {
    expect(ALL_MODES).toEqual(['ascii', 'block', 'braille', 'halfblock'])
    for (const id of ALL_MODES) {
      expect(REGISTRY[id].id).toBe(id)
    }
  })
  it('each renderer has a distinct detailRank', () => {
    const ranks = ALL_MODES.map((id) => REGISTRY[id].detailRank)
    expect(new Set(ranks).size).toBe(ranks.length)
  })
})
