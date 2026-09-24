import type { SimpleTool } from './types'
import { base64Tool, urlTool, htmlEntitiesTool, stringEscapeTool } from './encoding'
import { yamlTool, csvTool, tsTool } from './data'
import { xmlTool, jsFormatTool, jsMinifyTool, cssTool } from './code'

export const simpleTools: Record<string, SimpleTool> = {
  base64: base64Tool,
  'url-encode': urlTool,
  'html-entities': htmlEntitiesTool,
  'string-escape': stringEscapeTool,
  yaml: yamlTool,
  csv: csvTool,
  'json-to-ts': tsTool,
  xml: xmlTool,
  'js-format': jsFormatTool,
  'js-minify': jsMinifyTool,
  'css-format': cssTool,
}
