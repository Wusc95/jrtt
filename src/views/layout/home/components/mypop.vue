<template>
  <!--自己封装一个频道封装面板 -->
  <div class="mypop">
    <!-- <van-popup v-model="value" position="bottom" :style="{ height: '90%' }" /> -->
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 添加结构样式 -->
      <!-- 关闭按钮 -->
      <van-cell>
        <template slot="title">
          <van-icon @click="close" class="popicon" name="cross" />
        </template>
      </van-cell>

      <!-- 我的频道区域 -->
      <van-cell>
        <template slot="title">
          <div>我的频道</div>
        </template>
        <template slot="default">
          <van-button v-if="showicon === false" @click="showicon = true" round plain hairline size="mini" type="danger" >编辑</van-button>
          <van-button
            v-else
            @click="showicon = false"
            round
            plain
            hairline
            size="mini"
            type="danger"
          >完成</van-button>
        </template>
      </van-cell>
      <!--我的频道列表-->
      <van-grid gutter="10">
        <van-grid-item v-for="(item, index) in channelList" :key="index" class="itemFather" >
          <template slot="text">
            <span @click="changeActive(index)" class="word" :class="{actives : index==active}" >{{ item.name }}</span>
            <van-icon @click="removeChannel(item)" name="clear" class="myicon" v-if="showicon&&item.id !==0" />
          </template>
        </van-grid-item>
      </van-grid>

      <!-- 频道推荐区域 -->
      <van-cell>
        <template slot="title">
          <div>频道推荐</div>
        </template>
      </van-cell>
      <!--频道推荐列表-->
      <van-grid gutter="10">
        <van-grid-item
          @click="addChannel(item)"
          v-for="(item, index) in getOtherChannels"
          :key="index"
          class="itemFather"
        >
          <template slot="text">
            <span class="word">{{ item.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>
<script>
import {
  apiGetAllChannel,
  apiModifyUserChannels
} from '../../../../api/channels.js'
import { setToken } from '../../../../utils/token.js'
export default {
  name: 'mypoop',
  props: ['value', 'channelList', 'active'],
  data () {
    return {
      showicon: false,
      allChannels: []
    }
  },
  methods: {
    // 关闭频道面板
    close () {
      this.$emit('input', false)
    },
    // 从频道列表向我的频道里面添加频道
    async addChannel (item) {
      // 动态添加其它的额外属性
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'isloading', false)
      this.$set(item, 'list', [])
      // 向我的频道添加数据
      this.channelList.push(item)
      // 获取用户登录信息
      let user = this.$store.state.user
      if (user.token) {
        // 用户已登录，向服务器发送请求
        // 根据我的频道列表，生成channels[]
        let channels = []
        // 不操作推荐频道，所以把推荐频道排除在外
        this.channelList.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        await apiModifyUserChannels(channels)
      } else {
        // 用户未登陆，直接将频道信息保存到localStorage中
        setToken('channels', this.channelList)
      }
    },
    // 从我的频道里删除频道
    async removeChannel (obj) {
      this.channelList.forEach((item, index) => {
        if (item.id === obj.id) {
          this.channelList.splice(index, 1)
        }
      })
      // 获取用户登录信息
      let user = this.$store.state.user
      if (user.token) {
        // 用户已登录，向服务器发送请求
        // 根据我的频道列表，生成channels[]
        let channels = []
        // 不操作推荐频道，所以把推荐频道排除在外
        this.channelList.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        await apiModifyUserChannels(channels)
      } else {
        // 用户未登陆，直接将频道信息保存到localStorage中
        setToken('channels', this.channelList)
      }
    },
    // 显示高亮切换
    changeActive (index) {
      this.$emit('update:active', index)
    }
  },
  async created () {
    let res = await apiGetAllChannel()
    this.allChannels = res.data.data.channels
  },
  computed: {
    getOtherChannels () {
      let myId = this.channelList.map((item, index) => {
        return item.id
      })
      let other = this.allChannels.filter((item, index) => {
        return !myId.includes(item.id)
      })
      return other
    }
  }
}
</script>

<style lang="less">
.mypop {
  .popicon {
    font-size: 30px;
  }
  .itemFather {
    position: relative;
    .word {
      font-size: 12px;
      color: #646566;
    }
    .actives {
      color: red;
    }
    .myicon {
      position: absolute;
      top: 0;
      right: 0;
      color: #ccc;
    }
  }
}
</style>
