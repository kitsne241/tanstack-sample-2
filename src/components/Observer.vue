<script setup lang="ts">
import PCard from 'primevue/card'
</script>

<template>
  <PCard class="w-60 h-45 !bg-blue-500">
    <template #content>
      <div class="text-xl font-bold mb-4">#1</div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between"><span>queryFn:</span><span>JP</span></div>
        <div class="flex justify-between"><span>staleTime:</span><span>1day</span></div>
        <div class="flex justify-between"><span>gcTime</span><span>1day</span></div>
      </div>
    </template>
  </PCard>
</template>
