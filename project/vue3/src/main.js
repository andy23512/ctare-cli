import 'normalize.css/normalize.css' //[[normalize.css@module]]
import '@/global.sass'

import {
  createApp
} from 'vue'
import VueScrollTo from 'vue-scrollto' //[[vue-scrollto@module]]
import axios from 'axios' //[[axios@module]]

import App from '@/App.vue'
import router from '@/router' //[[router@internal]]
import store from '@/store' //[[store@internal]]

const app = createApp(App)
app.use(VueScrollTo) //[[vue-scrollto@module]]

app.http = axios //[[axios@module]]
app.config.globalProperties.$http = axios //[[axios@module]]

app.use(router) //[[router@internal]]
app.use(store) //[[store@internal]]

app.mount('#app')