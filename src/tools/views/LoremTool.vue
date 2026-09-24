<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCopy } from '../../composables/useCopy'
import { btn, btnPrimary, toolbarCls, field } from '../../ui'

const WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

function word(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)]!
}

function sentence(): string {
  const n = 4 + Math.floor(Math.random() * 10)
  const s = Array.from({ length: n }, word).join(' ')
  return s[0]!.toUpperCase() + s.slice(1) + '.'
}

function paragraph(): string {
  const n = 3 + Math.floor(Math.random() * 4)
  return Array.from({ length: n }, sentence).join(' ')
}

const unit = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const count = ref(3)
const output = ref('')
const { copied, copy } = useCopy()

function generate() {
  if (unit.value === 'paragraphs') {
    output.value = Array.from({ length: count.value }, paragraph).join('\n\n')
  } else if (unit.value === 'sentences') {
    output.value = Array.from({ length: count.value }, sentence).join(' ')
  } else {
    output.value = Array.from({ length: count.value }, word).join(' ')
  }
}

watch([unit, count], generate, { immediate: true })
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button
        v-for="u in ['paragraphs', 'sentences', 'words'] as const"
        :key="u"
        :class="unit === u ? btnPrimary : btn"
        @click="unit = u"
      >
        {{ u[0]!.toUpperCase() + u.slice(1) }}
      </button>
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Count
        <input v-model.number="count" type="number" min="1" max="50" :class="[field, 'w-20']" />
      </label>
      <button :class="btn" @click="generate">Regenerate</button>
      <div class="ml-auto">
        <button :class="btn" @click="copy(output)">{{ copied ? 'Copied!' : 'Copy' }}</button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-6">
      <p
        class="mx-auto max-w-3xl text-sm leading-7 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300"
      >
        {{ output }}
      </p>
    </div>
  </div>
</template>
