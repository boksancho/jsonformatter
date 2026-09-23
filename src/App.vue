<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Toolbar from './components/Toolbar.vue'
import JsonEditor from './components/JsonEditor.vue'
import JsonOutput from './components/JsonOutput.vue'
import { formatJson, minifyJson, parseJson, tokenizeJson } from './utils/json'

const SAMPLE = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "free": true,
  "features": ["format", "validate", "minify", "tree view"],
  "author": {
    "name": "dev",
    "contact": null
  },
  "stats": {
    "users": 1284,
    "rating": 4.9
  }
}`

const theme = ref<'dark' | 'light'>(
  document.documentElement.classList.contains('dark') ? 'dark' : 'light',
)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  localStorage.setItem('theme', theme.value)
}

const input = ref('')
const indent = ref(2)
const tab = ref<'formatted' | 'tree'>('formatted')
const mode = ref<'pretty' | 'minified'>('pretty')
const copied = ref(false)
const debouncedInput = ref('')

let timer: ReturnType<typeof setTimeout> | undefined
watch(input, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debouncedInput.value = v), 300)
})

const result = computed(() =>
  debouncedInput.value.trim() === '' ? null : parseJson(debouncedInput.value),
)

const output = computed(() => {
  if (!result.value?.ok) return ''
  return mode.value === 'pretty'
    ? formatJson(result.value.data, indent.value)
    : minifyJson(result.value.data)
})

const tokens = computed(() => tokenizeJson(output.value))

const valid = computed(() => (result.value === null ? null : result.value.ok))

function onFormat() {
  mode.value = 'pretty'
  tab.value = 'formatted'
}

function onMinify() {
  mode.value = 'minified'
  tab.value = 'formatted'
}

async function onCopy() {
  const text = output.value || input.value
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard unavailable (e.g. non-secure context) — ignore
  }
}

function onDownload() {
  const text = output.value || input.value
  if (!text) return
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = mode.value === 'minified' ? 'minified.json' : 'formatted.json'
  a.click()
  URL.revokeObjectURL(url)
}

function onSample() {
  input.value = SAMPLE
  debouncedInput.value = SAMPLE
}

function onClear() {
  input.value = ''
  debouncedInput.value = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
    <header
      class="flex items-center justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800"
    >
      <div>
        <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">JSON Formatter</h1>
        <p class="text-sm text-zinc-500">Format, validate, minify and explore JSON</p>
      </div>
      <button
        class="rounded-md border border-zinc-300 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <svg
          v-if="theme === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </button>
    </header>

    <Toolbar
      v-model:indent="indent"
      :copied="copied"
      :valid="valid"
      @format="onFormat"
      @minify="onMinify"
      @copy="onCopy"
      @download="onDownload"
      @sample="onSample"
      @clear="onClear"
    />

    <main class="flex flex-1 flex-col md:flex-row">
      <section
        class="flex min-h-[40vh] flex-1 flex-col border-b border-zinc-200 md:border-b-0 md:border-r dark:border-zinc-800"
      >
        <div
          class="border-b border-zinc-200 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800"
        >
          Input
        </div>
        <JsonEditor v-model="input" />
      </section>
      <section class="flex min-h-[40vh] flex-1 flex-col overflow-hidden">
        <JsonOutput v-model:tab="tab" :result="result" :output="output" :tokens="tokens" />
      </section>
    </main>
  </div>
</template>
