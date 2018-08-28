import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mobile: true,
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  },
  mutations: {
//[[check-mobile]]
    checkMobile(state) {
      state.mobile = $(window).width() < 992
    },
//[[/check-mobile]]
    saveUtm(state, query) {
      state.utm_source = query.utm_source ? query.utm_source : ''
      state.utm_medium = query.utm_medium ? query.utm_medium : ''
      state.utm_campaign = query.utm_campaign ? query.utm_campaign : ''
      state.utm_term = query.utm_term ? query.utm_term : ''
      state.utm_content = query.utm_content ? query.utm_content : ''
    },
  },
  actions: {

  }
})
