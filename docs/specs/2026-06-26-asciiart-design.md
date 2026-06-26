# ASCII Art Studio — Design Spec

**Date:** 2026-06-26
**Status:** Approved, pending implementation plan

## Goal

A standalone, client-side web app that converts an uploaded image into text-based
art. Users pick one or more rendering modes, adjust the image, preview the result
live in the browser, and copy or download the output as `.txt` or `.ans`.

No backend. Pure browser app, deployable as static files.

## Stack

- **Vite + React + TypeScript** (SPA, static build)
- **Canvas API** for reading pixel data
- **Vitest** for unit tests
- Lives in its own repo at `~/code/asciiart`, independent of any other project.

## Architecture — the pipeline

```
Image → [Sampler] → [Adjustments] → [Engine + Renderers] → Cell[][] → [Serializer] → output
```

Five stages, each an independently testable unit.

### 1. Sampler

Draws the source image to an offscreen `<canvas>` and reads `ImageData`.

Key decision: **the image is always sampled at the finest cell geometry — 2×4
pixels per output character cell.** This unifies every renderer (see Engine).
Given a target output width `W` characters:

- Source is drawn at `(W * 2) × (H * 4)` pixels, where `H` is the output height
  in character cells.
- `H` is derived from the image aspect ratio when "preserve aspect ratio" is on:
  `H = round(W * (imgHeight / imgWidth) * charAspectCorrection)`.
  Terminal/monospace characters are roughly 2:1 (tall:wide); the 2×4 tile already
  encodes a 1:2 width:height ratio per cell, so `charAspectCorrection ≈ 1` for the
  blended grid. Each renderer downsamples its tile as needed.

Output: `ImageData` plus grid dimensions `W × H` and a helper to extract the 2×4
**tile** for cell `(x, y)`.

### 2. Adjustments

Pure functions over `ImageData` (no DOM). Applied in order:

1. **Brightness** — additive per-channel offset
2. **Contrast** — scale around midpoint
3. **Saturation** — interpolate toward/away from luminance
4. **Dithering** (optional) — **Floyd–Steinberg** error diffusion

Each is a pure `(ImageData, amount) → ImageData` function, unit-testable on small
synthetic fixtures.

### 3. Engine + Renderers

The **Renderer** is the modular unit. Each mode is one file implementing:

```ts
interface Tile {
  // The 2×4 RGBA pixel block owned by one character cell, plus conveniences:
  pixels: RGBA[]          // length 8, row-major
  average: RGBA           // mean color of the tile
  luminance: number       // mean luminance 0..1
  detail: number          // local variance / edge strength 0..1
}

interface Cell {
  glyph: string
  fg?: RGB                // present only when color is enabled
  bg?: RGB
}

interface Renderer {
  id: 'ascii' | 'block' | 'braille' | 'halfblock' | 'emoji'
  detailRank: number      // capacity for fine detail; used by the blend selector
  renderCell(tile: Tile, opts: RenderOptions): Cell
}
```

The **Engine** owns grid iteration: for each cell `(x, y)` it extracts the tile and
calls the chosen renderer's `renderCell`, producing a `Cell[][]` grid.

**Color is a cross-cutting toggle, not a mode.** When `opts.color` is off,
renderers emit `glyph` only. When on, they attach `fg`/`bg` from the tile.

#### The five renderers

| id | detailRank | glyphs / behavior |
|----|-----------|-------------------|
| `ascii` | low–mid | luminance → ramp `.:-=+*#%@` (avg of tile) |
| `block` | low | luminance → `█▓▒░` and space (avg of tile) |
| `braille` | high | 2×4 tile → one of 256 braille codepoints (base `U+2800`); each of the 8 dots set if its pixel exceeds threshold |
| `halfblock` | mid | tile averaged to 1×2; emit `▀` with `fg` = top pixel, `bg` = bottom pixel ("pixel-art" mode; always colored) |
| `emoji` | low | quantize tile average to nearest color in a small emoji palette `🟥🟧🟨🟩🟦🟪🟫⬛⬜` |

### 4. Blend selector (multi-mode)

The mode selector is **multi-select**:

- **One mode selected** → that renderer is used for every cell.
- **Multiple selected** → blended output. For each cell, a **selector** picks the
  winning renderer based on the tile's `detail`:
  1. Sort the selected renderers by `detailRank`.
  2. Split the detail range `[0, 1]` into N equal bands (N = number selected).
  3. The cell's `detail` value selects the band → the renderer for that band.

Result: braille on busy/edge regions, ascii on mid-tone gradients, block on flat
areas — fused into one `Cell[][]` grid. Fully automatic in v1. (A future "blend
sensitivity" control could reshape the band boundaries.)

### 5. Serializer

Turns one `Cell[][]` grid into output strings. Three serializers from the same
source of truth:

| Serializer | Output | Used for |
|-----------|--------|----------|
| `toHtml` | colored `<span>` elements | browser preview |
| `toPlainText` | glyphs only, rows joined by `\n` | `.txt` download, clipboard |
| `toAnsi` | glyphs wrapped in 24-bit truecolor escape codes (`\x1b[38;2;r;g;bm`…) + reset; background handling per the background option | `.ans` download |

This is why **ANSI truecolor is not a separate renderer** — it is one serialization
of any color-enabled grid. Half-block and any colored mode export identically.

## Background option

`transparent | white | black | auto`. Affects:
- The preview backdrop and the `bg` used when compositing semi-transparent source
  pixels in the sampler.
- The ANSI serializer's background escape codes.
- `auto` picks white or black based on the image's mean luminance.

## UI (single screen)

- **Left panel — controls:**
  - Drop zone / file picker (upload or select image)
  - Output **width** slider
  - Preserve **aspect ratio** toggle (height field enabled when off)
  - **Mode** selector — checkboxes (ascii / block / braille / halfblock / emoji);
    multiple = blend
  - **Color** on/off toggle
  - **Background** select (transparent / white / black / auto)
  - **Brightness / Contrast / Saturation** sliders
  - **Dither** checkbox
- **Right panel — preview:** monospace, colored via the HTML serializer, scrollable.
- **Bottom bar:** Copy to clipboard, Download `.txt`, Download `.ans`.

Re-render is debounced on any control change. All processing is synchronous in the
main thread for v1 (move to a Web Worker later if large images stutter).

## Testing

Renderers, adjustments, sampler geometry, blend selector, and serializers are pure
functions tested with Vitest on small synthetic fixtures. Examples:

- A 2×4 black/white pixel pattern → an exact expected braille codepoint.
- A flat gray tile → expected ascii ramp glyph.
- A known `Cell[][]` → exact ANSI escape-code string.
- Aspect-ratio math: given image dims + width, assert computed `H`.

UI is wired together manually; logic lives in tested pure modules, not components.

## Module layout (proposed)

```
src/
  engine/
    sampler.ts
    adjustments.ts        # brightness, contrast, saturation, dither
    types.ts              # Tile, Cell, RGB, Renderer, RenderOptions
    engine.ts             # grid iteration + blend selector
    renderers/
      ascii.ts
      block.ts
      braille.ts
      halfblock.ts
      emoji.ts
      index.ts            # registry
    serializers/
      html.ts
      text.ts
      ansi.ts
  ui/
    App.tsx
    Controls.tsx
    Preview.tsx
    ...
  __tests__/              # or co-located *.test.ts
```

## Out of scope for v1 (YAGNI)

- Backend, sharing links, saved presets
- Blend-sensitivity slider (band boundaries are automatic)
- Web Worker offloading (only if performance requires it)
- Animated GIF / video input
