<script setup>
  import { formatTime } from '@/utils/time'
  import { msgSimplify } from '@/constants/session'
  import { msgType } from '@/constants/chat'
  import { useChatStore, useSessionStore } from '@/stores'
  const chatStore = useChatStore()
  const sessionStore = useSessionStore()
  const props = defineProps({
    // 会话对象
    session: {
      type: Object,
      default: () => ({})
    },
    // 是否是最后一个 session-item 组件
    last: Boolean
  })

  // 跳转至聊天页
  const goToChatPage = async () => {
    try {
      // 请求最新的会话列表
      await sessionStore.getSessionListAction()
      // 解构
      const { sessionId, lastMessageVO, otherUser } = props.session

      // 生成一个临时聊天对象
      const tempOtherUser = {
        ...otherUser,
        // 追加 id 属性
        id: otherUser.userId
      }
      // 删除 userId 属性
      delete tempOtherUser.userId
      // 设置聊天对象信息
      chatStore.setFangDong(tempOtherUser)
      // 跳转并携带路由参数
      uni.navigateTo({
        url: `/pages/chat/chat?sessionId=${sessionId}&lastMessageId=${lastMessageVO.messageId}`
      })
    } catch (e) {
      console.log(e)
    }
  }
</script>

<template>
  <view
    class="session-item"
    v-if="props.session.sessionId"
    @click="goToChatPage"
  >
    <!-- 左 -->
    <uni-badge
      :text="props.session.notVisitedCount"
      size="normal"
      absolute="rightTop"
      class="left"
    >
      <bit-icon
        :name="props.session.otherUser.avatar"
        size="80"
        round
      />
    </uni-badge>
    <!-- 右 -->
    <view
      class="right"
      :style="{
        // 动态绑定样式，如果是最后一个 session-item 组件，去掉边框
        borderBottomColor: props.last ? 'transparent' : 'auto'
      }"
    >
      <view class="up">
        <text class="nickName">
          {{ props.session.otherUser.nickName }}
        </text>
        <text class="sendTime">
          {{ formatTime(props.session.lastSessionTime, 'MM/DD') }}
        </text>
      </view>
      <view
        class="down"
        :class="{ hasUnVisited: props.session.notVisitedCount > 0 }"
      >
        <!-- 文本消息 -->
        <text
          v-if="props.session.lastMessageVO.type === msgType.text"
        >
          {{ props.session.lastMessageVO.content }}
        </text>
        <!-- 非文本消息 -->
        <text v-else>
          [{{ msgSimplify[props.session.lastMessageVO.type] }}]
        </text>
        <text
          v-if="props.session.lastMessageVO.type === msgType.voice"
        >
          {{ props.session.lastMessageVO.content.duration }}''
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .session-item {
    display: flex;
    padding: 0 20rpx;
    .left {
      width: 80rpx;
      margin-right: 24rpx;
      padding: 30rpx 0;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #dedede;
      .up {
        display: flex;
        justify-content: space-between;
        .nickName {
          font-size: $font-size-md-28;
          font-weight: 600;
          color: $font-color-dark;
        }
        .sendTime {
          font-size: $font-size-sm-24;
          color: $font-color-shallow;
        }
      }
      .down {
        @include text-ellipsis;
        width: 546rpx;
        margin-top: 12rpx;
        font-size: $font-size-sm-26;
        color: $font-color-middle;
        &.hasUnVisited {
          color: $bg-color-red-dot;
        }
      }
    }
  }
</style>
