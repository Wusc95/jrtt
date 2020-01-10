import axios from 'axios'
// 导入获取token的方法
// import { getToken } from '../utils/token.js'
// 导入仓库
import store from '../store/index.js'
// 导入json-bigint用来处理数字超过number的最大值
import JSONBig from 'json-bigint'
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  // 得到服务器返回的原始数据
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch {
      return JSON.parse(data)
    }
  }]
})

const instance2 = axios.create({
  baseURL: process.env.VUE_APP_BASEURL
})

// axios拦截器
instance.interceptors.request.use(function (config) {
  // 取出用户信息
  let user = store.state.user
  // window.console.log(config)
  // 判断用户是否登录,如果有登陆就设置请求头
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  if (error.response.status === 401) {
    // 获取用户信息
    let user = store.state.user
    let refreshtoken = user.refresh_token
    // 重新向服务器发送请求，更新token
    let res = await instance2({
      url: '/app/v1_0/authorizations',
      method: 'put',
      headers: {
        Authorization: `Bearer ${refreshtoken}`
      }
    })
    // 获取新的token,并更新到store仓库
    let newToken = res.data.data.token
    user.token = newToken
    store.commit('setUser', user)
    // 更新完token之后，需要继续发送请求完成未完成的查询
    return instance(error.config)
  }
  return Promise.reject(error)
})

export default instance
