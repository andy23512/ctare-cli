import {
  createRouter,
  createWebHistory
} from 'vue-router'

import VHome from '@/views/Home.vue'

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, saved) {
    return new Promise(resolve => {
      const position = saved ? saved : {
        x: 0,
        y: 0
      }
      setTimeout(() => resolve(position), 0)
    })
  },
  routes: [{
      path: '/',
      component: VHome,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ]
})
