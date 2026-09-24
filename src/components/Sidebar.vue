<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { categories, tools } from '../tools/registry'
import { field } from '../ui'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return tools
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords?.some((k) => k.includes(q)),
  )
})

const grouped = computed(() =>
  categories
    .map((c) => ({ name: c, tools: filtered.value.filter((t) => t.category === c) }))
    .filter((g) => g.tools.length > 0),
)

const linkCls = (id: string) =>
  `block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
    route.name === id
      ? 'bg-indigo-500/15 font-medium text-indigo-600 dark:text-indigo-300'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
  }`
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    @click="emit('close')"
  />
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform md:static md:z-auto md:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950"
    :class="props.open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-3">
      <input v-model="query" type="search" placeholder="Search tools..." :class="[field, 'w-full']" />
    </div>
    <nav class="flex-1 overflow-y-auto px-3 pb-4">
      <RouterLink
        to="/"
        :class="linkCls('home')"
        class="mb-2"
        @click="emit('close')"
      >
        All tools
      </RouterLink>
      <div v-for="group in grouped" :key="group.name" class="mt-4">
        <p
          class="px-2.5 pb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500"
        >
          {{ group.name }}
        </p>
        <RouterLink
          v-for="tool in group.tools"
          :key="tool.id"
          :to="`/${tool.id}`"
          :class="linkCls(tool.id)"
          @click="emit('close')"
        >
          {{ tool.name }}
        </RouterLink>
      </div>
      <p v-if="grouped.length === 0" class="px-2.5 text-sm text-zinc-400">No tools found.</p>
    </nav>
  </aside>
</template>
