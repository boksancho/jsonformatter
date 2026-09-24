<script setup lang="ts">
import { categories, tools } from '../tools/registry'

const grouped = categories.map((c) => ({
  name: c,
  tools: tools.filter((t) => t.category === c),
}))
</script>

<template>
  <div class="flex-1 overflow-y-auto p-6">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">One Util</h2>
      <p class="mt-1 text-sm text-zinc-500">
        A collection of fast, client-side utilities. Nothing leaves your browser.
      </p>

      <div v-for="group in grouped" :key="group.name" class="mt-8">
        <h3
          class="text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500"
        >
          {{ group.name }}
        </h3>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="tool in group.tools"
            :key="tool.id"
            :to="`/${tool.id}`"
            class="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/5"
          >
            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ tool.name }}</p>
            <p class="mt-1 text-sm text-zinc-500">{{ tool.description }}</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
