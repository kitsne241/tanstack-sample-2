<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
const query = useQuery<{ id: number }>({ queryKey: ['data'] })
const dataText = computed(() => {
  if (query.isFetching.value) {
    return 'Loading...'
  }
  if (query.isError.value) {
    return 'Error'
  }
  if (!query.data.value) {
    return 'No Data'
  }
  return `id: ${query.data.value.id}`
})
</script>

<template>
  <div>{{ dataText }}</div>
</template>
