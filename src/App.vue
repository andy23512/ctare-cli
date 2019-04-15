<template lang="pug">
#v-app
  | App
  router-view //[[router@internal]]
</template>

<script>
import { parse } from 'query-string' //[[save-utm@function&!router@internal]]

export default {
  name: 'App',
  created() { //[[]]
    document.cookie=`XSRF-TOKEN=${Math.random().toString(36).substr(2)}` //[[axios@module]]
    //<<check-mobile@function>>
    //<<jquery@module>>
    $(window).resize(() => {
      const mobile = $(window).width() < 1024
      if(this.$store.state.mobile !== mobile) {
        if(mobile) {
          this.$store.commit('setMobile', true)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        } else {
          this.$store.commit('setMobile', false)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        }
      }
    }).resize()
    //<</jquery@module>>
    //<<!jquery@module>>
    window.addEventListener("resize", () => {
      const mobile = window.innerWidth < 1024
      if(this.$store.state.mobile !== mobile) {
        if(mobile) {
          this.$store.commit('setMobile', true)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        } else {
          this.$store.commit('setMobile', false)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        }
      }
    });
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
    //<</!jquery@module>>
    //<</check-mobile@function>>
    this.$store.commit('saveUtm', parse(location.search)) //[[save-utm@function&!router@internal]]
    this.$store.commit('saveUtm', this.$route.query) //[[save-utm@function&router@internal]]
  }, //[[/]]
  mounted() { //[[]]
    //<<track-scroll-position@function>>
    //<<jquery@module>>
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
    //<</jquery@module>>
    //<<!jquery@module>>
    window.addEventListener("scroll", () => {
      const scrollTop = (window.pageYOffset | document.body.scrollTop) + this.$store.state.scroll.offset
      const sections = this.$store.state.scroll.sections
      for (let i = sections.length - 1; i >= 0; i--) {
        if(scrollTop >= document.querySelector(sections[i]).getBoundingClientRect().top) {
          if(this.$store.state.scroll.position !== sections[i]) {
            this.$store.commit('setScrollPosition', sections[i])
            history.replaceState(null, null, sections[i])
          }
          break
        }
      }
    })
    const event = document.createEvent('HTMLEvents');
    event.initEvent('scroll', true, false);
    window.dispatchEvent(event);
    //<</!jquery@module>>
    //<</track-scroll-position@function>>
  }, //[[/]]
}
</script>

<style lang="sass" scoped>
@import "~@/mixin.sass"
</style>
