<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import AddObserver from './NumberFields.vue'
const props = defineProps<{ fetch: boolean }>()

const title = computed(() => (props.fetch ? 'Fetch' : 'Ensure'))
const queryClient = useQueryClient()

const fetched = ref(false)
const data = ref<{ text: string } | null>(null)

const ensureQueryData = async (staleSec: number, gcSec: number) => {
  data.value = await queryClient.ensureQueryData<{ text: string }>({
    queryKey: ['data'],
    queryFn: () => {
      fetched.value = true
      setTimeout(() => {
        fetched.value = false
      }, 200)
      return { text: 'Ensure' }
    },
    staleTime: staleSec * 1000,
    gcTime: gcSec * 1000,
  })
}

const fetchQuery = async (staleSec: number, gcSec: number) => {
  data.value = await queryClient.fetchQuery<{ text: string }>({
    queryKey: ['data'],
    queryFn: () => {
      fetched.value = true
      setTimeout(() => {
        fetched.value = false
      }, 200)
      return { text: 'Fetch' }
    },
    staleTime: staleSec * 1000,
    gcTime: gcSec * 1000,
  })
}

const handleConfirm = computed(() => (props.fetch ? fetchQuery : ensureQueryData))
// 右辺をそのまま @add に書くと動かないの、Vue のよくないところかも
</script>

<template>
  <div class="relative flex flex-col">
    <div class="text-4xl font-bold mb-4">{{ title }}</div>
    <AddObserver :label="title" @confirm="handleConfirm">
      <div :class="[$style.fetch, { [$style.fetched]: fetched }]">
        {{ `id: ${data?.text}` || 'No Data' }}
      </div>
    </AddObserver>
  </div>
</template>

<style module>
.fetch {
  position: absolute;
  bottom: -28px;
  opacity: 0;
  transition: opacity 0.3s;
}

.fetched {
  opacity: 1 !important;
}
</style>
