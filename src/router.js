import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, saved) {
    return new Promise(resolve => {
      const position = saved ? saved : { x: 0, y: 0 }
      setTimeout(() => resolve(position), 0)
    })
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
