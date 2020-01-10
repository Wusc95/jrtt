<template>
  <div class="home">
    <van-nav-bar fixed title="首页" />
    <van-tabs v-model="active">
      <van-tab v-for="(item, index) in channelList" :key="index" :title="item.name">
        <van-pull-refresh v-model="item.isloading" @refresh="onRefresh">
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell class="mycell" v-for="(subitem, index) in item.list" :key="index">
              <template slot="title">
                <span>{{subitem.title}}</span>
                <van-grid v-if="subitem.cover.type !== 0" :border="false" :column-num="3">
                    <van-grid-item v-for="(imgitem, imgindex) in subitem.cover.images" :key="imgindex">
                      <van-image :src="imgitem" v-lazy="imgitem" />
                    </van-grid-item>
                </van-grid>

                <div class="more">
                  <div class="other">
                    <span>{{subitem.aut_name}}</span>
                    <span>{{subitem.comm_count}}评论</span>
                    <span>{{subitem.pubdate | timeFormat}}</span>
                  </div>
                  <van-icon name="cross" @click="showMore(subitem.art_id,subitem.aut_id)"/>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <div class="myMenu" @click="openChannel">
      <van-icon name="wap-nav" />
    </div>

    <!--频道列表弹出层-->
    <!-- <van-popup v-model="show" position="bottom" :style="{ height: '90%' }" /> -->
    <!-- <mypop :value="show" :channelList="channelList" @input="show=$event" /> -->
    <!-- <mypop v-model="show" :channelList="channelList" :active="active" @update:active="active=$event" /> -->
    <mypop v-model="show" :channelList="channelList" :active.sync="active" />
    <!--更多面板组件-->
    <!-- <more :value="showmore" @input="showmore=$event"/> -->
    <more v-model="showmore" @delArticle="delArticle" :articleId="articleId" :autid="autid"/>
  </div>
</template>

<script>
// 导入频道列表窗口
import mypop from './components/mypop.vue'
// 导入更多面板组件
import more from './components/more.vue'
import { apiUserChannels } from '../../../api/user.js'
import { getToken } from '../../../utils/token.js'
import { apiArticles } from '../../../api/articles.js'
export default {
  name: 'home',
  data () {
    return {
      // tab的激活项
      active: 0,
      // 定义一个要显示的数据源
      // list: [],
      // // list属性：用来设置list组件是否处于加载状态
      // loading: false,
      // // list属性 ：用来设置list组件中的数据是否加载完毕
      // finished: false,
      // // pull-refresh的isLoading：用来设置pull-refresh组件的加载状态
      // isLoading: false,
      // 频道列表
      channelList: [],
      // 控制频道列表是否显示
      show: false,
      // 控制更多面板的显示和隐藏
      showmore: false,
      // articleId : 文章id
      articleId: 0,
      // autid :作者id
      autid: 0
    }
  },
  methods: {
    // list 的事件：当 list 组件被加载时会执行
    async onLoad () {
      // 得到当前频道
      let currentChannle = this.channelList[this.active]
      let id = currentChannle.id
      // 得到当前频道下的数据
      let res = await apiArticles(id)
      // 将文章列表数据保存到当前频道下面的 list 属性中
      currentChannle.list = [...currentChannle.list, ...res.data.data.results]
      // 判断返回数据的长度
      if (res.data.data.results.length === 0) {
        // 将 list 的加载完毕状态设置为 true
        currentChannle.finished = true
      }
      // 手动设置 loading 为 false
      currentChannle.loading = false
    },
    onRefresh () {
      // 得到当前频道数据
      let currentChannel = this.channelList[this.active]
      // 清除当前频道中的所有的数据
      currentChannel.loading = false
      currentChannel.finished = false
      currentChannel.list = []
      currentChannel.isloading = false
      // 重新加载数据
      this.onLoad()
    },
    // 添加额外的属性
    addOtherProp () {
      // 遍历数组
      this.channelList.forEach(item => {
        // 不会在页面上渲染
        // // list 组件的加载状态
        // item.loading = false
        // // list 组件的完毕状态
        // item.finished = false
        // // 下拉组件的下拉状态
        // item.isloading = false
        // // 每个频道显示的数据源
        // item.list = []
        // 应该通过 $set 添加属性
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'isloading', false)
        this.$set(item, 'list', [])
      })
    },
    // 打开频道列表弹出框
    openChannel () {
      this.show = true
    },
    // 控制更多面板的显示和隐藏
    showMore (articleId, autid) {
      this.showmore = true
      this.articleId = articleId
      this.autid = autid
    },
    // 删除不感兴趣的文章
    delArticle () {
      // 获取当前频道下文章列表数据
      let dataList = this.channelList[this.active].list
      dataList.forEach((item, index) => {
        if (item.art_id === this.articleId) {
          dataList.splice(index, 1)
        }
      })
    }
  },
  async created () {
    // 进入页面或频道数据
    // 得到用户信息
    let user = this.$store.state.user
    try {
      if (user.token) {
        // 用户已登录，直接去服务器中拿数据
        // 得到频道数据
        let res = await apiUserChannels()
        if (res.status === 200) {
          // 保存数据
          this.channelList = res.data.data.channels
        }
      } else {
        // 用户未登陆
        // 判断是否存在localStorage ,用户未登陆的时候也可以增加或删除频道，未登录时的频道操作保存在localStorage中
        // 从localStorage中得到频道数据
        let channels = getToken('channels')
        // 判断频道数据是否存在
        if (channels) {
          // 存在频道数据，赋值给channelList
          this.channelList = channels
        } else {
          // 直接从服务器中获取
          let res = await apiUserChannels()
          if (res.status === 200) {
            // 保存数据
            this.channelList = res.data.data.channels
          }
        }
      }
    } catch {
      this.$toast.fail('查询出错，请稍后重试')
    }
    // 给频道数据添加额外的属性
    this.addOtherProp()
  },
  components: {
    mypop,
    more
  }
}
</script>

<style lang='less'>
.home {
  margin-bottom: 50px;
  margin-top: 90px;
  .van-nav-bar {
    background-color: #3296fa;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-tabs__wrap {
    position: fixed;
    left: 0;
    top: 46px;
    z-index: 999;
    width: 90%;
  }
  .myMenu {
    position: fixed;
    top: 46px;
    right: 0;
    height: 44px;
    width: 10%;
    z-index: 999;
    text-align: center;
    line-height: 44px;
  }
  .mycell {
    // height: 150px;
    .more {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ccc;
      .other {
        span {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
