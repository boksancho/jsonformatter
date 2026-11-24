export async function unzipString(input: string): Promise<string> {
  const base64 = input.trim().replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')
  if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length % 4 === 1) {
    throw new Error('Input must be a Base64-encoded zlib/deflate string')
  }

  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))
  const decompressed = await new Response(stream).arrayBuffer()
  return new TextDecoder('utf-8', { fatal: true }).decode(decompressed)
}
