import type { Background, RendererId } from '../engine/types'
import { ALL_MODES } from '../engine/renderers/index'

export interface ControlState {
  width: number
  preserveAspect: boolean
  modes: RendererId[]
  color: boolean
  background: Background
  auto: boolean
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
  auto: false,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  dither: false,
}

/** One-click combinations that look good. Each merges onto the current state. */
const PRESETS: { name: string; settings: Partial<ControlState> }[] = [
  { name: 'Photographic', settings: { modes: ['halfblock'], color: true, auto: true, background: 'white' } },
  { name: 'Neon braille', settings: { modes: ['braille'], color: true, auto: true, background: 'black' } },
  { name: 'Colour blend', settings: { modes: ['ascii', 'block', 'braille'], color: true, auto: true, background: 'white' } },
  { name: 'Classic blend', settings: { modes: ['ascii', 'block', 'braille'], color: false, auto: false, background: 'white' } },
  { name: 'Inked (B&W)', settings: { modes: ['ascii', 'block', 'braille'], color: false, auto: true, background: 'black' } },
]

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

      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Recommended</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onChange({ ...state, ...p.settings })}
              style={{ fontSize: 12, padding: '4px 8px', cursor: 'pointer' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

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
          onChange={(e) => set('color', e.target.checked)} /> Colour
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

      <label style={{ fontWeight: 'bold' }}>
        <input type="checkbox" checked={state.auto}
          onChange={(e) => set('auto', e.target.checked)} /> Auto enhance (brightness/contrast/saturation)
      </label>

      <fieldset disabled={state.auto} style={{ opacity: state.auto ? 0.5 : 1, border: 'none', padding: 0, margin: 0 }}>
        <label>Brightness: {state.brightness}
          <input type="range" min={-100} max={100} value={state.brightness}
            onChange={(e) => set('brightness', Number(e.target.value))} /></label>
        <label>Contrast: {state.contrast.toFixed(2)}
          <input type="range" min={-1} max={1} step={0.05} value={state.contrast}
            onChange={(e) => set('contrast', Number(e.target.value))} /></label>
        <label>Saturation: {state.saturation.toFixed(2)}
          <input type="range" min={-1} max={1} step={0.05} value={state.saturation}
            onChange={(e) => set('saturation', Number(e.target.value))} /></label>
      </fieldset>

      <label>
        <input type="checkbox" checked={state.dither}
          onChange={(e) => set('dither', e.target.checked)} /> Dither
      </label>
    </div>
  )
}
