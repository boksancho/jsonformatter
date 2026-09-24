<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { tools, type ToolMeta } from './tools/registry'

const theme = ref<'dark' | 'light'>(
  document.documentElement.classList.contains('dark') ? 'dark' : 'light',
)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  localStorage.setItem('theme', theme.value)
}

const menuOpen = ref(false)
const route = useRoute()

const currentTool = computed<ToolMeta | undefined>(
  () => (route.meta.tool as ToolMeta | undefined) ?? tools.find((t) => t.id === route.name),
)
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
  >
    <header
      class="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"
    >
      <div class="flex items-center gap-3">
        <button
          class="rounded-md border border-zinc-300 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 md:hidden dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {{ currentTool?.name ?? 'One Util' }}
          </h1>
          <p class="text-sm text-zinc-500">
            {{ currentTool?.description ?? 'Client-side utilities for developers' }}
          </p>
        </div>
      </div>
      <button
        class="rounded-md border border-zinc-300 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <svg
          v-if="theme === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591 1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </button>
    </header>

    <div class="flex min-h-0 flex-1">
      <Sidebar :open="menuOpen" @close="menuOpen = false" />
      <main class="flex min-w-0 flex-1 flex-col">
        <RouterView />
      </main>
    </div>
  </div>
</template>
