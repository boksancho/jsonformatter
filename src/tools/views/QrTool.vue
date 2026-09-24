<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import TextArea from '../../components/TextArea.vue'
import ErrorBox from '../../components/ErrorBox.vue'
import TwoPane from '../../components/TwoPane.vue'
import { btn, toolbarCls, field } from '../../ui'

const input = ref('https://example.com')
const size = ref(256)
const dataUrl = ref('')
const error = ref('')

let timer: ReturnType<typeof setTimeout> | undefined
watch(
  [input, size],
  ([text, s]) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (!text.trim()) {
        dataUrl.value = ''
        error.value = ''
        return
      }
      try {
        dataUrl.value = await QRCode.toDataURL(text, { width: s, margin: 2 })
        error.value = ''
      } catch (e) {
        dataUrl.value = ''
        error.value = e instanceof Error ? e.message : String(e)
      }
    }, 200)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div :class="toolbarCls">
      <label class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        Size
        <select v-model.number="size" :class="field">
          <option :value="128">128px</option>
          <option :value="256">256px</option>
          <option :value="512">512px</option>
          <option :value="1024">1024px</option>
        </select>
      </label>
      <div class="ml-auto">
        <a
          v-if="dataUrl"
          :href="dataUrl"
          download="qrcode.png"
          :class="btn"
          class="inline-block"
        >
          Download PNG
        </a>
      </div>
    </div>

    <TwoPane input-label="Content" output-label="QR code">
      <template #input>
        <TextArea v-model="input" placeholder="Text or URL to encode..." />
      </template>
      <template #output>
        <div class="flex flex-1 items-center justify-center p-8">
          <p v-if="!input.trim()" class="text-sm text-zinc-400 dark:text-zinc-600">
            Type on the left to generate a QR code.
          </p>
          <ErrorBox v-else-if="error" title="Could not encode" :message="error" class="max-w-md" />
          <img
            v-else-if="dataUrl"
            :src="dataUrl"
            :width="size"
            :height="size"
            alt="QR code"
            class="rounded-md border border-zinc-200 bg-white dark:border-zinc-800"
            :style="{ maxWidth: '100%', height: 'auto' }"
          />
        </div>
      </template>
    </TwoPane>
  </div>
</template>
