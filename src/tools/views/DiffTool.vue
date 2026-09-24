<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { diffLines } from 'diff'
import TextArea from '../../components/TextArea.vue'
import { btn, toolbarCls, paneLabel } from '../../ui'
import { useCopy } from '../../composables/useCopy'

const original = ref('line one\nline two\nline three')
const changed = ref('line one\nline 2\nline three\nline four')
const debounced = ref<[string, string]>(['', ''])
const { copied, copy } = useCopy()

let timer: ReturnType<typeof setTimeout> | undefined
watch([original, changed], ([a, b]) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debounced.value = [a, b]), 300)
}, { immediate: true })

interface DiffLine {
  text: string
  type: 'same' | 'added' | 'removed'
}

const lines = computed<DiffLine[]>(() => {
  const [a, b] = debounced.value
  if (!a && !b) return []
  const out: DiffLine[] = []
  for (const part of diffLines(a, b)) {
    const type = part.added ? 'added' : part.removed ? 'removed' : 'same'
    const split = part.value.replace(/\n$/, '').split('\n')
    for (const text of split) out.push({ text, type })
  }
  return out
})

const stats = computed(() => ({
  added: lines.value.filter((l) => l.type === 'added').length,
  removed: lines.value.filter((l) => l.type === 'removed').length,
}))

const patch = computed(() =>
  lines.value
    .map((l) => `${l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} ${l.text}`)
    .join('\n'),
)

const lineCls = (t: DiffLine['type']) =>
  t === 'added'
    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
    : t === 'removed'
      ? 'bg-rose-500/15 text-rose-700 line-through dark:text-rose-300'
      : 'text-zinc-600 dark:text-zinc-400'
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <span class="text-xs text-zinc-500">
        <span class="text-emerald-600 dark:text-emerald-400">+{{ stats.added }}</span>
        <span class="ml-2 text-rose-600 dark:text-rose-400">−{{ stats.removed }}</span>
      </span>
      <div class="ml-auto flex gap-2">
        <button :class="btn" @click="copy(patch)">{{ copied ? 'Copied!' : 'Copy diff' }}</button>
        <button :class="btn" @click="original = ''; changed = ''">Clear</button>
      </div>
    </div>

    <div class="flex h-48 shrink-0 flex-col md:flex-row">
      <section class="flex flex-1 flex-col border-b border-zinc-200 md:border-r md:border-b-0 dark:border-zinc-800">
        <div :class="paneLabel">Original</div>
        <TextArea v-model="original" placeholder="Original text..." />
      </section>
      <section class="flex flex-1 flex-col">
        <div :class="paneLabel">Changed</div>
        <TextArea v-model="changed" placeholder="Changed text..." />
      </section>
    </div>

    <div :class="paneLabel">Diff</div>
    <div class="flex-1 overflow-auto">
      <pre class="p-4 font-mono text-sm leading-6"><div
        v-for="(l, i) in lines"
        :key="i"
        :class="lineCls(l.type)"
        class="px-2 whitespace-pre-wrap"
      >{{ l.type === 'added' ? '+' : l.type === 'removed' ? '−' : ' ' }} {{ l.text }}</div></pre>
    </div>
  </div>
</template>
