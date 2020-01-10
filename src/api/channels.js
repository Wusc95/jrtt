// 所有与频道相关的网络请求
import instance from '../utils/http.js'

// 得到所有的频道数据
export const apiGetAllChannel = () => {
  return instance({
    url: '/app/v1_0/channels'
  })
}

// 批量修改用户频道列表（重置式）
export const apiModifyUserChannels = (channels) => {
  return instance({
    url: '/app/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels: channels
    }
  })
}
