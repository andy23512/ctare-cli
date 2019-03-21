import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mobile: true, //[[Check Mobile]]
    //<<save-utm@function>>
    utm: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    },
    //<</save-utm@function>>
    //<<check-mobile@function&vue-scrollto@module|track-scroll-position@function>>
    scroll: {
      offset: 0,
      sections: [], //[[track-scroll-position@function]]
      position: '', //[[track-scroll-position@function]]
    },
    //<</check-mobile@function&vue-scrollto@module|track-scroll-position@function>>
  },
  mutations: {
    //<<save-utm@function>>
    saveUtm(state, query) {
      state.utm.utm_source = query.utm_source ? query.utm_source : ''
      state.utm.utm_medium = query.utm_medium ? query.utm_medium : ''
      state.utm.utm_campaign = query.utm_campaign ? query.utm_campaign : ''
      state.utm.utm_term = query.utm_term ? query.utm_term : ''
      state.utm.utm_content = query.utm_content ? query.utm_content : ''
    },
    //<<save-utm@function>>
    //<<check-mobile@function>>
    setMobile(state, mobile) {
      state.mobile = mobile
    },
    setScrollOffset(state, offset) {
      state.scroll.offset = offset
    },
    //<</check-mobile@function>>
    //<<track-scroll-position@function>>
    setScrollPosition(state, position) {
      state.scroll.position = position
    },
    //<</track-scroll-position@function>>
  },
  actions: {

  }
})
