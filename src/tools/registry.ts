export type Category = 'Formatters' | 'Encoders' | 'Converters' | 'Generators' | 'Inspectors'

export interface ToolMeta {
  id: string
  name: string
  description: string
  category: Category
  keywords?: string[]
  /** Custom view. When omitted, the tool is a simple transform defined in tools/simple. */
  component?: () => Promise<unknown>
}

export const categories: Category[] = [
  'Formatters',
  'Encoders',
  'Converters',
  'Generators',
  'Inspectors',
]

export const tools: ToolMeta[] = [
  // Formatters
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Format, validate, minify and explore JSON',
    category: 'Formatters',
    keywords: ['beautify', 'pretty', 'validate', 'tree'],
    component: () => import('./views/JsonTool.vue'),
  },
  {
    id: 'xml',
    name: 'XML Formatter',
    description: 'Format, validate and minify XML',
    category: 'Formatters',
    keywords: ['beautify', 'minify'],
  },
  {
    id: 'js-format',
    name: 'JS Formatter',
    description: 'Beautify JavaScript with Prettier',
    category: 'Formatters',
    keywords: ['javascript', 'prettier', 'beautify'],
  },
  {
    id: 'js-minify',
    name: 'JS Minifier',
    description: 'Minify JavaScript with Terser',
    category: 'Formatters',
    keywords: ['javascript', 'compress', 'uglify', 'terser'],
  },
  {
    id: 'css-format',
    name: 'CSS Formatter',
    description: 'Format CSS, SCSS or Less with Prettier',
    category: 'Formatters',
    keywords: ['styles', 'prettier', 'scss', 'less'],
  },

  // Encoders
  {
    id: 'base64',
    name: 'Base64',
    description: 'Encode and decode Base64 (UTF-8 safe)',
    category: 'Encoders',
    keywords: ['atob', 'btoa', 'encode', 'decode'],
  },
  {
    id: 'url-encode',
    name: 'URL Encoder',
    description: 'Encode and decode URL components',
    category: 'Encoders',
    keywords: ['percent', 'uri', 'query'],
  },
  {
    id: 'html-entities',
    name: 'HTML Entities',
    description: 'Escape and unescape HTML entities',
    category: 'Encoders',
    keywords: ['escape', 'amp', 'lt', 'gt'],
  },
  {
    id: 'string-escape',
    name: 'String Escape',
    description: 'Escape and unescape JavaScript string literals',
    category: 'Encoders',
    keywords: ['newline', 'tab', 'unicode', 'literal'],
  },

  // Converters
  {
    id: 'yaml',
    name: 'YAML ↔ JSON',
    description: 'Convert between YAML and JSON',
    category: 'Converters',
    keywords: ['yml', 'convert'],
  },
  {
    id: 'csv',
    name: 'CSV ↔ JSON',
    description: 'Convert between CSV and JSON',
    category: 'Converters',
    keywords: ['spreadsheet', 'table', 'convert'],
  },
  {
    id: 'json-to-ts',
    name: 'JSON → TypeScript',
    description: 'Generate TypeScript interfaces from JSON',
    category: 'Converters',
    keywords: ['interface', 'types', 'typescript'],
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to dates and back',
    category: 'Converters',
    keywords: ['unix', 'epoch', 'date', 'time'],
    component: () => import('./views/TimestampTool.vue'),
  },
  {
    id: 'markdown',
    name: 'Markdown Preview',
    description: 'Render Markdown to HTML',
    category: 'Converters',
    keywords: ['md', 'render', 'html'],
    component: () => import('./views/MarkdownTool.vue'),
  },
  {
    id: 'case',
    name: 'Case Converter',
    description: 'Convert text between camelCase, snake_case and more',
    category: 'Converters',
    keywords: ['camel', 'snake', 'kebab', 'pascal', 'upper', 'lower'],
    component: () => import('./views/CaseTool.vue'),
  },

  // Generators
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate UUIDs (v4 and v7) in bulk',
    category: 'Generators',
    keywords: ['guid', 'uuidv4', 'uuidv7'],
    component: () => import('./views/UuidTool.vue'),
  },
  {
    id: 'nanoid',
    name: 'NanoID Generator',
    description: 'Generate NanoIDs with custom alphabet and length',
    category: 'Generators',
    keywords: ['id', 'random', 'unique'],
    component: () => import('./views/NanoidTool.vue'),
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Generate strong random passwords',
    category: 'Generators',
    keywords: ['random', 'secure', 'passphrase'],
    component: () => import('./views/PasswordTool.vue'),
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text',
    category: 'Generators',
    keywords: ['placeholder', 'dummy', 'text'],
    component: () => import('./views/LoremTool.vue'),
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Compute SHA-1, SHA-256, SHA-384 and SHA-512 digests',
    category: 'Generators',
    keywords: ['sha', 'checksum', 'digest', 'crypto'],
    component: () => import('./views/HashTool.vue'),
  },
  {
    id: 'qr',
    name: 'QR Code',
    description: 'Generate QR codes as PNG images',
    category: 'Generators',
    keywords: ['barcode', 'image', 'scan'],
    component: () => import('./views/QrTool.vue'),
  },

  // Inspectors
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode JWT headers and payloads',
    category: 'Inspectors',
    keywords: ['token', 'bearer', 'claims'],
    component: () => import('./views/JwtTool.vue'),
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test regular expressions with live highlighting',
    category: 'Inspectors',
    keywords: ['regexp', 'match', 'pattern'],
    component: () => import('./views/RegexTool.vue'),
  },
  {
    id: 'diff',
    name: 'Text Diff',
    description: 'Compare two texts line by line',
    category: 'Inspectors',
    keywords: ['compare', 'difference', 'changes'],
    component: () => import('./views/DiffTool.vue'),
  },
]
