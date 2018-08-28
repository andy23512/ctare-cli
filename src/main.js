//[[semantic-ui-reset]]
import 'semantic-ui-reset/reset.css'
//[[/semantic-ui-reset]]
import '@/assets/global.sass'

import Vue from 'vue'
//[[vue-analytics]]
import VueAnalytics from 'vue-analytics'
//[[/vue-analytics]]
//[[rxjs]]
import VueRx from 'vue-rx'
//[[/rxjs]]
//[[vue-scrollto]]
import VueScrollTo from 'vue-scrollto'
//[[/vue-scrollto]]
//[[axios]]
import axios from 'axios'
//[[/axios]]

import App from '@/App.vue'
//[[router]]
import router from '@/router'
//[[/router]]
//[[store]]
import store from '@/store'
//[[/store]]

//[[vue-analytics]]
Vue.use(VueAnalytics, { id: 'UA-XXX-X' })
//[[/vue-analytics]]
//[[rxjs]]
Vue.use(VueRx)
//[[/rxjs]]
//[[vue-scrollto]]
Vue.use(VueScrollTo)
//[[/vue-scrollto]]

Vue.config.productionTip = false
//[[axios]]
Vue.prototype.$http = axios
//[[/axios]]

new Vue({
//[[router]]
  router,
//[[/router]]
//[[store]]
  store,
//[[/store]]
  render: h => h(App),
}).$mount('#app')
