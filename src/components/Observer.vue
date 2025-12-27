<script setup lang="ts">
import PCard from 'primevue/card'
import PButton from 'primevue/button'
import { useQuery } from '@tanstack/vue-query'
const props = defineProps<{ observer: { id: number; staleSec: number; gcSec: number } }>()
const emit = defineEmits<{ (e: 'remove', id: number): void }>()

useQuery<{ id: number }>({
  queryKey: ['data'],
  queryFn: () => ({ id: props.observer.id }),
  staleTime: props.observer.staleSec * 1000,
  gcTime: props.observer.gcSec * 1000,
})
</script>

<template>
  <PCard class="w-40 h-full !bg-blue-500">
    <template #content>
      <div class="relative w-full h-full">
        <div class="text-xl font-bold mb-4">#{{ observer.id }}</div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span>stale</span><span>{{ observer.staleSec }}</span>
          </div>
          <div class="flex justify-between">
            <span>gc</span><span>{{ observer.gcSec }}</span>
          </div>
        </div>
        <div class="absolute -top-3 -right-3">
          <PButton
            icon="pi pi-times"
            variant="text"
            rounded
            class="!text-white hover:!bg-white/10 focus:!bg-white/10 focus:!outline-white active:!bg-white/30"
            @click="emit('remove', observer.id)"
          />
        </div>
      </div>
    </template>
  </PCard>
</template>
