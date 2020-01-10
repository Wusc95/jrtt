import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import login from '../views/login/index.vue'
import layout from '../views/layout/layout.vue'
import home from '../views/layout/home/home.vue'
import mypage from '../views/layout/myPage/mypage.vue'
import search from '../views/layout/search/search.vue'
import searchResult from '../views/layout/searchResult//searchResult.vue'
import articalInfo from '../views/layout/articalInfo/articalInfo.vue'
import userInfo from '../views/layout/userInfo/userInfo.vue'
import xiaozhi from '../views/layout/zhi/zhi.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: login
},
{
  path: '/',
  redirect: '/login'
},
{
  path: '/resultlogin',
  component: login
},
{
  path: '/myLogin',
  component: login
},
{
  path: '/articalinfo/:key',
  component: articalInfo
},
{
  path: '/userinfo',
  component: userInfo
},
{
  path: '/xiaozhi',
  component: xiaozhi
},
{
  path: '/layout',
  component: layout,
  children: [{
    path: '/home',
    component: home
  },
  {
    path: '/mypage',
    component: mypage
  },
  {
    path: '/search',
    component: search
  },
  {
    path: '/searchResult/:key',
    component: searchResult
  }

  ]
}

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
