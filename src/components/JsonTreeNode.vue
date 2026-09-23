<script setup lang="ts">
import { computed, ref } from 'vue'
import { jsonType } from '../utils/json'

const props = withDefaults(
  defineProps<{
    keyName?: string
    value: unknown
    depth?: number
  }>(),
  { depth: 0 },
)

const expanded = ref(props.depth < 2)

const type = computed(() => jsonType(props.value))
const isContainer = computed(() => type.value === 'object' || type.value === 'array')

const entries = computed<[string, unknown][]>(() => {
  if (type.value === 'array') {
    return (props.value as unknown[]).map((v, i) => [String(i), v])
  }
  if (type.value === 'object') {
    return Object.entries(props.value as Record<string, unknown>)
  }
  return []
})

const displayValue = computed(() => {
  if (type.value === 'string') return JSON.stringify(props.value)
  return String(props.value)
})

const valueClass = computed(() => {
  const map: Record<string, string> = {
    string: 'text-emerald-600 dark:text-emerald-300',
    number: 'text-amber-600 dark:text-amber-300',
    boolean: 'text-fuchsia-600 dark:text-fuchsia-400',
    null: 'text-rose-500 dark:text-rose-400',
  }
  return map[type.value] ?? 'text-zinc-700 dark:text-zinc-300'
})
</script>

<template>
  <div>
    <div class="flex items-center" :style="{ paddingLeft: `${depth * 16}px` }">
      <button
        v-if="isContainer"
        class="w-5 shrink-0 cursor-pointer text-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        @click="expanded = !expanded"
      >
        {{ expanded ? '▾' : '▸' }}
      </button>
      <span v-else class="w-5 shrink-0" />

      <template v-if="keyName !== undefined">
        <span class="text-sky-600 dark:text-sky-300">"{{ keyName }}"</span>
        <span class="mr-1 text-zinc-500">:</span>
      </template>

      <template v-if="isContainer">
        <span class="text-zinc-500">{{ type === 'array' ? '[' : '{' }}</span>
        <span
          class="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.5 text-xs leading-4 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {{ entries.length }} {{ type === 'array' ? 'items' : 'keys' }}
        </span>
        <span v-if="!expanded" class="text-zinc-500">
          <span class="mx-1">…</span>{{ type === 'array' ? ']' : '}' }}
        </span>
      </template>
      <span v-else :class="valueClass">{{ displayValue }}</span>
    </div>

    <template v-if="isContainer && expanded">
      <JsonTreeNode
        v-for="[k, v] in entries"
        :key="k"
        :key-name="k"
        :value="v"
        :depth="depth + 1"
      />
      <div :style="{ paddingLeft: `${depth * 16 + 20}px` }" class="text-zinc-500">
        {{ type === 'array' ? ']' : '}' }}
      </div>
    </template>
  </div>
</template>
