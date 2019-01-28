<template lang="pug">
#v-app
  | App
  router-view //[[router]]
</template>

<script>
import query from 'query-string' //[[Save UTM,!router]]

export default {
  name: 'App',
  created() {
    $(window).resize(() => this.$store.commit('checkMobile')).resize() //[[Check Mobile,jquery]]
    window.addEventListener("resize", () => this.$store.commit('checkMobile')); //[[Check Mobile,!jquery]]
    const event = document.createEvent('HTMLEvents'); //[[Check Mobile,!jquery]]
    event.initEvent('resize', true, false); //[[Check Mobile,!jquery]]
    window.dispatchEvent(event); //[[Check Mobile,!jquery]]
    this.$store.commit('saveUtm', query.parse(location.search)) //[[Save UTM,!router]]
    this.$store.commit('saveUtm', this.$route.query) //[[Save UTM,router]]
  },
}
</script>

<style lang="sass" scoped>
</style>
