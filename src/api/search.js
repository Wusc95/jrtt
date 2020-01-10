import instance from '../utils/http.js'

// 获取搜索结果
export const apiSearch = (page, q) => {
  return instance({
    url: `/app/v1_0/search?page=${page}&per_page=10&q=${q}`
  })
}

// 获取联想数据，自动补全
export const apiSuggestion = (q) => {
  return instance({
    url: `/app/v1_0/suggestion?q=${q}`
  })
}
