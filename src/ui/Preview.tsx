import type { Background } from '../engine/types'

export function Preview({ html, background }: { html: string; background: Background }) {
  const bg =
    background === 'black' ? '#000'
    : background === 'white' ? '#fff'
    : background === 'transparent' ? 'transparent'
    : '#222' // auto preview backdrop
  const fg = background === 'black' || background === 'auto' ? '#ddd' : '#111'
  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        fontFamily: 'monospace',
        fontSize: 8,
        lineHeight: '8px',
        letterSpacing: 0,
        whiteSpace: 'pre',
        overflow: 'auto',
        flex: 1,
        background: bg,
        color: fg,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
