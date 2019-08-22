import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
