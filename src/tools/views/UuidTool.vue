<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCopy } from '../../composables/useCopy'
import { btn, btnPrimary, toolbarCls, divider, field } from '../../ui'

function uuidV7(): string {
  const now = Date.now()
  const rand = [...crypto.getRandomValues(new Uint8Array(10))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const ts = now.toString(16).padStart(12, '0')
  const a = ((parseInt(rand.slice(0, 3), 16) & 0x0fff) | 0x7000).toString(16)
  const b = ((parseInt(rand.slice(3, 7), 16) & 0x3fff) | 0x8000).toString(16)
  return `${ts.slice(0, 8)}-${ts.slice(8)}-${a}-${b}-${rand.slice(7, 19)}`
}

const version = ref<'v4' | 'v7'>('v4')
const count = ref(5)
const uuids = ref<string[]>([])
const { copied, copy } = useCopy()
const copiedOne = ref('')

function generate() {
  uuids.value = Array.from({ length: count.value }, () =>
    version.value === 'v4' ? crypto.randomUUID() : uuidV7(),
  )
}

async function copyOne(u: string) {
  try {
    await navigator.clipboard.writeText(u)
    copiedOne.value = u
    setTimeout(() => (copiedOne.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}

watch([version, count], generate, { immediate: true })
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button :class="version === 'v4' ? btnPrimary : btn" @click="version = 'v4'">UUID v4</button>
      <button :class="version === 'v7' ? btnPrimary : btn" @click="version = 'v7'">UUID v7</button>
      <span :class="divider" />
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Count
        <select v-model.number="count" :class="field">
          <option :value="1">1</option>
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </label>
      <button :class="btn" @click="generate">Regenerate</button>
      <div class="ml-auto">
        <button :class="btn" @click="copy(uuids.join('\n'))">
          {{ copied ? 'Copied!' : 'Copy all' }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <ul class="mx-auto max-w-2xl space-y-1">
        <li v-for="u in uuids" :key="u">
          <button
            class="w-full rounded-md px-3 py-2 text-left font-mono text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Click to copy"
            @click="copyOne(u)"
          >
            {{ u }}
            <span v-if="copiedOne === u" class="ml-2 text-xs text-emerald-500">copied</span>
          </button>
        </li>
      </ul>
      <p class="mx-auto mt-6 max-w-2xl text-xs text-zinc-400 dark:text-zinc-600">
        v4 is fully random. v7 embeds the current timestamp, so generated IDs sort chronologically.
      </p>
    </div>
  </div>
</template>
