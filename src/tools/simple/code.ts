import type { SimpleTool } from './types'

export const xmlTool: SimpleTool = {
  placeholder: 'Paste XML here...',
  sample:
    '<?xml version="1.0"?><catalog><book id="1"><title>XML Guide</title><price>9.99</price></book><book id="2"><title>JSON Guide</title><price>7.99</price></book></catalog>',
  modes: [
    { id: 'format', label: 'Format' },
    { id: 'minify', label: 'Minify' },
  ],
  downloadExt: 'xml',
  run: async (input, mode) => {
    const doc = new DOMParser().parseFromString(input, 'application/xml')
    const err = doc.querySelector('parsererror')
    if (err) {
      throw new Error(err.textContent?.trim().slice(0, 300) || 'Invalid XML')
    }
    const { default: format } = await import('xml-formatter')
    return mode === 'minify'
      ? format(input, { indentation: '', lineSeparator: '' })
      : format(input, { indentation: '  ', collapseContent: true })
  },
}

export const jsFormatTool: SimpleTool = {
  placeholder: 'Paste JavaScript or TypeScript here...',
  sample: 'const x={a:1,b:[2,3],c:"hello"};function go(){return x.b.map(n=>n*2).join("-")}',
  downloadExt: 'js',
  run: async (input) => {
    const [prettier, babel, estree] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/estree'),
    ])
    return prettier.format(input, {
      parser: 'babel',
      plugins: [babel, estree],
      singleQuote: true,
    })
  },
}

export const jsMinifyTool: SimpleTool = {
  placeholder: 'Paste JavaScript here to minify...',
  sample:
    'function greet(name) {\n  // say hello\n  const message = `Hello, ${name}!`\n  console.log(message)\n  return message\n}',
  downloadExt: 'js',
  run: async (input) => {
    const { minify } = await import('terser')
    const result = await minify(input, {
      compress: true,
      mangle: true,
      format: { comments: false },
    })
    return result.code ?? ''
  },
}

export const cssTool: SimpleTool = {
  placeholder: 'Paste CSS, SCSS or Less here...',
  sample: '.card{display:flex;padding:1rem;border-radius:.5rem}.card>img{max-width:100%}',
  modes: [
    { id: 'css', label: 'CSS' },
    { id: 'scss', label: 'SCSS' },
    { id: 'less', label: 'Less' },
  ],
  downloadExt: 'css',
  run: async (input, mode) => {
    const [prettier, postcss] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/postcss'),
    ])
    return prettier.format(input, { parser: mode, plugins: [postcss] })
  },
}
