<template>
  <div class="userInfo">
    <van-nav-bar
      title="个人信息"
      right-text="保存"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="showHeader=true">
        <template slot="default">
          <img class="userImg" :src="userInfo.photo" alt />
        </template>
      </van-cell>
      <van-cell title="昵称" is-link :value="userInfo.name" @click="show=true" />
      <van-cell title="介绍" is-link :value="user.intro" />
    </van-cell-group>
    <van-cell-group style="margin-top:8px">
      <van-cell title="性别" is-link :value="user.gender?'女':'男'" />
      <van-cell title="生日" is-link :value="userInfo.birthday" />
    </van-cell-group>

    <!-- 修改信息的弹出层 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '6%' }">
      <van-cell required icon="edit">
        <template slot="title">
          <input type="text" v-model="userInfo.name" style="border:none" />
        </template>
      </van-cell>
    </van-popup>
    <!-- 选择头像面板 -->
    <van-dialog v-model="showHeader" :showConfirmButton="false">
      <van-cell-group>
        <van-cell>
          <template slot="title">
            <div class="center" @click="selectImg">从相册中选择</div>
            <div style="display:none">
              <input type="file" ref="myfile" @change="imgchange" />
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template slot="title">
            <div class="center">拍照</div>
          </template>
        </van-cell>
        <van-cell>
          <template slot="title">
            <div class="center" @click="showHeader = false">取消</div>
          </template>
        </van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { apiGetSelf, apiGetUser, apiEditUser, apiEditPhoto } from '../../../api/user.js'
// 引入图片预览
import { ImagePreview } from 'vant'
export default {
  name: 'userInfo',
  data () {
    return {
      userInfo: {},
      user: {},
      // 修改信息的面板是否显示
      show: false,
      // 修改头像面板
      showHeader: false
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async onClickRight () {
      let res = await apiEditUser({
        name: this.userInfo.name,
        intro: this.user.intro,
        gender: this.user.gender,
        birthday: this.userInfo.birthday
      })
      window.console.log(res)
      this.$toast('保存')
    },
    // 打开图片选择器
    selectImg () {
      // 触发input的点击事件，打开图片选择器
      this.$refs.myfile.click()
    },
    // 图片改变的时候
    imgchange () {
      // createObjectURL 的兼容性太差，在其他浏览器可能会出错
      // // 得到file
      // let file = this.$refs.myfile
      // // 得到选中的图片
      // let myImgfile = file.files[0]
      // // 得到图片地址
      // let url = URL.createObjectURL(myImgfile)

      // 将图片转换成base64格式
      let myImgfile = this.$refs.myfile.files[0]
      let reader = new FileReader()
      if (myImgfile) {
        reader.readAsDataURL(myImgfile)
      }
      reader.addEventListener(
        'load',
        () => {
          ImagePreview({
            images: [reader.result],
            onClose: this.myclose
          })
        }
      )
    },
    // 定义预览框关闭时要执行的逻辑代码
    myclose () {
      // 询问用户是否设置图片为头像
      this.$dialog.confirm({
        message: '是否将图片设置为头像'
      }).then(async () => {
        // 得到图片对象
        let myfile = this.$refs.myfile.files[0]
        // 1.0 发送请求到服务器
        let res = await apiEditPhoto(myfile)
        window.console.log(res)
        // 2.0 得到返回的图片信息
        let newImg = res.data.data.photo
        // 3.0 将图片地址重新设置给头像
        this.userInfo.photo = newImg
        // 关闭面板
        this.showHeader = false
      }).catch(() => {
        // 关闭其它面板
        this.showHeader = false
      })
    }
  },
  async created () {
    let self = await apiGetSelf()
    this.userInfo = self.data.data
    let user = await apiGetUser()
    this.user = user.data.data
    // window.console.log(self)
    // window.console.log(user)
  }
}
</script>

<style lang="less" scoped>
.userInfo {
  background-color: #f5f7f9;
  margin-top: 46px;
  .van-nav-bar {
    background-color: #3e9df8;
    .van-icon-arrow-left,
    .van-nav-bar__title,
    .van-nav-bar__text {
      color: #fff;
    }
  }
  .userImg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .center {
    text-align: center;
  }
}
</style>
