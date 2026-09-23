<script setup lang="ts">
import JsonTreeNode from './JsonTreeNode.vue'

defineProps<{ data: unknown }>()
</script>

<template>
  <div class="p-4 font-mono text-sm leading-6">
    <JsonTreeNode :value="data" :depth="0" />
  </div>
</template>
