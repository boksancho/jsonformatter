import type { SimpleTool } from './types'

function base64Encode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

function base64Decode(input: string): string {
  const bin = atob(input.trim())
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export const base64Tool: SimpleTool = {
  placeholder: 'Text or Base64 to convert...',
  sample: 'Hello, world! 🌍',
  modes: [
    { id: 'encode', label: 'Encode' },
    { id: 'decode', label: 'Decode' },
  ],
  run: (input, mode) => (mode === 'encode' ? base64Encode(input) : base64Decode(input)),
}

export const urlTool: SimpleTool = {
  placeholder: 'Text or URL-encoded string...',
  sample: 'https://example.com/search?q=hello world&lang=en',
  modes: [
    { id: 'encode', label: 'Encode' },
    { id: 'decode', label: 'Decode' },
  ],
  run: (input, mode) =>
    mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input),
}

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const htmlEntitiesTool: SimpleTool = {
  placeholder: 'Text or HTML entities...',
  sample: '<p class="x">Tom & Jerry</p>',
  modes: [
    { id: 'encode', label: 'Encode' },
    { id: 'decode', label: 'Decode' },
  ],
  run: (input, mode) => {
    if (mode === 'encode') {
      return input.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]!)
    }
    const t = document.createElement('textarea')
    t.innerHTML = input
    return t.value
  },
}

const ESCAPES: Record<string, string> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
  v: '\v',
  '0': '\0',
}

function escapeString(input: string): string {
  let out = ''
  for (const ch of input) {
    const code = ch.codePointAt(0)!
    const named = Object.entries(ESCAPES).find(([, v]) => v === ch)?.[0]
    if (ch === '\\') out += '\\\\'
    else if (ch === '"') out += '\\"'
    else if (ch === "'") out += "\\'"
    else if (named) out += `\\${named}`
    else if (code < 32 || code === 127) out += `\\x${code.toString(16).padStart(2, '0')}`
    else out += ch
  }
  return out
}

function unescapeString(input: string): string {
  return input.replace(
    /\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g,
    (_m, g: string) => {
      if (g in ESCAPES) return ESCAPES[g]!
      if (g.startsWith('x')) return String.fromCodePoint(parseInt(g.slice(1), 16))
      if (g.startsWith('u{')) return String.fromCodePoint(parseInt(g.slice(2, -1), 16))
      if (g.startsWith('u')) return String.fromCodePoint(parseInt(g.slice(1), 16))
      return g
    },
  )
}

export const stringEscapeTool: SimpleTool = {
  placeholder: 'Text to escape, or an escaped string to unescape...',
  sample: 'line one\nline two\t"quoted"',
  modes: [
    { id: 'escape', label: 'Escape' },
    { id: 'unescape', label: 'Unescape' },
  ],
  run: (input, mode) => (mode === 'escape' ? escapeString(input) : unescapeString(input)),
}
