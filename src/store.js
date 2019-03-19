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
    scroll: { //[[_offset_state]]
      offset: 0, //[[_offset_state]]
      sections: [], //[[Track Scroll Position]]
      position: '', //[[Track Scroll Position]]
    } //[[_offset_state]]
  },
  mutations: {
    setMobile(state, mobile) { //[[Check Mobile]]
      state.mobile = mobile //[[Check Mobile]]
    }, //[[Check Mobile]]
    saveUtm(state, query) { //[[Save UTM]]
      state.utm.utm_source = query.utm_source ? query.utm_source : '' //[[Save UTM]]
      state.utm.utm_medium = query.utm_medium ? query.utm_medium : '' //[[Save UTM]]
      state.utm.utm_campaign = query.utm_campaign ? query.utm_campaign : '' //[[Save UTM]]
      state.utm.utm_term = query.utm_term ? query.utm_term : '' //[[Save UTM]]
      state.utm.utm_content = query.utm_content ? query.utm_content : '' //[[Save UTM]]
    }, //[[Save UTM]]
    setScrollOffset(state, offset) { //[[Check Mobile]]
      state.scroll.offset = offset //[[Check Mobile]]
    }, //[[Check Mobile]]
    setScrollPosition(state, position) { //[[Track Scroll Position]]
      state.scroll.position = position //[[Track Scroll Position]]
    }, //[[Track Scroll Position]]
  },
  actions: {

  }
})
