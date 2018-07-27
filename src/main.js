import 'semantic-ui-reset/reset.css'
import '@/assets/global.sass'

import Vue from 'vue'
import axios from 'axios'

import App from '@/App.vue'
import router from '@/router' //[[router]]
import store from '@/store' //[[store]]

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router, //[[router]]
  store, //[[store]]
  render: h => h(App),
}).$mount('#app')
