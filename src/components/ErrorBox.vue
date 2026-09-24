<script setup lang="ts">
defineProps<{ title?: string; message: string; detail?: string }>()
</script>

<template>
  <div class="rounded-md border border-rose-500/40 bg-rose-500/10 p-4">
    <p class="text-sm font-medium text-rose-600 dark:text-rose-400">{{ title ?? 'Error' }}</p>
    <p class="mt-1 font-mono text-sm break-all whitespace-pre-wrap text-rose-500 dark:text-rose-300">
      {{ message }}
    </p>
    <p v-if="detail" class="mt-2 text-xs text-rose-500/80 dark:text-rose-400/80">{{ detail }}</p>
  </div>
</template>
