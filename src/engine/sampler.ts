import type { Background, PixelGrid } from './types'

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

/**
 * Draw an image into a (cols*2) x (rows*4) offscreen canvas and read pixels.
 * For non-transparent modes the image is composited onto a solid `background`.
 */
export function drawImageToGrid(
  img: CanvasImageSource,
  cols: number,
  rows: number,
  background: Background,
  meanLuminanceHint = 0.5,
): PixelGrid {
  const w = cols * 2
  const h = rows * 4
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  if (background !== 'transparent') {
    const fill =
      background === 'white'
        ? '#ffffff'
        : background === 'black'
          ? '#000000'
          : meanLuminanceHint > 0.5
            ? '#ffffff'
            : '#000000'
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, w, h)
  }
  ctx.drawImage(img, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)
  return { data: imageData.data, width: w, height: h }
}
