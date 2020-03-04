<template lang="pug">
#v-app: .container
  | App
  router-view //[[router@internal]]
</template>

<script>
import { parse as parseQuery } from 'query-string' //[[save-utm@function&!router@internal]]
//[[save-utm@function&!router@internal]]
export default {
  name: 'App',
  created() { //[[]]
    document.cookie=`XSRF-TOKEN=${Math.random().toString(36).substr(2)}` //[[axios@module]]
    $(window).resize(() => { //[[]]
      //<<check-mobile@function>>
      const mobile = $(window).width() < 1020
      if(this.$store.state.mobile !== mobile) {
        if(mobile) {
          this.$store.commit('setMobile', true)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        } else {
          this.$store.commit('setMobile', false)
          this.$store.commit('setScrollOffset', 0) //[[vue-scrollto@module]]
        }
      }
      //<</check-mobile@function>>
      $(window).scroll() //[[track-scroll-position@function]]
    }).resize() //[[/]]
    this.$store.commit('saveUtm', parseQuery(location.search)) //[[save-utm@function&!router@internal]]
    this.$store.commit('saveUtm', this.$route.query) //[[save-utm@function&router@internal]]
  }, //[[/]]
  mounted() { //[[]]
    //<<track-scroll-position@function>>
    setTimeout(() => {
      if(location.hash) {
        if($(window).scrollTop() === 0) {
          this.$scrollTo(`#v-${location.hash.substr(1)}`, 0, {
            offset: -this.$store.state.scroll.offset
          })
        }
      } else {
        history.replaceState(null, null, '#')
      }
    }, 500)

    $(window).scroll(() => {
      const scrollTop = $(window).scrollTop() + this.$store.state.scroll.offset
      const sections = this.$store.state.scroll.sections
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionTop = $(`#v-${sections[i].name}`).position().top
        const sectionBottom = sectionTop + $(`#v-${sections[i].name}`).height()
        if(scrollTop >= sectionTop && scrollTop < sectionBottom) {
          if(this.$store.state.scroll.position !== sections[i].name) {
            this.$store.commit('setScrollPosition', sections[i].name)
            history.replaceState(null, null, `#${sections[i].anchor}`)
          }
          break
        }
        else {
          if(this.$store.state.scroll.position !== '') {
            this.$store.commit('setScrollPosition', '')
            history.replaceState(null, null, '#')
          }
        }
      }
    })
    //<</track-scroll-position@function>>
  }, //[[/]]
}
</script>

<style lang="sass" scoped>
@import "~@/mixin.sass"

#v-app
  background-color: white
  margin-left: auto
  margin-right: auto
  max-width: 1280px
  min-height: 100%
  min-width: 375px

@media (max-width: 1019px)
  #v-app
    max-width: 600px
</style>
