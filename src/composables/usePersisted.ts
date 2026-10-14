import { ref, watch, type Ref } from 'vue'

const PREFIX = 'oneutil:'

/** Values written but not yet flushed to localStorage (key -> serialized value). */
const pending = new Map<string, string>()

function flush() {
  if (pending.size === 0) return
  for (const [key, value] of pending) {
    try {
      localStorage.setItem(key, value)
    } catch {
      // storage full or blocked (private mode) — drop the write
    }
  }
  pending.clear()
}

// Flush pending writes when the tab is closed, refreshed or backgrounded.
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush)
}

/**
 * A ref whose value survives reloads and browser restarts via localStorage.
 * Writes are debounced (300ms) and flushed on page unload.
 */
export function usePersisted<T>(key: string, initial: T): Ref<T> {
  let start = initial
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (typeof parsed === typeof initial) start = parsed as T
    }
  } catch {
    // unreadable or corrupt stored value — fall back to the default
  }

  const state = ref(start) as Ref<T>

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(state, (v) => {
    clearTimeout(timer)
    pending.set(PREFIX + key, JSON.stringify(v))
    timer = setTimeout(flush, 300)
  })

  return state
}
