import instance from '../utils/http.js'

// 用户登录
export const apiLogin = (data) => {
  return instance({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data
  })
}

// 获取用户频道列表
export const apiUserChannels = () => {
  return instance({
    url: '/app/v1_0/user/channels'
  })
}

// 拉黑用户
export const apiUserBlackList = (target) => {
  return instance({
    url: '/app/v1_0/user/blacklists',
    method: 'post',
    data: {
      target: target
    }
  })
}

// 关注用户
export const apiIsFollowinfs = (target) => {
  return instance({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: {
      target: target
    }
  })
}

// 获取用户自己信息
export const apiGetUser = (userId) => {
  return instance({
    url: `/app/v1_0/user`
  })
}

// 获取用户个人资料
export const apiGetSelf = () => {
  return instance({
    url: '/app/v1_0/user/profile'
  })
}

// 编辑用户个人资料
export const apiEditUser = (obj) => {
  return instance({
    url: '/app/v1_0/user/profile',
    method: 'PATCH',
    data: {
      name: obj.name,
      photo: obj.photo,
      gender: obj.gender,
      birthday: obj.birthday,
      intro: obj.intro
    }
  })
}

// 编辑用户头像
export const apiEditPhoto = (photo) => {
  // photo：是一个图片对象
  // 将 photo 转为一个 formData
  // 1.0 创建一个 formData 对象
  let fd = new FormData()
  // 2.0 添加参数
  fd.append('photo', photo)
  return instance({
    url: '/app/v1_0/user/photo',
    method: 'PATCH',
    data: fd
  })
}
