<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import TextArea from '../../components/TextArea.vue'
import ErrorBox from '../../components/ErrorBox.vue'
import TwoPane from '../../components/TwoPane.vue'
import { btn, toolbarCls, field } from '../../ui'

const FLAG_OPTIONS = [
  { id: 'i', label: 'i', hint: 'case insensitive' },
  { id: 'm', label: 'm', hint: 'multiline anchors' },
  { id: 's', label: 's', hint: 'dot matches newlines' },
  { id: 'u', label: 'u', hint: 'unicode' },
  { id: 'y', label: 'y', hint: 'sticky' },
] as const

const pattern = ref('\\b[\\w.]+@[\\w.]+\\.[a-z]{2,}\\b')
const flags = reactive<Record<string, boolean>>({ i: true, m: false, s: false, u: false, y: false })
const testText = ref('Contact ada@example.com or alan@dev.io,\nnot an-email@')

const compiled = computed(() => {
  const f = 'g' + FLAG_OPTIONS.filter((x) => flags[x.id]).map((x) => x.id).join('')
  try {
    return { re: new RegExp(pattern.value, f), error: '' }
  } catch (e) {
    return { re: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const matches = computed(() => {
  const re = compiled.value.re
  if (!re || !testText.value || !pattern.value) return []
  return [...testText.value.matchAll(re)].slice(0, 500).map((m) => ({
    index: m.index,
    text: m[0],
    groups: m.slice(1),
  }))
})

const segments = computed(() => {
  const text = testText.value
  if (!matches.value.length) return [{ text, match: false }]
  const segs: { text: string; match: boolean }[] = []
  let last = 0
  for (const m of matches.value) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), match: false })
    if (m.text.length) segs.push({ text: m.text, match: true })
    last = m.index + m.text.length
  }
  if (last < text.length) segs.push({ text: text.slice(last), match: false })
  return segs
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <span class="font-mono text-sm text-zinc-400">/</span>
      <input
        v-model="pattern"
        :class="[field, 'min-w-40 flex-1 font-mono']"
        placeholder="Regular expression"
        spellcheck="false"
      />
      <span class="font-mono text-sm text-zinc-400">/g</span>
      <label
        v-for="f in FLAG_OPTIONS"
        :key="f.id"
        class="flex items-center gap-1 text-sm text-zinc-600 select-none dark:text-zinc-300"
        :title="f.hint"
      >
        <input v-model="flags[f.id]" type="checkbox" />{{ f.label }}
      </label>
      <button :class="btn" @click="testText = ''">Clear</button>
    </div>

    <TwoPane input-label="Test string" output-label="Matches">
      <template #input>
        <TextArea v-model="testText" placeholder="Type the text to test against..." />
      </template>
      <template #output>
        <div class="flex-1 overflow-auto p-4">
          <ErrorBox v-if="compiled.error" title="Invalid regex" :message="compiled.error" />
          <template v-else>
            <p class="mb-2 text-xs text-zinc-500">
              {{ matches.length }} match{{ matches.length === 1 ? '' : 'es' }}
              <span v-if="matches.length === 500">(showing first 500)</span>
            </p>
            <pre
              class="rounded-md bg-zinc-100 p-3 font-mono text-sm leading-6 break-all whitespace-pre-wrap text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            ><span v-for="(s, i) in segments" :key="i" :class="s.match ? 'rounded bg-indigo-500/30 text-indigo-700 dark:text-indigo-200' : ''">{{ s.text }}</span></pre>

            <ul v-if="matches.length" class="mt-4 space-y-2">
              <li
                v-for="(m, i) in matches"
                :key="i"
                class="rounded-md border border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-800"
              >
                <span class="text-zinc-400">#{{ i + 1 }} @{{ m.index }}</span>
                <span class="ml-2 text-indigo-600 dark:text-indigo-300">{{ JSON.stringify(m.text) }}</span>
                <div v-if="m.groups.length" class="mt-1 text-zinc-500">
                  <div v-for="(g, gi) in m.groups" :key="gi">
                    ${{ gi + 1 }} = {{ JSON.stringify(g) }}
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </template>
    </TwoPane>
  </div>
</template>
