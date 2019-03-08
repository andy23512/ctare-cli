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
}
</script>

<style lang="sass" scoped>
#v-app
  overflow-x: hidden
</style>
