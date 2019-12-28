<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <van-cell-group>
      <van-field v-model="loginForm.mobile" placeholder="请输入手机号" :error-message="errorMsg.mobile">
        <template slot="left-icon">
          <i class="myicon iconfont icon-iphone"></i>
        </template>
      </van-field>

      <van-field v-model="loginForm.code" placeholder="请输入验证码" :error-message="errorMsg.code">
        <template slot="left-icon">
          <i class="myicon iconfont icon-locka"></i>
        </template>
        <van-button slot="button" size="small" type="primary">获取验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="loginBtn">
      <van-button :loading="loading" class="mylogin" type="info" size="large" @click="loginBtn">登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入用户登录接口
import { apiLogin } from '../../api/user'

export default {
  name: 'login',
  data () {
    return {
      // 登陆信息
      loginForm: {
        mobile: '15722222222',
        code: '246810'
      },
      // 错误信息
      errorMsg: {
        mobile: '',
        code: ''
      },
      // 加载状态
      loading: false
    }
  },
  methods: {
    // 登陆按钮
    loginBtn () {
      this.loading = true
      let rules = this.loginRules()
      if (!rules.includes(false)) {
        setTimeout(async () => {
          try {
            let res = await apiLogin(this.loginForm)
            this.$store.commit('setUser', res.data.data)
            this.$router.push('/home')
            this.$toast.success('登录成功')
          } catch {
            this.$toast.fail('登录失败')
          }
          this.loading = false
        }, 1000)
      } else {
        this.loading = false
        // 验证失败
        if (this.errorMsg.mobile.length !== 0) {
          this.$toast.fail(this.errorMsg.mobile)
        } else if (this.errorMsg.code.length !== 0) {
          this.$toast.fail(this.errorMsg.code)
        }
      }
    },
    // 登录验证规则
    loginRules () {
      // 定义一个数组，用来保存手机号和验证码返回的结果，如果两个都是true ,则验证通过，否则验证不通过
      let arr = []
      // 验证手机号
      if (this.loginForm.mobile.trim().length !== 11 || /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.loginForm.mobile.trim()) !== true) {
        this.errorMsg.mobile = '请输入正确手机号'
        arr.push(false)
      } else {
        this.errorMsg.mobile = ''
        arr.push(true)
      }
      // 验证验证码
      if (this.loginForm.code.trim().length !== 6) {
        this.errorMsg.code = '请输入正确验证码'
        arr.push(false)
      } else {
        this.errorMsg.code = ''
        arr.push(true)
      }
      return arr
    }
  }
}
</script>

<style lang='less'>
.login {
  .van-nav-bar {
    background-color: #3296fa;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .myicon {
    font-size: 18px;
  }
  .van-field__button {
    .van-button {
      border-radius: 15px;
      background-color: #ccc;
      border: none;
      color: #666666;
    }
  }
  .loginBtn {
    margin: 20px 10px;
  }
}
</style>
