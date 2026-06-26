import type { PixelGrid } from './types'

/**
 * Cells are 2px wide x 4px tall. To make the sampled grid's pixel aspect
 * (cols*2):(rows*4) equal the image aspect imgW:imgH:
 *   rows = cols * (imgH/imgW) / 2
 */
export function computeDimensions(
  imgW: number,
  imgH: number,
  cols: number,
  preserveAspect: boolean,
  explicitRows = cols,
): { cols: number; rows: number } {
  if (!preserveAspect) {
    return { cols, rows: Math.max(1, Math.round(explicitRows)) }
  }
  const aspect = imgH / imgW
  const rows = Math.max(1, Math.round((cols * aspect) / 2))
  return { cols, rows }
}
