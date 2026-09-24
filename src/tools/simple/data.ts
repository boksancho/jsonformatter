import type { SimpleTool } from './types'

export const yamlTool: SimpleTool = {
  placeholder: 'Paste JSON or YAML here...',
  sample: '{\n  "name": "dev",\n  "tags": ["json", "yaml"],\n  "nested": { "enabled": true }\n}',
  modes: [
    { id: 'json2yaml', label: 'JSON → YAML' },
    { id: 'yaml2json', label: 'YAML → JSON' },
  ],
  downloadExt: 'txt',
  run: async (input, mode) => {
    const YAML = await import('yaml')
    if (mode === 'json2yaml') return YAML.stringify(JSON.parse(input))
    return JSON.stringify(YAML.parse(input), null, 2)
  },
}

function escapeCsvCell(v: unknown): string {
  const s =
    v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function jsonToCsv(input: string): string {
  const data = JSON.parse(input)
  const rows = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[]
  if (rows.length === 0) return ''
  if (!rows.every((r) => r !== null && typeof r === 'object' && !Array.isArray(r))) {
    throw new Error('Expected a JSON object or an array of objects')
  }
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))]
  const lines = [keys.map(escapeCsvCell).join(',')]
  for (const row of rows) lines.push(keys.map((k) => escapeCsvCell(row[k])).join(','))
  return lines.join('\n')
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && input[i + 1] === '\n') i++
      row.push(field)
      field = ''
      rows.push(row)
      row = []
    } else field += c
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

function csvToJson(input: string): string {
  const rows = parseCsv(input)
  if (rows.length === 0) return '[]'
  const [header, ...body] = rows
  const out = body
    .filter((r) => r.length > 1 || r[0] !== '')
    .map((r) => Object.fromEntries(header!.map((h, i) => [h, r[i] ?? ''])))
  return JSON.stringify(out, null, 2)
}

export const csvTool: SimpleTool = {
  placeholder: 'Paste a JSON array of objects, or CSV with a header row...',
  sample: '[\n  { "name": "Ada", "age": 36 },\n  { "name": "Alan", "age": 41 }\n]',
  modes: [
    { id: 'json2csv', label: 'JSON → CSV' },
    { id: 'csv2json', label: 'CSV → JSON' },
  ],
  run: (input, mode) => (mode === 'json2csv' ? jsonToCsv(input) : csvToJson(input)),
}

function pascal(s: string): string {
  const spaced = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  const words = spaced.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  return words.map((w) => w[0]!.toUpperCase() + w.slice(1)).join('') || 'Value'
}

function jsonToTs(data: unknown, rootName = 'Root'): string {
  const interfaces: string[] = []
  const used = new Map<string, number>()

  function uniqueName(base: string): string {
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    return n === 0 ? base : `${base}${n + 1}`
  }

  function typeOf(v: unknown, name: string): string {
    if (v === null) return 'unknown'
    if (Array.isArray(v)) {
      if (v.length === 0) return 'unknown[]'
      const types = [...new Set(v.map((item) => typeOf(item, name)))]
      const t = types.length === 1 ? types[0]! : `(${types.join(' | ')})`
      return `${t}[]`
    }
    if (typeof v === 'object') return emit(v as Record<string, unknown>, name)
    return typeof v
  }

  function emit(obj: Record<string, unknown>, name: string): string {
    const ifaceName = uniqueName(name)
    const lines = Object.entries(obj).map(([k, v]) => {
      const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
      return `  ${key}: ${typeOf(v, pascal(k))};`
    })
    interfaces.push(`export interface ${ifaceName} {\n${lines.join('\n')}\n}`)
    return ifaceName
  }

  const root = typeOf(data, rootName)
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    const alias = `export type ${rootName} = ${root};`
    return interfaces.length ? `${alias}\n\n${interfaces.join('\n\n')}\n` : `${alias}\n`
  }
  return interfaces.join('\n\n') + '\n'
}

export const tsTool: SimpleTool = {
  placeholder: 'Paste JSON to generate TypeScript interfaces...',
  sample:
    '{\n  "id": 1,\n  "name": "Ada",\n  "admin": true,\n  "tags": ["a", "b"],\n  "address": { "city": "London", "zip": "E1" }\n}',
  downloadExt: 'ts',
  run: (input) => jsonToTs(JSON.parse(input)),
}
