<template>
  <div class="xiaozhi">
    我是小智
    <!-- 头部导航 -->
    <van-nav-bar @click-left="$router.back()" left-arrow fixed class="login-nav-bar">
      <template slot="title">
        <div class="mylogin">小智同学</div>
      </template>
    </van-nav-bar>
    <!-- 聊天区域 -->
    <div class="chatbox" ref="chatbox">
      <!-- 它的高度应该是 100% - 上面的头部 - 下面的底部 -->
      <div
        v-for="(item, index) in chatList"
        :key="index"
        class="chat"
        :class="{person: item.isUser === true}"
      >
        <div class="img">
          <img
            src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4090061760,3566002114&fm=26&gp=0.jpg"
          />
        </div>
        <div class="chatmsg">{{ item.msg }}</div>
      </div>
    </div>
    <!-- 消息发送区域 -->
    <van-search background="#ccc" class="sendMsg" v-model="value" show-action @search="onSearch">
      <template slot="left-icon">
        <van-icon name="edit"></van-icon>
      </template>
      <template slot="action">
        <div @click="onSearch">发送</div>
      </template>
    </van-search>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  name: 'xiaozhi',
  data () {
    return {
      chatList: [
        { isUser: false, msg: '你好啊' }
      ],
      // 发送的信息
      value: '',
      // socket
      socket: null
    }
  },
  methods: {
    onSearch () {
      if (this.value.trim() === '') {
        this.$toast.fail('请输入内容')
        return
      }
      this.chatList.push({ isUser: true, msg: this.value })
      this.$nextTick(() => {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
      })
      this.socket.emit('message', {
        msg: this.value,
        timestamp: Date.now()
      })
      this.value = ''
    }
  },
  created () {
    this.socket = io('http://ttapi.research.itcast.cn')
    this.socket.on('message', obj => {
      this.chatList.push({
        isUser: false,
        msg: obj.msg
      })
      this.$nextTick(() => {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
      })
    })
  }
}
</script>

<style lang='less' scoped>
.xiaozhi {
  .login-nav-bar {
    background-color: #3e9df8;
    .mylogin {
      color: #fff;
    }
  }
  .van-nav-bar .van-icon {
    color: #fff;
  }
  .sendMsg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .chatbox {
    position: fixed;
    left: 0px;
    top: 46px;
    bottom: 54px;
    width: 100%;
    overflow: auto;
  }
  .chatbox {
    padding: 20px 0px 0 0px;
    .chat {
      display: flex;
      align-items: center;
      margin: 0px 10px 20px;
      .img {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .chatmsg {
        border: 1px solid #ddd;
        background-color: #e0effb;
        text-align: center;
        padding: 10px;
        border-radius: 5px;
      }
    }
    .person {
      flex-direction: row-reverse;
    }
  }
}
</style>
