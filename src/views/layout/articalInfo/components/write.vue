<template>
  <div class="write">
    <van-search v-model="value" placeholder="请输入评论" show-action>
      <template slot="left-icon">
        <van-icon name="edit" />
      </template>
      <template slot="action">
        <div @click="onSearch">发送</div>
      </template>
    </van-search>
  </div>
</template>

<script>
import { apiComments } from '../../../../api/articles.js'
export default {
  // isreply 判断是谁在使用write组件，然后做相应的逻辑处理 true:回复面板   false:文章详情页
  props: ['artid', 'isreply'],
  data () {
    return {
      // 输入的内容
      value: '',
      // 评论的信息
      commObj: {}
    }
  },
  methods: {
    // 提交评论
    async onSearch () {
      if (this.isreply) {
        // 把当前内容传递到回复面板组件
        this.$emit('replyComment', this.value)
        this.value = ''
      } else {
        try {
          let res = await apiComments(this.artid, this.value)
          this.commObj = res.data.data.new_obj
          // 把服务器返回的评论信息返回给父组件
          this.$emit('commObj', this.commObj)
          this.value = ''
        } catch {
          this.$toast.fail('出错啦')
        }
      }
    }
  }
}
</script>

<style lang="less">
.write {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .van-search {
    background-color: #ccc !important;
  }
}
</style>
