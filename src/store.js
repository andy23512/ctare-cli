import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mobile: true, //[[Check Mobile]]
    utm: { //[[Save UTM]]
      utm_source: '', //[[Save UTM]]
      utm_medium: '', //[[Save UTM]]
      utm_campaign: '', //[[Save UTM]]
      utm_term: '', //[[Save UTM]]
      utm_content: '', //[[Save UTM]]
    }, //[[Save UTM]]
    scroll: {
      offset: 0,
      sections: [],
      position: '',
    }
  },
  mutations: {
    checkMobile(state) { //[[Check Mobile]]
      state.mobile = $(window).width() < 1000 //[[Check Mobile,jquery]]
      state.mobile = window.innerWidth < 1000 //[[Check Mobile,!jquery]]
    }, //[[Check Mobile]]
    saveUtm(state, query) { //[[Save UTM]]
      state.utm.utm_source = query.utm_source ? query.utm_source : '' //[[Save UTM]]
      state.utm.utm_medium = query.utm_medium ? query.utm_medium : '' //[[Save UTM]]
      state.utm.utm_campaign = query.utm_campaign ? query.utm_campaign : '' //[[Save UTM]]
      state.utm.utm_term = query.utm_term ? query.utm_term : '' //[[Save UTM]]
      state.utm.utm_content = query.utm_content ? query.utm_content : '' //[[Save UTM]]
    }, //[[Save UTM]]
    setScrollPosition(state, position) {
      state.scroll.position = position
    },
  },
  actions: {

  }
})
