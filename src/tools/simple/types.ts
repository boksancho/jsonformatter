export interface SimpleToolMode {
  id: string
  label: string
}

export interface SimpleTool {
  /** Placeholder for the input textarea */
  placeholder: string
  /** Optional sample loaded by the Sample button */
  sample?: string
  /** Mode selector (e.g. encode/decode). First entry is the default. */
  modes?: SimpleToolMode[]
  /** Transform input -> output. Throw an Error to signal invalid input. May be async. */
  run: (input: string, mode: string) => string | Promise<string>
  /** File extension used by the Download button (default: txt) */
  downloadExt?: string
}
