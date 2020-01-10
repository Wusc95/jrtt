<template>
  <div class="reply">
    <van-popup
      @input="$emit('showReply',false)"
      :value="showReply"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <!-- 要回复的评论 -->
      <comment :data="currentComm" :isReply="true" />
      <!-- 当前评论的回复 -->
      <van-cell title="当前评论的回复"></van-cell>
      <!-- 回复信息 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <comment :isReply="true" v-for="(item,index) in replyList" :key="index" :data="item" />
      </van-list>
      <write :isreply="true" @replyComment="replyComment" />
    </van-popup>
  </div>
</template>
<script>
// 导入bus
import bus from '../../../../utils/bus.js'
// 导入writer组件
import write from '../components/write.vue'
// 导入评论列表组件
import comment from '../components/comment.vue'
// 导入接口
import {
  apiGetReplyComments,
  apiReplyComments
} from '../../../../api/articles.js'
export default {
  name: 'reply',
  props: ['showReply', 'artId'],
  data () {
    return {
      loading: false,
      finished: false,
      // 当前要回复的评论
      currentComm: {},
      // 当前评论回复的数据
      replyList: [],
      // 当前评论的id
      commId: 0,
      // 当前文章的id
      artid: 0,
      // 回复的数据开始的id
      last_id: null,
      // 回复数据结束的id
      end_id: null
    }
  },
  methods: {
    // list的加载事件
    async onLoad () {
      let res = await apiGetReplyComments(this.commId, this.end_id)
      this.replyList = res.data.data.results
      this.last_id = res.data.data.last_id
      this.end_id = res.data.data.end_id
      if (this.last_id === this.end_id) {
        this.finished = true
      }
      this.loading = false
    },
    // 评论回复事件
    async replyComment (content) {
      let res = await apiReplyComments(this.commId, content, this.artId)
      this.replyList.unshift(res.data.data.new_obj)
      this.currentComm.reply_count += 1
      // window.console.log(res)
    }
  },
  created () {
    bus.$on('passdata', value => {
      this.currentComm = value
      this.commId = this.currentComm.com_id.toString()
      // 每次进来都要初始化一次数据，要不然先点击有回复的评论，关闭面板，再点击没有回复的评论，发现之前的回复数据依旧存在
      this.loading = false
      this.finished = false
      this.end_id = null
      this.last_id = null
      this.replyList = []
      // window.console.log(this.currentComm)
    })
  },
  components: { write, comment }
}
</script>

<style lang="less">
.reply {
  .van-popup__close-icon {
    font-size: 30px;
  }
}
</style>
