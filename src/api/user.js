import instance from '../utils/http.js'

// 用户登录
export const apiLogin = (data) => {
  return instance({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data
  })
}
