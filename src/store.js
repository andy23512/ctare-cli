import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mobile: true, //[[query-string]]
    utm_source: '', //[[query-string]]
    utm_medium: '', //[[query-string]]
    utm_campaign: '', //[[query-string]]
    utm_term: '', //[[query-string]]
    utm_content: '', //[[query-string]]
  },
  mutations: {
    checkMobile(state) { //[[query-string]]
      state.mobile = $(window).width() < 992 //[[query-string]]
    }, //[[query-string]]
    saveUtm(state, query) { //[[query-string]]
      state.utm_source = query.utm_source ? query.utm_source : '' //[[query-string]]
      state.utm_medium = query.utm_medium ? query.utm_medium : '' //[[query-string]]
      state.utm_campaign = query.utm_campaign ? query.utm_campaign : '' //[[query-string]]
      state.utm_term = query.utm_term ? query.utm_term : '' //[[query-string]]
      state.utm_content = query.utm_content ? query.utm_content : '' //[[query-string]]
    }, //[[query-string]]
  },
  actions: {

  }
})
