<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
const query = useQuery<{ id: number }>({
  queryKey: ['data'],
  queryFn: () => ({ id: -1 }),
  staleTime: Infinity,
  gcTime: 0,
})

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
