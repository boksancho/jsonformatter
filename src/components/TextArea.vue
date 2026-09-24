<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{ placeholder?: string }>()
</script>

<template>
  <textarea
    v-model="model"
    spellcheck="false"
    :placeholder="placeholder"
    class="w-full flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-zinc-800 placeholder-zinc-400 outline-none dark:text-zinc-200 dark:placeholder-zinc-600"
  ></textarea>
</template>
