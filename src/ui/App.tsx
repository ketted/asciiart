import { useMemo, useState } from 'react'
import { Controls, DEFAULT_CONTROLS, type ControlState } from './Controls'
import { Preview } from './Preview'
import { useImage } from './useImageGrid'
import { computeDimensions, drawImageToGrid } from '../engine/sampler'
import { applyBrightness, applyContrast, applySaturation, applyDither } from '../engine/adjustments'
import { render } from '../engine/engine'
import { toHtml } from '../engine/serializers/html'
import { toPlainText } from '../engine/serializers/text'
import { toAnsi } from '../engine/serializers/ansi'
import { luminance } from '../engine/color'
import type { Cell } from '../engine/types'

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export default function App() {
  const { image, loadFile } = useImage()
  const [controls, setControls] = useState<ControlState>(DEFAULT_CONTROLS)

  const cellGrid: Cell[][] = useMemo(() => {
    if (!image) return []
    const { cols, rows } = computeDimensions(
      image.naturalWidth, image.naturalHeight, controls.width, controls.preserveAspect,
    )
    // The mean-luminance hint is only consumed when background === 'auto'.
    // Skip the extra probe sample otherwise to halve sampling cost.
    let meanLum = 0.5
    if (controls.background === 'auto') {
      const probe = drawImageToGrid(image, cols, rows, 'transparent')
      let sum = 0
      for (let i = 0; i < probe.data.length; i += 4) {
        sum += luminance({ r: probe.data[i], g: probe.data[i + 1], b: probe.data[i + 2] })
      }
      meanLum = sum / (probe.data.length / 4)
    }

    let grid = drawImageToGrid(image, cols, rows, controls.background, meanLum)
    grid = applyBrightness(grid, controls.brightness)
    grid = applyContrast(grid, controls.contrast)
    grid = applySaturation(grid, controls.saturation)
    if (controls.dither) grid = applyDither(grid)

    return render(grid, controls.modes, {
      color: controls.color,
      threshold: 0.5,
      background: controls.background,
    })
  }, [image, controls])

  const html = useMemo(() => toHtml(cellGrid), [cellGrid])
  const plain = useMemo(() => toPlainText(cellGrid), [cellGrid])
  const ansi = useMemo(() => toAnsi(cellGrid), [cellGrid])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Controls state={controls} onChange={setControls} onFile={loadFile} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Preview html={html} background={controls.background} />
        <div style={{ display: 'flex', gap: 8, padding: 8, borderTop: '1px solid #ccc' }}>
          <button
            onClick={() =>
              navigator.clipboard
                .writeText(plain)
                .catch((err) => console.warn('Copy to clipboard failed:', err))
            }
            disabled={!image}
          >
            Copy
          </button>
          <button onClick={() => download('art.txt', plain)} disabled={!image}>
            Download .txt
          </button>
          <button onClick={() => download('art.ans', ansi)} disabled={!image}>
            Download .ans
          </button>
        </div>
      </div>
    </div>
  )
}
