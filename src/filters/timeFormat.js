// 导入vue
import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

Vue.filter('timeFormat', (time) => {
  return dayjs().from(dayjs(time))
//   return dayjs().fromNow(time)
})

// Vue.filter('timeFormat', function (time) {
//   return dayjs().from(dayjs(time))
// })
