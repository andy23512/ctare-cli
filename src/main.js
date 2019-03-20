import 'normalize.css/normalize.css' //[[normalize.css]]
import '@/global.sass'

import Vue from 'vue'
import VueRx from 'vue-rx' //[[rxjs]]
import VueScrollTo from 'vue-scrollto' //[[vue-scrollto]]
import axios from 'axios' //[[axios]]

import App from '@/App.vue'
import router from '@/router' //[[router]]
import store from '@/store' //[[store]]

Vue.use(VueRx) //[[rxjs]]
Vue.use(VueScrollTo) //[[vue-scrollto]]

Vue.config.productionTip = false
Vue.http = axios //[[axios]]
Vue.prototype.$http = axios //[[axios]]

new Vue({
  router, //[[router]]
  store, //[[store]]
  render: h => h(App),
}).$mount('#app')
