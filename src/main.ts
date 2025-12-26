import { createApp } from 'vue'
import '@/base.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import '@fontsource-variable/noto-sans-jp' // 'Noto Sans JP Variable'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.mount('#app')
