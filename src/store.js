import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mobile: true, //[[Check Mobile]]
    utm_source: '', //[[Save UTM]]
    utm_medium: '', //[[Save UTM]]
    utm_campaign: '', //[[Save UTM]]
    utm_term: '', //[[Save UTM]]
    utm_content: '', //[[Save UTM]]
  },
  mutations: {
    checkMobile(state) { //[[Check Mobile]]
      state.mobile = $(window).width() < 992 //[[Check Mobile|jquery]]
      state.mobile = window.innerWidth < 992 //[[Check Mobile|!jquery]]
    }, //[[Check Mobile]]
    saveUtm(state, query) { //[[Save UTM]]
      state.utm_source = query.utm_source ? query.utm_source : '' //[[Save UTM]]
      state.utm_medium = query.utm_medium ? query.utm_medium : '' //[[Save UTM]]
      state.utm_campaign = query.utm_campaign ? query.utm_campaign : '' //[[Save UTM]]
      state.utm_term = query.utm_term ? query.utm_term : '' //[[Save UTM]]
      state.utm_content = query.utm_content ? query.utm_content : '' //[[Save UTM]]
    }, //[[Save UTM]]
  },
  actions: {

  }
})
