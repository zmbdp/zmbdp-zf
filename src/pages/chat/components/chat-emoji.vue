<script setup>
  import { emojiList } from '@/constants/chat'

  const props = defineProps({
    // 控制是否选择了表情包
    hasContent: Boolean
  })
  const emit = defineEmits(['select', 'del'])
  // 选择表情
  const selectEmoji = (emoji) => {
    // 子传父，触发父组件 select 自定义事件，把选择的 emoji 对象传给父组件
    emit('select', emoji)
  }
  // 删除表情
  const delEmoji = () => {
    // 如果没有内容，提前结束
    if (!props.hasContent) return
    // 触发 del 自定义事件
    emit('del')
  }
</script>
<template>
  <scroll-view scroll-y class="emoji">
    <view class="title">全部表情</view>
    <view class="list">
      <view
        class="item"
        v-for="emoji in emojiList"
        :key="emoji.id"
        @click="selectEmoji(emoji)"
      >
        {{ emoji.remark }}
      </view>
    </view>
    <view class="del">
      <bit-icon
        :name="`shanchu-${props.hasContent ? 'active' : 'default'}`"
        width="96"
        height="89"
        @click="delEmoji"
      />
    </view>
  </scroll-view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  .emoji {
    height: 490rpx;
    .title {
      padding-top: 30rpx;
      font-size: $font-size-sm-26;
      color: $font-color-dark;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      padding: 15rpx 0;
      .item {
        width: 14.28%;
        font-size: 60rpx;
        &:nth-child(n + 8) {
          margin-bottom: 10rpx;
        }
      }
    }
    .del {
      position: fixed;
      right: 60rpx;
      bottom: 60rpx;
    }
  }
</style>
