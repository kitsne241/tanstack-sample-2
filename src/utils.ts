import { ref, computed } from 'vue'

export function useTime() {
  const currentTime = ref(new Date())
  const updateTime = () => {
    currentTime.value = new Date()
    requestAnimationFrame(updateTime)
  }
  updateTime() // 呼び出されて即座に現在時刻の更新を開始
  return {
    currentTime: computed(() => currentTime.value),
  }
}
