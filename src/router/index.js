import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import login from '../views/login/index.vue'
import home from '../views/home/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: login
  },
  {
    path: '/home',
    component: home
  }
]

const router = new VueRouter({
  routes
})

export default router
