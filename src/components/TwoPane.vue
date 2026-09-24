<script setup lang="ts">
import { paneLabel } from '../ui'

defineProps<{ inputLabel?: string; outputLabel?: string }>()
</script>

<template>
  <div class="flex flex-1 flex-col md:flex-row">
    <section
      class="flex min-h-[40vh] flex-1 flex-col border-b border-zinc-200 md:border-r md:border-b-0 dark:border-zinc-800"
    >
      <div v-if="inputLabel" :class="paneLabel">{{ inputLabel }}</div>
      <slot name="input" />
    </section>
    <section class="flex min-h-[40vh] flex-1 flex-col overflow-hidden">
      <div v-if="outputLabel" :class="paneLabel">{{ outputLabel }}</div>
      <slot name="output" />
    </section>
  </div>
</template>
