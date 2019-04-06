import 'normalize.css/normalize.css' //[[normalize.css@module]]
import '@/global.sass'

import Vue from 'vue'
import VueScrollTo from 'vue-scrollto' //[[vue-scrollto@module]]
import axios from 'axios' //[[axios@module]]

import App from '@/App.vue'
import router from '@/router' //[[router@internal]]
import store from '@/store' //[[store@internal]]

Vue.use(VueScrollTo) //[[vue-scrollto@module]]

Vue.config.productionTip = false
Vue.prototype.$http = axios //[[axios@module]]

new Vue({
  router, //[[router@internal]]
  store, //[[store@internal]]
  render: h => h(App),
}).$mount('#app')
