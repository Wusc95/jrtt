<template>
  <div class="articalInfo">
    <!--头部导航-->
    <van-nav-bar title="文章详情" fixed left-arrow @click-left="onClickLeft" />
    <!--标题区-->
    <div class="artTitle">
      <h3>{{artInfo.title}}</h3>
    </div>
    <!--作者信息-->
    <van-cell class="artAut">
      <template slot="title">
        <img :src="artInfo.aut_photo" />
        <div class="other">
          <span>{{artInfo.aut_name}}</span>
          <span>{{artInfo.pubdate | timeFormat}}</span>
        </div>
        <van-button type="info" v-if="artInfo.is_followed" @click="isFollowe(artInfo.aut_id)">+ 关注</van-button>
        <van-button type="info" v-else @click="isFollowe(artInfo.aut_id)">已关注</van-button>
      </template>
    </van-cell>
    <!--文章内容-->
    <van-cell>
      <template slot="title">
        <div v-html="artInfo.content"></div>
      </template>
    </van-cell>
    <!-- 点赞 & 不喜欢 -->
    <div class="btns">
      <van-button
        @click="addZan"
        class="btn"
        plain
        round
        :type="artInfo.attitude === 1? 'danger' : 'default'"
      >
        <van-icon name="like" />&nbsp;&nbsp;&nbsp;&nbsp;点赞
      </van-button>
      <van-button
        @click="isLike"
        class="btn"
        plain
        round
        :type="artInfo.attitude === 0 ? 'danger' : 'default'"
      >
        <van-icon name="delete" />&nbsp;&nbsp;&nbsp;&nbsp;不喜欢
      </van-button>
    </div>
    <!--评论区-->
    <h4>评论列表</h4>
    <!-- 评论结构 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment :isReply="false" v-for="(item, index) in commentList" :key="index" :data="item" @showReply="showReply=$event"/>
    </van-list>
    <!--发表评论区-->
    <write :artid="artId" @commObj="commObj" :isreply="false"/>
    <!-- 回复面板 -->
    <reply :showReply="showReply" :artId="this.artId" @showReply="showReply=$event"/>
  </div>
</template>

<script>
import {
  apiArticleInfo,
  apiNoLike,
  apiLike,
  apiUnInterest,
  apiInterest,
  apiGetComments
} from '../../../api/articles.js'
import { apiIsFollowinfs } from '../../../api/user.js'
// 导入评论组件
import comment from './components/comment.vue'
// 导入发表评论的组件
import write from './components/write.vue'
// 导入回复的按钮的弹出组件
import reply from './components/reply.vue'
export default {
  name: 'articalInfo',
  data () {
    return {
      loading: false,
      finished: false,
      // 回复面板的显示与隐藏
      showReply: false,
      // 文章id
      artId: '',
      // 文章详情
      artInfo: {},
      // 评论列表
      commentList: [],
      // offset: 评论数据结束的标识
      offset: null,
      // start : 评论数据开始的id
      start: null
    }
  },
  methods: {
    // 导航栏左按钮
    onClickLeft () {
      this.$router.back()
    },
    // list事件
    async onLoad () {
      // 获取文章评论列表
      let res = await apiGetComments(this.artId, this.offset)
      // window.console.log(res)
      this.commentList = res.data.data.results
      this.offset = res.data.data.end_id
      this.start = res.data.data.last_id
      if (this.offset === this.start) {
        this.finished = true
      }
      this.loading = false
    },
    // 处理评论框提交的内容
    commObj (commObj) {
      // window.console.log(commObj)
      this.commentList.unshift(commObj)
    },
    // 点赞
    async addZan () {
      let attitude = this.artInfo.attitude
      window.console.log(attitude)
      // 判断：用户对文章的态度
      if (attitude === 1) {
        try {
          // 取消点赞
          await apiNoLike(this.artId)
        } catch {
          // 手动将态度设置为 -1
          this.artInfo.attitude = -1
        }
      } else {
        // 进行点赞
        await apiLike(this.artId)
        // 手动关态度设置为 1
        this.artInfo.attitude = 1
      }
    },
    // 喜欢或不喜欢
    async isLike () {
      let attitude = this.artInfo.attitude
      window.console.log(attitude)
      // 判断：用户对文章的态度
      if (attitude === 0) {
        try {
          // 取消对文章不喜欢
          await apiInterest(this.artId)
        } catch {
          // 手动将态度设置为 -1
          this.artInfo.attitude = -1
        }
      } else {
        //
        await apiUnInterest(this.artId)
        // 手动关态度设置为 0
        this.artInfo.attitude = 0
      }
    },
    // 是否关注
    async isFollowe (autId) {
      if (autId) {
        let res = await apiIsFollowinfs(autId)
        if (res.status === 201) {
          this.artInfo.is_followed = !this.artInfo.is_followed
        } else {
          this.$toast.fail('出错啦')
        }
      }
    },
    // 获取文章详情
    async getArticleInfo () {
      let res = await apiArticleInfo(this.artId)
      this.artInfo = res.data.data
    }
  },
  created () {
    // 获取页面传过来的id
    this.artId = this.$route.params.key
    this.getArticleInfo()
  },
  components: {
    comment,
    write,
    reply
  }
}
</script>

<style lang="less">
.articalInfo {
  margin-top: 46px;
  margin-bottom: 50px;
  .van-nav-bar {
    background-color: #3194ff !important;
    .van-nav-bar__title,
    .van-icon-arrow-left {
      color: #fff;
    }
  }
  .artTitle {
    h3 {
      text-align: center;
      font-size: 25px;
      font-weight: normal;
      margin-top: 30px;
    }
  }
  .artAut {
    .van-cell__title {
      display: flex;
      flex-direction: row;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .other {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 15px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  h4 {
    font-size: 18px;
    font-weight: normal;
  }
}
</style>
