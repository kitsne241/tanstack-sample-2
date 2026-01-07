<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
const query = useQuery<{ text: string }>({
  queryKey: ['data'],
  queryFn: () => ({ text: 'None' }),
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
  return `text: ${query.data.value.text}`
})
</script>

<template>
  <div>{{ dataText }}</div>
</template>
