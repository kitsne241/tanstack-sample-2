<script setup lang="ts">
import { ref } from 'vue'
import Observer from '@/components/Observer.vue'
import PToggleSwitch from 'primevue/toggleswitch'
import DataViewer from './components/DataViewer.vue'
import AddObserver from './components/AddObserver.vue'

const idCounter = ref(0)

const observers = ref<{ id: number; staleSec: number; gcSec: number }[]>([])

const removeObserver = (id: number) => {
  observers.value = observers.value.filter((o) => o.id !== id)
}

const addObserver = (staleSec: number, gcSec: number) => {
  observers.value.push({ id: ++idCounter.value, staleSec, gcSec })
}

const isValueOpen = ref(true)
</script>

<template>
  <div class="w-screen h-screen flex justify-center">
    <div class="w-full h-full px-12 flex flex-col justify-center">
      <div class="text-4xl font-bold mb-4">Observers</div>
      <div class="flex gap-4 h-40 mb-8">
        <Observer v-for="o in observers" :key="o.id" :observer="o" @remove="removeObserver" />
        <AddObserver @add="addObserver" />
      </div>
      <div class="text-4xl font-bold mb-4">Value</div>
      <div class="flex items-center gap-4">
        <PToggleSwitch v-model="isValueOpen" />
        <DataViewer v-if="isValueOpen" />
      </div>
    </div>
  </div>
</template>
