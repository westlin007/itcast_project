import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入自定义样式
import '@/styles/index.less'
import router from '@/router/router.js'

Vue.use(ElementUI)
// 添加导航守卫
router.beforeEach((to, from, next) => {
  console.log(to)
  let mytoken = localStorage.getItem('itcast_project_token')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
