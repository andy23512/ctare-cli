import 'semantic-ui-reset/reset.css' //[[semantic-ui-reset]]
import '@/assets/global.sass'

import Vue from 'vue'
import axios from 'axios' //[[axios]]
import VueRx from 'vue-rx' //[[rxjs]]
import VueAnalytics from 'vue-analytics' //[[vue-analytics]]
import VueScrollTo from 'vue-scrollto' //[[vue-scrollto]]

import App from '@/App.vue'
import router from '@/router' //[[router]]
import store from '@/store' //[[store]]

Vue.use(VueRx) //[[rxjs]]
Vue.use(VueAnalytics, { id: 'UA-XXX-X' }) //[[vue-analystics]]
Vue.use(VueScrollTo) //[[vue-scrollto]]

Vue.config.productionTip = false
Vue.prototype.$http = axios //[[axios]]

new Vue({
  router, //[[router]]
  store, //[[store]]
  render: h => h(App),
}).$mount('#app')
