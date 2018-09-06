import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, saved) {
    return saved ? saved : { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '*',
      redirect: '/',
    },
  ]
})
