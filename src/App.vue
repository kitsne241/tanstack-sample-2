<script setup lang="ts">
// import PButton from 'primevue/button'
import Observer from '@/components/Observer.vue'
</script>

<template>
  <div class="w-screen h-screen flex justify-center">
    <div class="w-full h-full px-12 flex flex-col item-center justify-center">
      <div class="text-4xl font-bold mb-4">Observers</div>
      <div class="flex gap-4">
        <Observer v-for="i in [1, 2, 3]" :key="i" />
      </div>
    </div>
  </div>
</template>
