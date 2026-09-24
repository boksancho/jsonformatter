<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCopy } from '../../composables/useCopy'
import { btn, btnPrimary, toolbarCls, field } from '../../ui'

const alphabets = [
  { id: 'default', label: 'Default (a-zA-Z0-9_-)', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-' },
  { id: 'alnum', label: 'Alphanumeric', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' },
  { id: 'lower', label: 'Lowercase + digits', chars: 'abcdefghijklmnopqrstuvwxyz0123456789' },
  { id: 'numbers', label: 'Numbers', chars: '0123456789' },
  { id: 'hex', label: 'Hex', chars: '0123456789abcdef' },
  { id: 'custom', label: 'Custom', chars: '' },
]

function randomId(size: number, alphabet: string): string {
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1
  const step = Math.ceil((1.6 * mask * size) / alphabet.length)
  let id = ''
  while (true) {
    const bytes = crypto.getRandomValues(new Uint8Array(step))
    for (const b of bytes) {
      const i = b & mask
      if (i < alphabet.length) {
        id += alphabet[i]
        if (id.length === size) return id
      }
    }
  }
}

const alphabetId = ref('default')
const customAlphabet = ref('ABCDEF1234567890')
const size = ref(21)
const count = ref(5)
const ids = ref<string[]>([])
const { copied, copy } = useCopy()
const copiedOne = ref('')

function alphabet(): string {
  if (alphabetId.value === 'custom') return customAlphabet.value || '0'
  return alphabets.find((a) => a.id === alphabetId.value)?.chars ?? alphabets[0]!.chars
}

function generate() {
  ids.value = Array.from({ length: count.value }, () => randomId(size.value, alphabet()))
}

async function copyOne(id: string) {
  try {
    await navigator.clipboard.writeText(id)
    copiedOne.value = id
    setTimeout(() => (copiedOne.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}

watch([alphabetId, customAlphabet, size, count], generate, { immediate: true })
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Alphabet
        <select v-model="alphabetId" :class="field">
          <option v-for="a in alphabets" :key="a.id" :value="a.id">{{ a.label }}</option>
        </select>
      </label>
      <input
        v-if="alphabetId === 'custom'"
        v-model="customAlphabet"
        :class="[field, 'w-48 font-mono']"
        placeholder="Custom alphabet"
      />
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Length
        <input v-model.number="size" type="number" min="1" max="128" :class="[field, 'w-20']" />
      </label>
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Count
        <select v-model.number="count" :class="field">
          <option :value="1">1</option>
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
        </select>
      </label>
      <button :class="btnPrimary" @click="generate">Regenerate</button>
      <div class="ml-auto">
        <button :class="btn" @click="copy(ids.join('\n'))">
          {{ copied ? 'Copied!' : 'Copy all' }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <ul class="mx-auto max-w-2xl space-y-1">
        <li v-for="id in ids" :key="id">
          <button
            class="w-full rounded-md px-3 py-2 text-left font-mono text-sm break-all text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Click to copy"
            @click="copyOne(id)"
          >
            {{ id }}
            <span v-if="copiedOne === id" class="ml-2 text-xs text-emerald-500">copied</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
