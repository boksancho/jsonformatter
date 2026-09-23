<script setup lang="ts">
const indent = defineModel<number>('indent', { required: true })

defineProps<{
  copied: boolean
  valid: boolean | null
}>()

const emit = defineEmits<{
  format: []
  minify: []
  copy: []
  download: []
  sample: []
  clear: []
}>()

const btn =
  'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
const btnPrimary =
  'rounded-md border border-indigo-500 bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500'
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"
  >
    <button :class="btnPrimary" @click="emit('format')">Format</button>
    <button :class="btn" @click="emit('minify')">Minify</button>
    <button :class="btn" @click="emit('copy')">{{ copied ? 'Copied!' : 'Copy' }}</button>
    <button :class="btn" @click="emit('download')">Download</button>

    <span class="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

    <button :class="btn" @click="emit('sample')">Sample</button>
    <button :class="btn" @click="emit('clear')">Clear</button>

    <div class="ml-auto flex items-center gap-3">
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Indent
        <select
          v-model="indent"
          class="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        >
          <option :value="2">2 spaces</option>
          <option :value="4">4 spaces</option>
        </select>
      </label>
      <span
        v-if="valid !== null"
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="
          valid
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
        "
      >
        {{ valid ? 'Valid' : 'Invalid' }}
      </span>
    </div>
  </div>
</template>
