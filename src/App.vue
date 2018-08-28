<template lang="pug">
#v-app.app App
</template>

<script>
import query from 'query-string' //[[query-string]]

export default {
  name: 'App',
  created() { //[[query-string]]
    $(window).resize(() => this.$store.commit('checkMobile')).resize() //[[query-string]]
    this.$store.commit('saveUtm', query.parse(location.search)) //[[query-string]]
  }, //[[query-string]]
}
</script>

<style lang="sass" scoped>
</style>
