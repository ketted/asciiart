import type { Background, RendererId } from '../engine/types'
import { ALL_MODES } from '../engine/renderers/index'

export interface ControlState {
  width: number
  preserveAspect: boolean
  modes: RendererId[]
  color: boolean
  background: Background
  brightness: number
  contrast: number
  saturation: number
  dither: boolean
}

export const DEFAULT_CONTROLS: ControlState = {
  width: 80,
  preserveAspect: true,
  modes: ['ascii'],
  color: false,
  background: 'white',
  brightness: 0,
  contrast: 0,
  saturation: 0,
  dither: false,
}

export function Controls({
  state,
  onChange,
  onFile,
}: {
  state: ControlState
  onChange: (next: ControlState) => void
  onFile: (file: File) => void
}) {
  const set = <K extends keyof ControlState>(key: K, value: ControlState[K]) =>
    onChange({ ...state, [key]: value })

  const toggleMode = (id: RendererId) => {
    const has = state.modes.includes(id)
    const next = has ? state.modes.filter((m) => m !== id) : [...state.modes, id]
    set('modes', next.length ? next : state.modes) // never allow zero modes
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: 280 }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      <label>
        Width: {state.width}
        <input type="range" min={20} max={200} value={state.width}
          onChange={(e) => set('width', Number(e.target.value))} />
      </label>

      <label>
        <input type="checkbox" checked={state.preserveAspect}
          onChange={(e) => set('preserveAspect', e.target.checked)} /> Preserve aspect ratio
      </label>

      <fieldset>
        <legend>Modes (multi = blend)</legend>
        {ALL_MODES.map((id) => (
          <label key={id} style={{ display: 'block' }}>
            <input type="checkbox" checked={state.modes.includes(id)}
              onChange={() => toggleMode(id)} /> {id}
          </label>
        ))}
      </fieldset>

      <label>
        <input type="checkbox" checked={state.color}
          onChange={(e) => set('color', e.target.checked)} /> Color
      </label>

      <label>
        Background:
        <select value={state.background}
          onChange={(e) => set('background', e.target.value as Background)}>
          <option value="transparent">transparent</option>
          <option value="white">white</option>
          <option value="black">black</option>
          <option value="auto">auto</option>
        </select>
      </label>

      <label>Brightness: {state.brightness}
        <input type="range" min={-100} max={100} value={state.brightness}
          onChange={(e) => set('brightness', Number(e.target.value))} /></label>
      <label>Contrast: {state.contrast.toFixed(2)}
        <input type="range" min={-1} max={1} step={0.05} value={state.contrast}
          onChange={(e) => set('contrast', Number(e.target.value))} /></label>
      <label>Saturation: {state.saturation.toFixed(2)}
        <input type="range" min={-1} max={1} step={0.05} value={state.saturation}
          onChange={(e) => set('saturation', Number(e.target.value))} /></label>

      <label>
        <input type="checkbox" checked={state.dither}
          onChange={(e) => set('dither', e.target.checked)} /> Dither
      </label>
    </div>
  )
}
