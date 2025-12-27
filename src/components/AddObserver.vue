<script setup lang="ts">
import { ref } from 'vue'
import PCard from 'primevue/card'
import PButton from 'primevue/button'
import PInputNumber from 'primevue/inputnumber'
const emit = defineEmits<{ (e: 'add', staleSec: number, gcSec: number): void }>()
const staleSec = ref<number>()
const gcSec = ref<number>()

const handleAdd = () => {
  if (staleSec.value && gcSec.value) {
    emit('add', staleSec.value, gcSec.value)
    staleSec.value = undefined
    gcSec.value = undefined
  }
}
</script>

<template>
  <PCard class="w-60 h-full">
    <template #content>
      <div class="relative w-full h-full flex flex-col justify-center gap-2">
        <PInputNumber
          v-model="staleSec"
          placeholder="StaleSec"
          size="small"
          :class="$style.input"
        />
        <PInputNumber v-model="gcSec" placeholder="GcSec" size="small" :class="$style.input" />
        <PButton label="Add" size="small" variant="text" @click="handleAdd" />
      </div>
    </template>
  </PCard>
</template>

<style module>
.input :global(input) {
  background-color: inherit !important;
}
</style>
