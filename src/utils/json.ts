export interface ParseError {
  message: string
  line?: number
  column?: number
}

export type ParseResult =
  | { ok: true; data: unknown }
  | { ok: false; error: ParseError }

export type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punct'

export interface Token {
  type: TokenType
  text: string
}

export function parseJson(input: string): ParseResult {
  try {
    return { ok: true, data: JSON.parse(input) }
  } catch (e) {
    return { ok: false, error: extractError(e, input) }
  }
}

function extractError(e: unknown, input: string): ParseError {
  const message = e instanceof Error ? e.message : String(e)
  const lc = /line (\d+) column (\d+)/i.exec(message)
  if (lc) {
    return { message, line: Number(lc[1]), column: Number(lc[2]) }
  }
  const pos = /position (\d+)/i.exec(message)
  if (pos) {
    const position = Number(pos[1])
    const before = input.slice(0, position)
    return {
      message,
      line: before.split('\n').length,
      column: position - before.lastIndexOf('\n'),
    }
  }
  return { message }
}

export function formatJson(data: unknown, indent: number): string {
  return JSON.stringify(data, null, indent)
}

export function minifyJson(data: unknown): string {
  return JSON.stringify(data)
}

export function jsonType(v: unknown): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  const t = typeof v
  return t === 'object' ? 'object' : (t as 'string' | 'number' | 'boolean')
}

const TOKEN_RE =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

export function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const m of json.matchAll(TOKEN_RE)) {
    const index = m.index ?? 0
    if (index > last) {
      tokens.push({ type: 'punct', text: json.slice(last, index) })
    }
    if (m[1] !== undefined) {
      if (m[2] !== undefined) {
        tokens.push({ type: 'key', text: m[1] }, { type: 'punct', text: m[2] })
      } else {
        tokens.push({ type: 'string', text: m[1] })
      }
    } else {
      const type: TokenType =
        m[0] === 'true' || m[0] === 'false' ? 'boolean' : m[0] === 'null' ? 'null' : 'number'
      tokens.push({ type, text: m[0] })
    }
    last = index + m[0].length
  }
  if (last < json.length) {
    tokens.push({ type: 'punct', text: json.slice(last) })
  }
  return tokens
}
