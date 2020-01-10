// 导入数据仓库
import store from '../store/index.js'
// 定义一个登陆验证插件
var myPlugin = {}

myPlugin.install = function (Vue) {
  Vue.prototype.$login = function () {
    let user = store.state.user
    if (!user.token) {
      this.$router.push('/resultlogin')
      return false
    }
    return true
  }
}
export default myPlugin
