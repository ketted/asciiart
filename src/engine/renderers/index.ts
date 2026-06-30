import type { Renderer, RendererId } from '../types'
import { asciiRenderer } from './ascii'
import { blockRenderer } from './block'
import { brailleRenderer } from './braille'
import { halfblockRenderer } from './halfblock'

export const REGISTRY: Record<RendererId, Renderer> = {
  ascii: asciiRenderer,
  block: blockRenderer,
  braille: brailleRenderer,
  halfblock: halfblockRenderer,
}

export const ALL_MODES: RendererId[] = ['ascii', 'block', 'braille', 'halfblock']
