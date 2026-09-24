<script setup lang="ts">
import { computed, ref } from 'vue'
import TextArea from '../../components/TextArea.vue'
import ErrorBox from '../../components/ErrorBox.vue'
import TwoPane from '../../components/TwoPane.vue'
import { btn, toolbarCls } from '../../ui'

function b64urlDecode(part: string): string {
  const s = part.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const input = ref('')
const copiedPart = ref('')

type Decoded =
  | { error: string }
  | { header: string; payload: string; signature: string; claims: Record<string, unknown> }

const decoded = computed<Decoded | null>(() => {
  const t = input.value.trim()
  if (!t) return null
  const parts = t.split('.')
  if (parts.length !== 3) return { error: 'A JWT has three dot-separated parts: header.payload.signature' }
  try {
    const header = JSON.parse(b64urlDecode(parts[0]!))
    const payload = JSON.parse(b64urlDecode(parts[1]!))
    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: parts[2]!,
      claims: payload as Record<string, unknown>,
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
})

const claimInfo = computed(() => {
  const c = decoded.value
  if (!c || 'error' in c) return []
  const rows: { key: string; label: string; value: string }[] = []
  for (const key of ['exp', 'iat', 'nbf'] as const) {
    const v = c.claims[key]
    if (typeof v === 'number') {
      rows.push({ key, label: key, value: new Date(v * 1000).toLocaleString() })
    }
  }
  return rows
})

const sections = computed(() => {
  const c = decoded.value
  if (!c || 'error' in c) return []
  return [
    { key: 'header', label: 'Header', text: c.header },
    { key: 'payload', label: 'Payload', text: c.payload },
    { key: 'signature', label: 'Signature', text: c.signature },
  ]
})

const expired = computed(() => {
  const c = decoded.value
  if (!c || 'error' in c) return null
  const exp = c.claims['exp']
  return typeof exp === 'number' ? exp * 1000 < Date.now() : null
})

async function copyPart(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedPart.value = key
    setTimeout(() => (copiedPart.value = ''), 1200)
  } catch {
    // clipboard unavailable — ignore
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <button :class="btn" @click="input = SAMPLE">Sample</button>
      <button :class="btn" @click="input = ''">Clear</button>
      <span
        v-if="expired !== null"
        class="ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="
          expired
            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
        "
      >
        {{ expired ? 'Expired' : 'Not expired' }}
      </span>
    </div>

    <TwoPane input-label="Token" output-label="Decoded">
      <template #input>
        <TextArea v-model="input" placeholder="Paste a JWT (header.payload.signature)..." />
      </template>
      <template #output>
        <div
          v-if="decoded === null"
          class="flex flex-1 items-center justify-center p-8 text-sm text-zinc-400 dark:text-zinc-600"
        >
          Paste a JWT on the left to decode it. Signature is not verified.
        </div>
        <div v-else-if="'error' in decoded" class="flex-1 overflow-auto p-4">
          <ErrorBox title="Invalid JWT" :message="decoded.error" />
        </div>
        <div v-else class="flex-1 space-y-4 overflow-auto p-4">
          <div v-if="claimInfo.length" class="flex flex-wrap gap-2">
            <span
              v-for="c in claimInfo"
              :key="c.key"
              class="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <span class="font-mono font-semibold">{{ c.label }}</span> · {{ c.value }}
            </span>
          </div>

          <div v-for="part in sections" :key="part.key">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                {{ part.label }}
              </p>
              <button class="text-xs text-indigo-500 hover:text-indigo-400" @click="copyPart(part.key, part.text)">
                {{ copiedPart === part.key ? 'copied' : 'copy' }}
              </button>
            </div>
            <pre
              class="mt-1 overflow-auto rounded-md bg-zinc-100 p-3 font-mono text-xs break-all whitespace-pre-wrap text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >{{ part.text }}</pre>
          </div>
        </div>
      </template>
    </TwoPane>
  </div>
</template>
