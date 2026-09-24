<script setup lang="ts">
import { computed, ref } from 'vue'
import TextArea from '../../components/TextArea.vue'
import TwoPane from '../../components/TwoPane.vue'
import { btn, toolbarCls } from '../../ui'

const input = ref('')
const copiedCase = ref('')

const words = computed(() =>
  input.value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase()),
)

const cap = (w: string) => w[0]!.toUpperCase() + w.slice(1)

const cases = computed(() => {
  const w = words.value
  return [
    { key: 'lower', label: 'lowercase', value: w.join(' ') },
    { key: 'upper', label: 'UPPERCASE', value: w.join(' ').toUpperCase() },
    { key: 'title', label: 'Title Case', value: w.map(cap).join(' ') },
    {
      key: 'sentence',
      label: 'Sentence case',
      value: w.join(' ').replace(/(^\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
    },
    { key: 'camel', label: 'camelCase', value: w.map((x, i) => (i ? cap(x) : x)).join('') },
    { key: 'pascal', label: 'PascalCase', value: w.map(cap).join('') },
    { key: 'snake', label: 'snake_case', value: w.join('_') },
    { key: 'screaming', label: 'SCREAMING_SNAKE_CASE', value: w.join('_').toUpperCase() },
    { key: 'kebab', label: 'kebab-case', value: w.join('-') },
    { key: 'train', label: 'Train-Case', value: w.map(cap).join('-') },
    { key: 'dot', label: 'dot.case', value: w.join('.') },
    { key: 'path', label: 'path/case', value: w.join('/') },
  ]
})

async function copyCase(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedCase.value = key
    setTimeout(() => (copiedCase.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button :class="btn" @click="input = ''">Clear</button>
    </div>

    <TwoPane input-label="Input" output-label="Conversions">
      <template #input>
        <TextArea v-model="input" placeholder="Type or paste text, e.g. hello world example" />
      </template>
      <template #output>
        <div
          v-if="!input.trim()"
          class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-400 dark:text-zinc-600"
        >
          Type on the left to see every case variant.
        </div>
        <div v-else class="flex-1 space-y-2 overflow-auto p-4">
          <div
            v-for="c in cases"
            :key="c.key"
            class="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-4 py-2.5 dark:border-zinc-800"
          >
            <div class="min-w-0">
              <p class="text-xs text-zinc-400">{{ c.label }}</p>
              <p class="truncate font-mono text-sm text-zinc-800 dark:text-zinc-200">
                {{ c.value }}
              </p>
            </div>
            <button
              class="shrink-0 text-xs text-indigo-500 hover:text-indigo-400"
              @click="copyCase(c.key, c.value)"
            >
              {{ copiedCase === c.key ? 'copied' : 'copy' }}
            </button>
          </div>
        </div>
      </template>
    </TwoPane>
  </div>
</template>
