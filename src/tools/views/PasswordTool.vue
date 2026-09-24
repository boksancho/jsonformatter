<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCopy } from '../../composables/useCopy'
import { btn, btnPrimary, toolbarCls, divider } from '../../ui'

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~',
}
const AMBIGUOUS = /[Il1O0|]/g

const length = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useDigits = ref(true)
const useSymbols = ref(true)
const excludeAmbiguous = ref(false)
const password = ref('')
const { copied, copy } = useCopy()

const charset = computed(() => {
  let s = ''
  if (useUpper.value) s += SETS.upper
  if (useLower.value) s += SETS.lower
  if (useDigits.value) s += SETS.digits
  if (useSymbols.value) s += SETS.symbols
  if (excludeAmbiguous.value) s = s.replace(AMBIGUOUS, '')
  return s
})

const entropy = computed(() => {
  if (!charset.value) return 0
  return Math.round(length.value * Math.log2(charset.value.length))
})

const strength = computed(() => {
  if (entropy.value < 45) return { label: 'Weak', cls: 'bg-rose-500' }
  if (entropy.value < 75) return { label: 'Fair', cls: 'bg-amber-500' }
  if (entropy.value < 110) return { label: 'Strong', cls: 'bg-emerald-500' }
  return { label: 'Excellent', cls: 'bg-emerald-600' }
})

function generate() {
  const chars = charset.value
  if (!chars) {
    password.value = ''
    return
  }
  const bytes = crypto.getRandomValues(new Uint32Array(length.value))
  let out = ''
  for (const b of bytes) out += chars[b % chars.length]
  password.value = out
}

watch([length, useUpper, useLower, useDigits, useSymbols, excludeAmbiguous], generate, {
  immediate: true,
})

const toggle = 'flex items-center gap-1.5 text-sm text-zinc-600 select-none dark:text-zinc-300'
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Length: {{ length }}
        <input v-model.number="length" type="range" min="4" max="64" class="w-32" />
      </label>
      <span :class="divider" />
      <label :class="toggle"><input v-model="useUpper" type="checkbox" /> A-Z</label>
      <label :class="toggle"><input v-model="useLower" type="checkbox" /> a-z</label>
      <label :class="toggle"><input v-model="useDigits" type="checkbox" /> 0-9</label>
      <label :class="toggle"><input v-model="useSymbols" type="checkbox" /> Symbols</label>
      <label :class="toggle"><input v-model="excludeAmbiguous" type="checkbox" /> No ambiguous</label>
      <button :class="btnPrimary" @click="generate">Regenerate</button>
    </div>

    <div class="flex flex-1 items-center justify-center p-8">
      <div class="w-full max-w-2xl">
        <div
          class="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center font-mono text-xl break-all text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {{ password || 'Select at least one character set' }}
        </div>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              class="h-full rounded-full transition-all"
              :class="strength.cls"
              :style="{ width: `${Math.min(100, (entropy / 128) * 100)}%` }"
            />
          </div>
          <span class="text-sm text-zinc-500">{{ strength.label }} · ~{{ entropy }} bits</span>
        </div>
        <div class="mt-6 flex justify-center">
          <button :class="btn" @click="copy(password)">
            {{ copied ? 'Copied!' : 'Copy password' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
