<template lang="pug">
#v-app
  | App
  router-view //[[router]]
</template>

<script>
import { parse } from 'query-string' //[[save-utm&!router]]

export default {
  name: 'App',
  created() { //[[]]
    document.cookie=`XSRF-TOKEN=${Math.random().toString(36).substr(2)}` //[[axios]]
    //<<check-mobile>>
    //<<jquery>>
    $(window).resize(() => {
      const mobile = $(window).width() < 1024
      if(this.$store.state.mobile !== mobile) {
        if(mobile) {
          this.$store.commit('setMobile', true)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto]]
        } else {
          this.$store.commit('setMobile', false)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto]]
        }
      }
    }).resize()
    //<</jquery>>
    //<<!jquery>>
    window.addEventListener("resize", () => {
      const mobile = window.innerWidth < 1024
      if(this.$store.state.mobile !== mobile) {
        if(mobile) {
          this.$store.commit('setMobile', true)
          this.$store.commit('setScrollOffset', 0)
        } else {
          this.$store.commit('setMobile', false)
          this.$store.commit('setScrollOffset', 0)
        }
      }
    });
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
    //<</!jquery>>
    //<</check-mobile>>
    this.$store.commit('saveUtm', parse(location.search)) //[[save-utm&!router]]
    this.$store.commit('saveUtm', this.$route.query) //[[save-utm&router]]
  }, //[[/]]
  mounted() { //[[]]
    //<<track-scroll-position>>
    $(window).scroll(() => {
      const scrollTop = $(window).scrollTop() + this.$store.state.scroll.offset
      const sections = this.$store.state.scroll.sections
      for (let i = sections.length - 1; i >= 0; i--) {
        if(scrollTop >= $(sections[i]).position().top) {
          if(this.$store.state.scroll.position !== sections[i]) {
            this.$store.commit('setScrollPosition', sections[i])
            history.replaceState(null, null, sections[i])
          }
          break
        }
      }
    }).scroll()
    //<</track-scroll-position>>
  }, //[[/]]
}
</script>

<style lang="sass" scoped>
@import "~@/mixin.sass"

#v-app
  overflow-x: hidden
</style>
