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
          for(let section of this.$store.state.scroll.sections) {
            if(location.hash.substr(1) === section.anchor) {
              this.$scrollTo(`#v-${section.name}`, 0, {
                offset: -this.$store.state.scroll.offset
              })
              break
            }
          }
        }
      } else {
        history.replaceState(null, null, '#')
      }
    }, 500)

    $(window).scroll(() => {
      const scrollTop = $(window).scrollTop() + this.$store.state.scroll.offset
      let anchor
      for(let section of this.$store.state.scroll.sections) {
        const sectionTop = $(`#v-${section.name}`).position().top
        const sectionBottom = sectionTop + $(`#v-${section.name}`).outerHeight()
        if(scrollTop >= sectionTop && scrollTop < sectionBottom) {
          anchor = `#${section.anchor}`
          if(this.$store.state.scroll.position !== section.name) {
            this.$store.commit('setScrollPosition', section.name)
            history.replaceState(null, null, anchor)
            break
          }
        }
      }
      if(!anchor && this.$store.state.scroll.position !== '') {
        this.$store.commit('setScrollPosition', '')
        history.replaceState(null, null, '#')
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
  max-width: 1440px
  min-height: 100%
  min-width: 360px

@media (max-width: 1019px)
  #v-app
    max-width: 600px
</style>
