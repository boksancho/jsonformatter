<script setup lang="ts">
import { ref, watch } from 'vue'
import TextArea from './TextArea.vue'
import ErrorBox from './ErrorBox.vue'
import TwoPane from './TwoPane.vue'
import { useCopy } from '../composables/useCopy'
import { btn, btnPrimary, toolbarCls, divider } from '../ui'
import type { SimpleTool } from '../tools/simple/types'

const props = defineProps<{ def: SimpleTool }>()

const input = ref('')
const mode = ref(props.def.modes?.[0]?.id ?? 'default')
const debounced = ref('')
const output = ref('')
const error = ref('')

const { copied, copy } = useCopy()

let timer: ReturnType<typeof setTimeout> | undefined
watch(input, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debounced.value = v), 300)
})

let seq = 0
watch([debounced, mode], async ([text, m]) => {
  const id = ++seq
  if (text.trim() === '') {
    output.value = ''
    error.value = ''
    return
  }
  try {
    const result = await props.def.run(text, m)
    if (id !== seq) return
    output.value = result
    error.value = ''
  } catch (e) {
    if (id !== seq) return
    output.value = ''
    error.value = e instanceof Error ? e.message : String(e)
  }
})

function onDownload() {
  const text = output.value || input.value
  if (!text) return
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `output.${props.def.downloadExt ?? 'txt'}`
  a.click()
  URL.revokeObjectURL(url)
}

function onSample() {
  if (!props.def.sample) return
  input.value = props.def.sample
  debounced.value = props.def.sample
}

function onClear() {
  input.value = ''
  debounced.value = ''
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <template v-if="def.modes">
        <button
          v-for="m in def.modes"
          :key="m.id"
          :class="mode === m.id ? btnPrimary : btn"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </template>
      <button :class="btn" @click="copy(output)">{{ copied ? 'Copied!' : 'Copy' }}</button>
      <button :class="btn" @click="onDownload">Download</button>
      <span :class="divider" />
      <button v-if="def.sample" :class="btn" @click="onSample">Sample</button>
      <button :class="btn" @click="onClear">Clear</button>
    </div>

    <TwoPane input-label="Input" output-label="Output">
      <template #input>
        <TextArea v-model="input" :placeholder="def.placeholder" />
      </template>
      <template #output>
        <div
          v-if="!input.trim()"
          class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-400 dark:text-zinc-600"
        >
          Enter input on the left to see the result here.
        </div>
        <div v-else-if="error" class="flex-1 overflow-auto p-4">
          <ErrorBox title="Invalid input" :message="error" />
        </div>
        <pre
          v-else
          class="flex-1 overflow-auto p-4 font-mono text-sm leading-6 break-all whitespace-pre-wrap text-zinc-800 dark:text-zinc-200"
        ><code>{{ output }}</code></pre>
      </template>
    </TwoPane>
  </div>
</template>
