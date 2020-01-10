import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入字体样式
import './style/iconfont.css'
// 引入vant
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

// 导入过滤器
import './filters/timeFormat.js'

// // 导入dayjs
// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import 'dayjs/locale/zh-cn'
// dayjs.extend(relativeTime)
// dayjs.locale('zh-cn')

// dayjs().from(dayjs('1990'))
// window.console.log(dayjs().from(dayjs('1990')))

// options 为可选参数，无则不传

// 导入自己封装的登陆验证插件
import myPluginmy from './plugin/myPlugin.js'
Vue.use(myPluginmy)
Vue.use(Lazyload)
// 使用vant
Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false
window.console.log(process.env.VUE_APP_BASEURL)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
