<template>
  <div class="mypage">
    <!--用户信息-->
    <div class="userInfo" v-if="isLogin === true">
      <div class="msg">
        <div class="uimg" @click="$router.push('/userInfo')">
          <img :src="userInfo.photo" alt />
        </div>
        <div class="uname">{{ userInfo.name }}</div>
        <div class="utoday">
          <span>今日阅读</span>
          <span>56分钟</span>
        </div>
      </div>
      <div class="fansBox">
        <div class="dongtai">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="guanzhu">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="fensi">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 未登录时显示的信息 -->
    <div class="noLogin" v-if="isLogin === false">
      <div class="userimg" @click="goLogin">
        <van-icon name="phone-o" />
      </div>
      <div class="today">
        <span>今日阅读</span>
        <span>0分钟</span>
      </div>
    </div>
    <!--收藏区域-->
    <div class="shoucang">
      <van-grid :column-num="3">
        <van-grid-item icon="star-o" text="收藏" />
        <van-grid-item icon="clock-o" text="历史" />
        <van-grid-item icon="records" text="作品" />
      </van-grid>
    </div>
    <!--列表区域-->
    <div class="liebiao">
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link @click="$router.push('/xiaozhi')"/>
    </div>
  </div>
</template>

<script>
import { apiGetUser } from '../../../api/user.js'
export default {
  name: 'mypage',
  data () {
    return {
      // 是否登陆
      isLogin: false,
      // 个人信息
      userInfo: {}
    }
  },
  methods: {
    // 点击图片跳转到登录页
    goLogin () {
      this.$router.push('/myLogin')
    }
  },
  async created () {
    // 判断用户是否登陆
    let user = this.$store.state.user
    if (user.token) {
      try {
        // 存在  获取用户信息
        let res = await apiGetUser()
        this.isLogin = true
        this.userInfo = res.data.data
        // window.console.log(res)
      } catch {
        this.$toast.fail('出错啦')
      }
    }
  }
}
</script>

<style lang="less">
.mypage {
  background-color: #ccc;
  overflow: hidden;
  .userInfo {
    background-color: #3e9df8;
    padding: 30px 30px;
    .msg {
      display: flex;
      position: relative;
      .uimg {
        margin-right: 20px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .uname {
        flex: 1;
        color: #fff;
        font-size: 20px;
      }
      .utoday {
        position: absolute;
        right: -30px;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 30px 0 0 30px;
        color: #fff;
        font-size: 14px;
        padding: 10px;
        line-height: 15px;
        display: flex;
        flex-direction: column;
      }
    }
    .fansBox {
      display: flex;
      justify-content: space-around;
      text-align: center;
      color: #fff;
      margin-top: 20px;
      .dongtai,
      .fensi,
      .guanzhu {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .noLogin {
    height: 186px;
    background-color: #3e9df8;
    overflow: hidden;
    position: relative;
    .userimg {
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 66px;
      color: skyblue;
      background-color: #fff;
      font-size: 35px;
      margin: 60px auto 0;
      border-radius: 50%;
    }
    .today {
      position: absolute;
      right: 0px;
      top: 80px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 30px 0 0 30px;
      color: #fff;
      font-size: 14px;
      padding: 10px;
      line-height: 15px;
      display: flex;
      flex-direction: column;
    }
  }
  .shoucang {
    margin-top: 5px;
  }
  .liebiao {
    margin-top: 5px;
  }
}
</style>
