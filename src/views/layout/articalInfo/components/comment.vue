<template>
    <van-cell>
        <template slot="title">
            <div class="commentBox">
                <div class="comImg">
                    <img :src="data.aut_photo" alt="">
                </div>
                <div class="comMsg">
                    <div class="comAut">{{ data.aut_name }}</div>
                    <div class="comContent">{{ data.content }}</div>
                    <div class="comOther">
                        <span class="myspan">{{ data.pubdate | timeFormat }}</span>
                        <van-button v-if="!isReply" round size="small" type="default" @click="showReply">回复{{ data.reply_count }}</van-button>
                    </div>
                </div>
                <div class="comLvoe">
                    <van-icon name="like"></van-icon> {{ data.like_count }}
                </div>
            </div>
        </template>
    </van-cell>
</template>

<script>
import bus from '../../../../utils/bus.js'
export default {
  // 是否是回复面板使用的评论组件，是返回true，否则返回false
  props: ['data', 'isReply'],
  methods: {
    showReply () {
      this.$emit('showReply', true)
      // 将当前参数传入到 reply中
      bus.$emit('passdata', this.data)
    }
  }

}
</script>

<style lang="less">
.commentBox {
    display: flex;
    .comImg {
        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
    }
    .comMsg {
        flex: 1;
        margin-left: 10px;
        .comAut {
            color: #708ab6;
        }
        .comContent {
            margin-left: 10px;
        }
        .comOther {
            .myspan {
                margin-right: 20px;
            }
        }
    }
}
</style>
