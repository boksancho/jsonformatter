<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Toolbar from '../../components/Toolbar.vue'
import JsonEditor from '../../components/JsonEditor.vue'
import JsonOutput from '../../components/JsonOutput.vue'
import { formatJson, minifyJson, parseJson, tokenizeJson } from '../../utils/json'

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
  <div class="flex flex-1 flex-col">
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
        class="flex min-h-[40vh] flex-1 flex-col border-b border-zinc-200 md:border-r md:border-b-0 dark:border-zinc-800"
      >
        <div
          class="border-b border-zinc-200 px-4 py-2 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:border-zinc-800"
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
