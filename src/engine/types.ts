export type RGB = { r: number; g: number; b: number }
export type RGBA = { r: number; g: number; b: number; a: number }

/** Raw RGBA pixel buffer. Mirrors ImageData but DOM-independent for testing. */
export interface PixelGrid {
  data: Uint8ClampedArray // length = width * height * 4, RGBA
  width: number
  height: number
}

/** The 2x4 px block owned by one character cell. */
export interface Tile {
  pixels: RGBA[] // length 8, row-major (row*2 + col)
  average: RGBA
  luminance: number // 0..1, from average
  detail: number // 0..1, local contrast (max-min luminance across the 8 px)
}

export interface Cell {
  glyph: string
  fg?: RGB
  bg?: RGB
}

export type Background = 'transparent' | 'white' | 'black' | 'auto'

export interface RenderOptions {
  color: boolean
  threshold: number // 0..1, braille dot on/off cutoff
  background: Background
  /** Flip luminance->glyph polarity so grayscale reads as light-on-dark. */
  invert?: boolean
}

export type RendererId = 'ascii' | 'block' | 'braille' | 'halfblock'

export interface Renderer {
  id: RendererId
  /** Capacity for fine detail; the blend selector orders renderers by this. */
  detailRank: number
  renderCell(tile: Tile, opts: RenderOptions): Cell
}
