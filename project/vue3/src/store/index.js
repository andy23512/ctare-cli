import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    mobile: null, //[[check-mobile@function]]
    //<<save-utm@function>>
    utm: {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    },
    //<</save-utm@function>>
    //<<vue-scrollto@module|track-scroll-position@function>>
    scroll: {
      offset: 0, //[[vue-scrollto@module]]
      //<<track-scroll-position@function>>
      sections: [
        // { name: '', anchor: '' }
      ],
      position: '',
      //<</track-scroll-position@function>>
    },
    //<</vue-scrollto@module|track-scroll-position@function>>
  },
  mutations: {
    //<<save-utm@function>>
    saveUtm(state, query) {
      state.utm.utm_source = query.utm_source ? query.utm_source : null
      state.utm.utm_medium = query.utm_medium ? query.utm_medium : null
      state.utm.utm_campaign = query.utm_campaign ? query.utm_campaign : null
      state.utm.utm_term = query.utm_term ? query.utm_term : null
      state.utm.utm_content = query.utm_content ? query.utm_content : null
    },
    //<</save-utm@function>>
    //<<check-mobile@function>>
    setMobile(state, mobile) {
      state.mobile = mobile
    },
    //<</check-mobile@function>>
    //<<vue-scrollto@module>>
    setScrollOffset(state, offset) {
      state.scroll.offset = offset
    },
    //<</vue-scrollto@module>>
    //<<track-scroll-position@function>>
    setScrollPosition(state, position) {
      state.scroll.position = position
    },
    //<</track-scroll-position@function>>
  },
  actions: {

  },
})