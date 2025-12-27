<script setup lang="ts">
import { ref } from 'vue'
import Observer from '@/components/Observer.vue'
const observers = ref([
  { id: 1, staleSec: 20, gcSec: 100 },
  { id: 2, staleSec: 40, gcSec: 200 },
  { id: 3, staleSec: 60, gcSec: 300 },
])

const removeObserver = (id: number) => {
  observers.value = observers.value.filter((o) => o.id !== id)
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center">
    <div class="w-full h-full px-12 flex flex-col item-center justify-center">
      <div class="text-4xl font-bold mb-4">Observers</div>
      <div class="flex gap-4">
        <Observer v-for="o in observers" :key="o.id" :observer="o" @remove="removeObserver" />
      </div>
    </div>
  </div>
</template>
