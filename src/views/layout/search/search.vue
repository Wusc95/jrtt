<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @input="think"
      >
        <template slot="action">
          <span class="myCancel" @click="onCancel">取消</span>
        </template>
      </van-search>
    </form>
    <div class="thinkAear" v-if="thinkList.length !== 0">
      <van-cell
        v-for="(item, index) in thinkList"
        :key="index"
        @click="onSearch(item.oldItem)"
        icon="search"
      >
        <template slot="title">
          <div v-html="item.newItem"></div>
        </template>
      </van-cell>
    </div>
    <div class="history" v-else>
      <van-cell title="历史纪录">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <van-icon @click="delAll" slot="right-icon" name="delete" style="line-height: inherit;" />
      </van-cell>
      <van-cell
        v-for="(item, index) in historyList"
        :key="index"
        @click="onSearch(item)"
        :title="item"
        icon="search"
      >
        <template slot="right-icon">
          <van-icon name="cross" @click.stop="delData(item)" />
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { apiSuggestion } from '../../../api/search.js'
import { setToken, getToken } from '../../../utils/token.js'
export default {
  name: 'search',
  data () {
    return {
      // 搜索框内容
      value: '',
      // 是否显示联想数据
      isShowThink: true,
      // 联想数据列表
      thinkList: '',
      // 历史纪录
      historyList: [],
      // 定义一个变量，用来保存防抖函数的状态
      timer: null
    }
  },
  methods: {
    onSearch (key) {
      if (key.trim().length <= 0) {
        return
      }
      // 在跳转到搜索结果页之前，将搜索关键字保存在本地
      this.historyList.unshift(key)
      // 去重
      this.historyList = [...new Set(this.historyList)]
      // 保存到本地
      setToken('history', this.historyList)
      this.$router.push(`/searchResult/${key}`)
    },
    onCancel () {
      this.value = ''
      this.thinkList = ''
    },
    // 输入框改变时，获取联想数据
    think () {
      this.timer = setTimeout(async () => {
        clearTimeout(this.timer)
        // 如果搜索框内容为空，就清空联想数据，不继续往后执行
        if (this.value === '') {
          this.thinkList = ''
          return
        }

        let res = await apiSuggestion(this.value)
        this.thinkList = res.data.data.options
        this.thinkList = this.thinkList.map((item, index) => {
          return {
            oldItem: item,
            newItem: item
              .split(this.value)
              .join(`<span style="color:red">${this.value}</span>`)
          }
        })
        // window.console.log(this.thinkList)
      }, 500)
    },
    // 点击叉叉，删除当条历史纪录
    delData (obj) {
      this.historyList.forEach((item, index) => {
        if (item === obj) {
          this.historyList.splice(index, 1)
        }
      })
      setToken('history', this.historyList)
    },
    // 点击垃圾桶，删除所有历史纪录
    delAll () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确认删除所有历史纪录'
      })
        .then(() => {
          // on confirm
          this.historyList = []
          setToken('history', this.historyList)
          this.$toast.success('已清空')
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  created () {
    // 页面加载时从本地获取历史数据
    this.historyList = getToken('history') || []
  }
}
</script>

<style lang="less" scoped>
.search {
  .myCancel {
    color: #fff;
  }
  .van-search__action:active {
    background-color: #3296fa;
  }
  .myCancel:active {
    color: #ccc;
  }
  .van-icon {
    font-size: 18px;
  }
}
</style>
