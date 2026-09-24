<script setup lang="ts">
import { computed, ref } from 'vue'
import ErrorBox from '../../components/ErrorBox.vue'
import { btn, toolbarCls, field, paneLabel } from '../../ui'

const input = ref(String(Math.floor(Date.now() / 1000)))
const dateInput = ref('')
const copiedKey = ref('')

const parsed = computed(() => {
  const n = Number(input.value.trim())
  if (input.value.trim() === '' || !Number.isFinite(n)) return null
  // heuristic: values past ~336 billion are milliseconds (year 10728 in seconds)
  const ms = Math.abs(n) > 1e11 ? n : n * 1000
  const d = new Date(ms)
  return Number.isNaN(d.getTime()) ? null : { ms, date: d }
})

function relative(date: Date): string {
  const diff = date.getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const abs = Math.abs(diff)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31557600000],
    ['month', 2629800000],
    ['day', 86400000],
    ['hour', 3600000],
    ['minute', 60000],
    ['second', 1000],
  ]
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'second') return rtf.format(Math.round(diff / ms), unit)
  }
  return ''
}

const rows = computed(() => {
  if (!parsed.value) return []
  const { date, ms } = parsed.value
  return [
    { key: 'iso', label: 'ISO 8601', value: date.toISOString() },
    { key: 'local', label: 'Local', value: date.toLocaleString() },
    { key: 'utc', label: 'UTC', value: date.toUTCString() },
    { key: 'relative', label: 'Relative', value: relative(date) },
    { key: 'seconds', label: 'Unix (seconds)', value: String(Math.floor(ms / 1000)) },
    { key: 'millis', label: 'Unix (milliseconds)', value: String(ms) },
  ]
})

const dateToTs = computed(() => {
  if (!dateInput.value) return null
  const d = new Date(dateInput.value)
  return Number.isNaN(d.getTime()) ? null : d
})

function now() {
  input.value = String(Math.floor(Date.now() / 1000))
}

async function copyRow(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    setTimeout(() => (copiedKey.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Unix timestamp (s or ms)
        <input v-model="input" :class="[field, 'w-56 font-mono']" placeholder="1696000000" />
      </label>
      <button :class="btn" @click="now">Now</button>
    </div>

    <div class="flex-1 overflow-auto p-6">
      <div class="mx-auto max-w-2xl space-y-6">
        <ErrorBox
          v-if="input.trim() && !parsed"
          title="Invalid timestamp"
          message="Enter a numeric Unix timestamp in seconds or milliseconds."
        />

        <div v-if="parsed" class="space-y-2">
          <div
            v-for="row in rows"
            :key="row.key"
            class="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <div>
              <p class="text-xs text-zinc-400 uppercase">{{ row.label }}</p>
              <p class="font-mono text-sm text-zinc-800 dark:text-zinc-200">{{ row.value }}</p>
            </div>
            <button class="text-xs text-indigo-500 hover:text-indigo-400" @click="copyRow(row.key, row.value)">
              {{ copiedKey === row.key ? 'copied' : 'copy' }}
            </button>
          </div>
        </div>

        <div>
          <p :class="[paneLabel, 'rounded-t-md border border-zinc-200 dark:border-zinc-800']">
            Date → timestamp
          </p>
          <div
            class="flex flex-wrap items-center gap-3 rounded-b-md border border-t-0 border-zinc-200 p-4 dark:border-zinc-800"
          >
            <input v-model="dateInput" type="datetime-local" step="1" :class="field" />
            <template v-if="dateToTs">
              <button :class="btn" @click="copyRow('dt-s', String(Math.floor(dateToTs.getTime() / 1000)))">
                {{ copiedKey === 'dt-s' ? 'copied' : `${Math.floor(dateToTs.getTime() / 1000)} s` }}
              </button>
              <button :class="btn" @click="copyRow('dt-ms', String(dateToTs.getTime()))">
                {{ copiedKey === 'dt-ms' ? 'copied' : `${dateToTs.getTime()} ms` }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
