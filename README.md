# ASCII Art Studio

A browser-based image-to-text-art converter. Load an image, tune the controls,
and watch it render live into character art you can copy or download.

## Modes

Five rendering modes, each with different detail capacity:

- **ascii** — classic brightness ramp of ASCII characters
- **block** — Unicode block-shading characters
- **braille** — Braille dot patterns (2x4 dots per cell)
- **halfblock** — upper/lower half blocks for doubled vertical resolution
- **emoji** — emoji chosen by brightness/color

Select **multiple** modes to blend them: each cell is rendered by the mode whose
detail rank best matches that cell's local detail, so flat areas and busy areas
get different glyphs in the same image.

## Controls

- **Width** — output width in characters (height follows from aspect ratio)
- **Preserve aspect ratio** — keep the image's proportions
- **Color** — emit per-cell foreground color instead of monochrome
- **Background** — `transparent`, `white`, `black`, or `auto` (picks black/white
  from the image's mean luminance)
- **Brightness / Contrast / Saturation** — pre-render image adjustments
- **Dither** — error-diffusion dithering for smoother tonal ramps

## Output

- **Copy** — plain text to the clipboard
- **Download .txt** — plain text file
- **Download .ans** — ANSI file; `cat`-ing it in a truecolor terminal shows the
  rendered color

## Running

```sh
npm run dev    # start the dev server
npm test       # run the test suite
```
