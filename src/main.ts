import { createApp } from 'vue'
import '@/base.css'

import 'primeicons/primeicons.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

import '@fontsource-variable/noto-sans-jp' // 'Noto Sans JP Variable'

// キャッシュの設定
export const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(VueQueryPlugin, { queryClient })

console.log('isDev:', import.meta.env.DEV)
console.log('Mode:', import.meta.env.MODE)

app.mount('#app')
