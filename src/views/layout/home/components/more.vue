<template>
  <div class="more">
    <van-dialog :value="value" :showConfirmButton="false">
      <div class="mainPanl" v-if="showReport == false">
        <van-cell>
          <van-icon name="cross" @click="changevalue" />
        </van-cell>
        <van-cell @click="noLike" title="不感兴趣"></van-cell>
        <van-cell title="反馈垃圾内容" @click="showReport = true"></van-cell>
        <van-cell title="拉黑作者" @click="blackUser"></van-cell>
      </div>
      <div class="reportPanl" v-if="showReport == true">
        <van-cell>
          <van-icon name="arrow-left" @click="showReport = false" />
        </van-cell>
        <van-cell
          v-for="(item, index) in reportData"
          :key="index"
          :title="item.name"
          @click="report(item.id)"
        ></van-cell>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { apiDisLike, apireport } from '../../../../api/articles.js'
import { apiUserBlackList } from '../../../../api/user.js'
export default {
  name: 'more',
  props: ['value', 'articleId', 'autid'],
  data () {
    return {
      // 控制举报面板是否显示
      showReport: false,
      // 举报数据
      reportData: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ]
    }
  },
  methods: {
    // 点击xx按钮，关闭更多面板
    changevalue () {
      this.$emit('input', false)
    },
    // 点击不感兴趣
    async noLike () {
      let user = this.$store.state.user
      if (user.token) {
        // 关闭弹窗
        this.$emit('input', false)
        // 将该文章从文章列表中移除,子组件不方便操作父组件当中的数据，所以让父组件来做删除操作
        this.$emit('delArticle')
        // 发送请求，标注文章不感兴趣
        let res = await apiDisLike(this.articleId)
        window.console.log(res)
      } else {
        this.$toast.fail('请登录后对文章进行操作')
      }
    },
    // 点击举报文章
    async report (type) {
      let user = this.$store.state.user
      if (user.token) {
        try {
          let res = await apireport(this.articleId, type)
          this.showReport = false
          this.$emit('input', false)
          window.console.log(res)
          this.$toast.fail('您的举报信息我们已经收到，将会在三个工作日内处理')
        } catch {
          this.$toast.fail('已经举报过该文章')
        }
      } else {
        this.$toast.fail('请登录后对文章进行操作')
      }
    },
    async blackUser () {
      let user = this.$store.state.user
      if (user.token) {
        // 关闭弹窗
        this.$emit('input', false)
        // 发送请求，拉黑作者
        let res = await apiUserBlackList(this.autid)
        this.$toast.success('拉黑成功')
        window.console.log(res)
      } else {
        this.$toast.fail('请登录后对文章进行操作')
      }
    }
  }
}
</script>

<style>
</style>
