<template>
  <div class="searchResult">
    <van-nav-bar title="搜索结果" left-arrow fixed @click-left="onClickLeft" />
    <!--内容区域-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item, index) in searchResult" :key="index" @click="toInfo(item.art_id)">
          <template slot="title">
            <div class="content">
              <h3>{{item.title}}</h3>
              <img v-if="item.cover.type !== 0" :src="item.cover.images[0]" />
            </div>
            <div class="other">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <span>{{item.pubdate | timeFormat }}</span>
            </div>
            <div class="actions">
              <van-grid :column-num="3">
                <van-grid-item icon="comment-o" text="评论" @click="commint" />
                <van-grid-item icon="like-o" text="点赞" @click="zan" />
                <van-grid-item icon="share" text="分享" @click="share" />
              </van-grid>
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { apiSearch } from '../../../api/search.js'
export default {
  name: 'searchResult',
  data () {
    return {
      // 搜索结果
      searchResult: '',
      // list加载状态
      loading: false,
      // list加载完成标志
      finished: false,
      // 下拉刷新状态
      isLoading: false,
      // 搜索页面传递过来的参数
      keyWord: '',
      // 页数
      page: 1
    }
  },
  methods: {
    // 头部导航，左按钮
    onClickLeft () {
      this.$router.back()
    },
    // list加载事件
    async onLoad () {
      this.page++
      // 请求服务器的数据
      let res = await apiSearch(this.page, this.keyWord)
      this.searchResult = [...this.searchResult, ...res.data.data.results]
      if (res.data.data.results.length <= 0) {
        this.finished = true
      }
      // 将请求状态设置为 false
      this.loading = false
    },
    // 下拉刷新事件
    onRefresh () {
      setTimeout(() => {
        this.searchResult = []
        this.loading = false
        this.finished = false
        this.isLoading = false
        this.onLoad()
        this.$toast.success('刷新成功')
      }, 500)
    },
    // 评论方法
    commint () {
      if (this.$login() === false) {
        return
      }
      window.console.log('评论')
    },
    // 点赞方法
    zan () {
      if (this.$login() === false) {
        return
      }
      window.console.log('点赞')
    },
    // 分享方法
    share () {
      if (this.$login() === false) {
        return
      }
      window.console.log('分享')
    },
    // 跳转到文章详情页
    toInfo (artid) {
      this.$router.push(`/articalinfo/${artid}`)
    }
  },
  async created () {
    // 获取参数
    this.keyWord = this.$route.params.key
    // let res = await apiSearch(this.page, this.keyWord)
    // window.console.log(res)
  }
}
</script>

<style lang="less" scoped>
.searchResult {
  margin-top: 46px;
  margin-bottom: 56px;
  .van-nav-bar {
    background-color: #3e9df8;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-icon-arrow-left {
      color: #fff;
    }
  }
  .content {
    height: 100px;
    display: flex;
    img {
      width: 100px;
    }
    h3 {
      flex: 1;
      color: #3a3a3a;
      font-weight: normal;
    }
  }
  .other {
    span {
      color: #99b5c4;
      margin-right: 15px;
    }
  }
  .actions {
    .van-grid-item__content {
      flex-direction: row;
      align-items: center;
      .van-icon {
        font-size: 18px;
        margin-top: 5px;
        margin-right: 5px;
      }
      .van-grid-item__text {
        font-size: 15px;
        line-height: 15px;
      }
    }
    height: 40px;
  }
}
</style>
