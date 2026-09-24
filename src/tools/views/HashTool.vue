<script setup lang="ts">
import { ref, watch } from 'vue'
import TextArea from '../../components/TextArea.vue'
import TwoPane from '../../components/TwoPane.vue'
import { useCopy } from '../../composables/useCopy'
import { btn, toolbarCls } from '../../ui'

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const

const input = ref('')
const debounced = ref('')
const hashes = ref<Record<string, string>>({})
const { copied, copy } = useCopy()
const copiedAlgo = ref('')

let timer: ReturnType<typeof setTimeout> | undefined
watch(input, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debounced.value = v), 300)
})

let seq = 0
watch(debounced, async (text) => {
  const id = ++seq
  if (!text) {
    hashes.value = {}
    return
  }
  const data = new TextEncoder().encode(text)
  const result: Record<string, string> = {}
  for (const algo of ALGOS) {
    const buf = await crypto.subtle.digest(algo, data)
    result[algo] = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  if (id === seq) hashes.value = result
})

async function copyHash(algo: string) {
  try {
    await navigator.clipboard.writeText(hashes.value[algo] ?? '')
    copiedAlgo.value = algo
    setTimeout(() => (copiedAlgo.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button :class="btn" @click="copy(Object.values(hashes).join('\n'))">
        {{ copied ? 'Copied!' : 'Copy all' }}
      </button>
      <button :class="btn" @click="input = ''">Clear</button>
    </div>

    <TwoPane input-label="Input" output-label="Digests">
      <template #input>
        <TextArea v-model="input" placeholder="Type text to hash..." />
      </template>
      <template #output>
        <div
          v-if="!input"
          class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-400 dark:text-zinc-600"
        >
          Type on the left to compute hashes.
        </div>
        <div v-else class="flex-1 space-y-4 overflow-auto p-4">
          <div v-for="algo in ALGOS" :key="algo">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{{ algo }}</p>
              <button
                class="text-xs text-indigo-500 hover:text-indigo-400"
                @click="copyHash(algo)"
              >
                {{ copiedAlgo === algo ? 'copied' : 'copy' }}
              </button>
            </div>
            <p
              class="mt-1 rounded-md bg-zinc-100 px-3 py-2 font-mono text-xs break-all text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {{ hashes[algo] }}
            </p>
          </div>
        </div>
      </template>
    </TwoPane>
  </div>
</template>
