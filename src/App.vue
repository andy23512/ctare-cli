<template lang="pug">
#v-app
  | App
  router-view //[[router]]
</template>

<script>
import query from 'query-string' //[[query-string]]

export default {
  name: 'App',
  created() { //[[query-string]]
    $(window).resize(() => this.$store.commit('checkMobile')).resize() //[[check-mobile]]
    this.$store.commit('saveUtm', query.parse(location.search)) //[[query-string]]
  }, //[[query-string]]
}
</script>

<style lang="sass" scoped>
</style>
