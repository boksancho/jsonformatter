<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { marked } from 'marked'
import TextArea from '../../components/TextArea.vue'
import TwoPane from '../../components/TwoPane.vue'
import { useCopy } from '../../composables/useCopy'
import { btn, toolbarCls } from '../../ui'

const SAMPLE = `# Markdown preview

Type **Markdown** on the left, see it rendered here.

- live preview
- HTML source
- copy output

\`\`\`js
const hi = 'hello'
\`\`\`

> Blockquotes work too.`

const input = ref(SAMPLE)
const debounced = ref(SAMPLE)
const tab = ref<'preview' | 'html'>('preview')
const { copied, copy } = useCopy()

let timer: ReturnType<typeof setTimeout> | undefined
watch(input, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debounced.value = v), 200)
})

const html = computed(() => (debounced.value ? (marked.parse(debounced.value) as string) : ''))

const tabBtn = (active: boolean) =>
  `px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
    active
      ? 'border-b-2 border-indigo-500 text-zinc-900 dark:text-zinc-100'
      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
  }`
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button :class="btn" @click="copy(tab === 'html' ? html : input)">
        {{ copied ? 'Copied!' : tab === 'html' ? 'Copy HTML' : 'Copy Markdown' }}
      </button>
      <button :class="btn" @click="input = ''; debounced = ''">Clear</button>
    </div>

    <TwoPane input-label="Markdown">
      <template #input>
        <TextArea v-model="input" placeholder="# Type Markdown here..." />
      </template>
      <template #output>
        <div class="flex h-full flex-col">
          <div class="flex items-center gap-1 border-b border-zinc-200 px-2 dark:border-zinc-800">
            <button :class="tabBtn(tab === 'preview')" @click="tab = 'preview'">Preview</button>
            <button :class="tabBtn(tab === 'html')" @click="tab = 'html'">HTML</button>
          </div>
          <div
            v-if="!input.trim()"
            class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-400 dark:text-zinc-600"
          >
            Type Markdown on the left to preview it.
          </div>
          <div v-else-if="tab === 'preview'" class="md-body flex-1 overflow-auto p-6" v-html="html" />
          <pre
            v-else
            class="flex-1 overflow-auto p-4 font-mono text-xs break-all whitespace-pre-wrap text-zinc-800 dark:text-zinc-200"
          ><code>{{ html }}</code></pre>
        </div>
      </template>
    </TwoPane>
  </div>
</template>
