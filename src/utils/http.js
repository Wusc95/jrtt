import axios from 'axios'
// 导入获取token的方法
import { getToken } from '../utils/token.js'
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL
})

// axios拦截器
axios.interceptors.request.use(function (config) {
  config.headers.token = getToken()
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default instance
