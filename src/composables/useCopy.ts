import { ref } from 'vue'

export function useCopy(timeout = 1500) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string) {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => (copied.value = false), timeout)
    } catch {
      // clipboard unavailable (e.g. non-secure context) — ignore
    }
  }

  return { copied, copy }
}
