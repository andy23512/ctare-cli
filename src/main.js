import 'normalize.css/normalize.css' //[[normalize.css@module]]
import '@/global.sass'

import Vue from 'vue'
import VueRx from 'vue-rx' //[[rxjs@module]]
import VueScrollTo from 'vue-scrollto' //[[vue-scrollto@module]]
import axios from 'axios' //[[axios@module]]

import App from '@/App.vue'
import router from '@/router' //[[router@module]]
import store from '@/store' //[[store@module]]

Vue.use(VueRx) //[[rxjs@module]]
Vue.use(VueScrollTo) //[[vue-scrollto@module]]

Vue.config.productionTip = false
Vue.http = axios //[[axios@module]]
Vue.prototype.$http = axios //[[axios@module]]

new Vue({
  router, //[[router@internal]]
  store, //[[store@internal]]
  render: h => h(App),
}).$mount('#app')
