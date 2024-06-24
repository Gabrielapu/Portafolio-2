import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import dayjs from './plugins/dayjs.js'
import toastObj from './plugins/toastify.js'
import vSelect from './plugins/vue-select'
import VueDatePicker from './plugins/datepicker'
import VueApexCharts from "vue3-apexcharts";

import './index.css'
import './plugins/vee-validate-rules.js'

const {Vue3Toastify, ToastContainerOptions, toast} = toastObj

const app = createApp(App)

app.use(VueApexCharts);
app.use(Vue3Toastify, ToastContainerOptions)
app.use(createPinia())
app.use(router)

app.component('vSelect', vSelect)
app.component('VueDatePicker', VueDatePicker);

app.provide('dayjs', dayjs)
app.provide('toast', toast) 

app.mount('#app')
