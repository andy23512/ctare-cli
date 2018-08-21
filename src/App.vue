<template lang="pug">
#v-app.app App
</template>

<script>
import query from 'query-string'

export default {
  name: 'App',
  created() {
    $(window).resize(() => this.$store.commit('checkMobile')).resize()
    this.$store.commit('saveUtm', query.parse(location.search))
  },
}
</script>

<style lang="sass" scoped>
</style>
