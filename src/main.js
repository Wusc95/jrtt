import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入字体样式
import './style/iconfont.css'
// 引入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 使用vant
Vue.use(Vant)

Vue.config.productionTip = false
window.console.log(process.env.VUE_APP_BASEURL)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
