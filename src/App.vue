<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTime } from '@/utils'
import Observer from '@/components/Observer.vue'
import PToggleSwitch from 'primevue/toggleswitch'
import DataViewer from './components/DataViewer.vue'
import AddObserver from './components/AddObserver.vue'

const idCounter = ref(0)
const isValueOpen = ref(true)
const maxGcSec = ref(0)
const noObserverTimeStamp = ref(0)
const { currentTime } = useTime()

const observers = ref<{ id: number; staleSec: number; gcSec: number }[]>([])
const removeObserver = (id: number) => {
  observers.value = observers.value.filter((o) => o.id !== id)
  if (observers.value.length === 0 && !isValueOpen.value) {
    noObserverTimeStamp.value = currentTime.value.getTime()
  }
}
const addObserver = (staleSec: number, gcSec: number) => {
  observers.value.push({ id: ++idCounter.value, staleSec, gcSec })
  maxGcSec.value = Math.max(maxGcSec.value, gcSec)
}

watch(
  () => isValueOpen.value,
  (newVal) => {
    if (!newVal && observers.value.length === 0) {
      noObserverTimeStamp.value = currentTime.value.getTime()
    }
  }
)

const gcCountDown = ref('')
watch(
  () => currentTime.value,
  () => {
    if (observers.value.length > 0 || isValueOpen.value) {
      gcCountDown.value = '-'
      return // まだ gcTime カウントが始まっていない
    }

    const passedSec = (currentTime.value.getTime() - noObserverTimeStamp.value) / 1000
    if (maxGcSec.value > passedSec) {
      gcCountDown.value = 'GC CountDown: ' + (maxGcSec.value - passedSec).toFixed(3)
      return
    } else {
      if (gcCountDown.value !== 'Cache Cleared') {
        // ガベージコレクション発生
        gcCountDown.value = 'Cache Cleared'
        maxGcSec.value = 0
        return
      }
    }
  }
)

watch(
  () => gcCountDown.value,
  (newVal) => {
    // ガベージコレクション発生
    if (newVal === '0') {
      maxGcSec.value = 0
    }
  }
)
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
      <div class="mb-2">{{ gcCountDown }}</div>
      <div class="flex items-center gap-4">
        <PToggleSwitch v-model="isValueOpen" />
        <DataViewer v-if="isValueOpen" />
      </div>
    </div>
  </div>
</template>
