import { shallowRef, onMounted, onUnmounted, readonly } from 'vue'

export function useTime() {
  const currentTime = shallowRef(new Date()) // 負荷を軽減
  let animationFrameId: number

  const updateTime = () => {
    currentTime.value = new Date()
    animationFrameId = requestAnimationFrame(updateTime)
  }

  onMounted(updateTime)
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })

  return { currentTime: readonly(currentTime) }
}
