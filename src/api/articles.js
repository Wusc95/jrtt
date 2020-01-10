// 操作所有新闻文章的接口封装
import instance from '../utils/http.js'
// 频道新闻推荐_V1.1
export const apiArticles = (channelid) => {
  return instance({
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelid,
      timestamp: Date.now(),
      with_top: 0
    }
  })
}

// 对文章不感兴趣
export const apiDisLike = (target) => {
  return instance({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target
    }
  })
}

// 举报文章
export const apireport = (target, type) => {
  return instance({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target: target,
      type: type,
      remark: ''
    }
  })
}

// 获取新闻文章详情
export const apiArticleInfo = (artId) => {
  return instance({
    url: `/app/v1_0/articles/${artId}`
  })
}
// 取消对文章的点赞
export const apiNoLike = (artid) => {
  return instance({
    url: `/app/v1_0/article/likings/${artid}`,
    method: 'DELETE'
  })
}
// 对文章进行点赞
export const apiLike = (artid) => {
  return instance({
    url: `/app/v1_0/article/likings`,
    method: 'POST',
    data: {
      target: artid
    }
  })
}

// 对文章不喜欢
export const apiUnInterest = (artid) => {
  return instance({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: artid
    }
  })
}

// 取消对文章不喜欢
export const apiInterest = (artid) => {
  return instance({
    url: `/app/v1_0/article/dislikes/${artid}`,
    method: 'DELETE'
  })
}

// 获取评论数据
export const apiGetComments = (artid, offset) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'GET',
    params: {
      type: 'a',
      source: artid,
      offset: offset,
      limit: 10
    }
  })
}

// 获取评论的回复数据
export const apiGetReplyComments = (commId, offset) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'c',
      source: commId,
      offset: offset,
      limit: 10
    }
  })
}
// 评论回复
export const apiReplyComments = (commId, content, artid) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'post',
    data: {
      target: commId,
      content: content,
      art_id: artid
    }
  })
}
// 添加评论
export const apiComments = (atrid, content) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'post',
    data: {
      target: atrid,
      content: content
    }
  })
}
