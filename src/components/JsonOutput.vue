<script setup lang="ts">
import type { ParseResult, Token, TokenType } from '../utils/json'
import JsonTree from './JsonTree.vue'

defineProps<{
  result: ParseResult | null
  output: string
  tokens: Token[]
}>()

const tab = defineModel<'formatted' | 'tree'>('tab', { required: true })

const tokenClass: Record<TokenType, string> = {
  key: 'text-sky-300',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  boolean: 'text-fuchsia-400',
  null: 'text-rose-400',
  punct: 'text-zinc-500',
}

const tabBtn = (active: boolean) =>
  `px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
    active ? 'border-b-2 border-indigo-500 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
  }`
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-1 border-b border-zinc-800 px-2">
      <button :class="tabBtn(tab === 'formatted')" @click="tab = 'formatted'">Formatted</button>
      <button :class="tabBtn(tab === 'tree')" @click="tab = 'tree'">Tree</button>
    </div>

    <div v-if="result === null" class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-600">
      Enter JSON on the left to see it here.
    </div>

    <div v-else-if="!result.ok" class="flex-1 overflow-auto p-4">
      <div class="rounded-md border border-rose-500/40 bg-rose-500/10 p-4">
        <p class="text-sm font-medium text-rose-400">Invalid JSON</p>
        <p class="mt-1 font-mono text-sm text-rose-300">{{ result.error.message }}</p>
        <p v-if="result.error.line !== undefined" class="mt-2 text-xs text-rose-400/80">
          Line {{ result.error.line }}, column {{ result.error.column }}
        </p>
      </div>
    </div>

    <template v-else>
      <pre
        v-if="tab === 'formatted'"
        class="flex-1 overflow-auto p-4 font-mono text-sm leading-6"
      ><code><span v-for="(t, i) in tokens" :key="i" :class="tokenClass[t.type]">{{ t.text }}</span></code></pre>
      <div v-else class="flex-1 overflow-auto">
        <JsonTree :data="result.data" />
      </div>
    </template>
  </div>
</template>
