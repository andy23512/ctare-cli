<template lang="pug">
#v-app
  | App
  router-view //[[router]]
</template>

<script>
import { parse } from 'query-string' //[[Save UTM,!router]]

export default {
  name: 'App',
  created() { //[[_app_created]]
    document.cookie=`XSRF-TOKEN=${Math.random().toString(36).substr(2)}` //[[axios]]
    $(window).resize(() => this.$store.commit('checkMobile')).resize() //[[Check Mobile,jquery]]
    window.addEventListener("resize", () => this.$store.commit('checkMobile')); //[[Check Mobile,!jquery]]
    const event = document.createEvent('HTMLEvents'); //[[Check Mobile,!jquery]]
    event.initEvent('resize', true, false); //[[Check Mobile,!jquery]]
    window.dispatchEvent(event); //[[Check Mobile,!jquery]]
    this.$store.commit('saveUtm', parse(location.search)) //[[Save UTM,!router]]
    this.$store.commit('saveUtm', this.$route.query) //[[Save UTM,router]]
  }, //[[_app_created]]
  mounted() { //[[Track Scroll Position]]
    $(window).scroll(() => { //[[Track Scroll Position]]
      const scrollTop = $(window).scrollTop() + this.$store.state.scroll.offset //[[Track Scroll Position]]
      const sections = this.$store.state.scroll.sections //[[Track Scroll Position]]
      for (let i = sections.length - 1; i >= 0; i--) { //[[Track Scroll Position]]
        if(scrollTop >= $(sections[i]).position().top) { //[[Track Scroll Position]]
          if(this.$store.state.scroll.position !== sections[i]) { //[[Track Scroll Position]]
            this.$store.commit('setScrollPosition', sections[i]) //[[Track Scroll Position]]
            history.replaceState(null, null, sections[i]) //[[Track Scroll Position]]
          } //[[Track Scroll Position]]
          break //[[Track Scroll Position]]
        } //[[Track Scroll Position]]
      } //[[Track Scroll Position]]
    }).scroll() //[[Track Scroll Position]]
  }, //[[Track Scroll Position]]
}
</script>

<style lang="sass" scoped>
@import "~@/mixin.sass"

#v-app
  overflow-x: hidden
</style>
