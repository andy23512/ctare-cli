<template lang="pug">
#v-app.app
  | App
  //[[router]]
  router-view
  //[[/router]]
</template>

<script>
//[[query-string]]
import query from 'query-string'
//[[/query-string]]

export default {
  name: 'App',
  created() {
    //[[check-mobile]]
    $(window).resize(() => this.$store.commit('checkMobile')).resize()
    //[[/check-mobile]]
    this.$store.commit('saveUtm', query.parse(location.search))
  },
}
</script>

<style lang="sass" scoped>
</style>
