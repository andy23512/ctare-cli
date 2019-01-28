<template lang="pug">
#v-app
  | App
  router-view //[[router]]
</template>

<script>
import query from 'query-string' //[[Save UTM]]

export default {
  name: 'App',
  created() {
    $(window).resize(() => this.$store.commit('checkMobile')).resize() //[[Check Mobile]]
    this.$store.commit('saveUtm', query.parse(location.search)) //[[Save UTM]]
  },
}
</script>

<style lang="sass" scoped>
</style>
