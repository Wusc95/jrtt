// 定义token的KEY
// const KEY = 'jrtoken'

// 保存token
export const setToken = (KEY, token) => {
  localStorage.setItem(KEY, JSON.stringify(token))
}

// 获取token
export const getToken = (KEY) => {
  return JSON.parse(localStorage.getItem(KEY))
}

// 删除Token,退出的时候使用
export const removeToken = (KEY) => {
  localStorage.removeItem(KEY)
}
