<script setup>
  import { useChatStore, useUserStore } from '@/stores'
  const chatStore = useChatStore()
  const userStore = useUserStore()
  import {
    msgType,
    maxVoiceDuration,
    voiceMsgStatus
  } from '@/constants/chat'
  import { computed, onMounted, onUnmounted } from 'vue'
  import { formatTime } from '@/utils/time'
  import { UniAppEvent } from '@/constants/common'

  const props = defineProps({
    // 单条消息
    msg: {
      type: Object,
      default: () => ({})
    },
    // 消息的下标
    index: Number
  })

  const emit = defineEmits(['play'])

  // 消息是否是本人发的
  const isSelf = computed(() => {
    // fromId: 消息的发出者
    // 如果消息的发出者与当前登录用户id一样，证明就是本人发的
    return props.msg.fromId === userStore.userInfo.userId
  })

  // 语音条的最大宽度
  const maxLabelWidth = 660
  // 语音条的最小宽度
  const minLabelWidth = 110

  // 计算语音条的宽度
  const labelWidth = computed(() => {
    // 计算当前语音条的宽度(原理就是数学中比例问题)
    const width =
      (maxLabelWidth * props.msg.content.duration) / maxVoiceDuration
    // 三元表达式判断
    return width < minLabelWidth ? minLabelWidth : width
  })

  let innerAudioContext = null

  // 播放语音
  const playVoice = () => {
    if (!innerAudioContext) {
      // 创建内部 audio 上下文对象
      innerAudioContext = uni.createInnerAudioContext()
      // 设置语音的路径
      innerAudioContext.src = props.msg.content.audioPath
      // 播放语音
      innerAudioContext.play()
    } else {
      // 先停止上一次的播放
      innerAudioContext.stop()
      // 然后再开始本次的播放(意味着每次都会重头开始播放)
      innerAudioContext.play()
    }
    // 通知其他语音消息停止播放，借助 uni-app 提供的事件机制
    // uni.$emit(事件名称, 参数)，当前把正在播放语音的下标传递过去了
    uni.$emit(UniAppEvent.PlayVoice, props.index)

    // 更新语音消息状态(已播放 or 未播放)
    if (props.msg.status === voiceMsgStatus.unPlay) {
      // 设置为已读(取消红点)
      props.msg.status = voiceMsgStatus.played
      // 子传父(收集语音消息 id)
      emit('play', props.msg.messageId)
    }
  }
  // 注意：onLoad，onShow，onHide 等生命周期钩子针对页面才有效，针对组件无效
  // 针对组件，可以借助 vue 本身生命周期钩子
  onMounted(() => {
    // 只有值语音消息，才需要定语播放事件
    if (props.msg.type === msgType.voice) {
      // 订阅/监听播放语音自定义事件，接受正在播放的语音的下标
      uni.$on(UniAppEvent.PlayVoice, (i) => {
        if (
          // 排除自己（不能让自己停止播放）
          props.index !== i &&
          // 有 innerAudioContext 对象
          innerAudioContext &&
          // 其他语音在播放
          innerAudioContext.paused
        ) {
          // 停止播放
          innerAudioContext.stop()
        }
      })
    }
  })

  // 组件卸载：因为聊天页是由很多个 chat-item 组件构成的，当退出聊天页了，
  // chat-item 组件也就自动被卸载了，就会自动触发 onUnload 卸载事件
  onUnmounted(() => {
    if (props.msg.type === msgType.voice) {
      // ?.: 可选链式运算符，自带 if 判断，也就是说前面的值为null或undefined，则不会访问后面的属性，
      // 提高了代码的健壮性
      innerAudioContext?.destroy()
      innerAudioContext = null
    }
  })
</script>

<template>
  <!-- 卡片消息 -->
  <template v-if="props.msg.type === msgType.card">
    <!-- 自己发的 -->
    <template v-if="isSelf">
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_card self">
        <bit-house-item :item="props.msg.content" class="card" />
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="userStore.userInfo.avatar"
        />
      </view>
    </template>
    <!-- 房东发的 -->
    <template v-else>
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_card fangdong">
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="chatStore.fangDong.avatar"
        />
        <bit-house-item :item="props.msg.content" class="card" />
      </view>
    </template>
  </template>
  <!-- 文本消息 -->
  <template v-else-if="props.msg.type === msgType.text">
    <!-- 自己发的 -->
    <template v-if="isSelf">
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_text self">
        <view class="text">
          {{ props.msg.content }}
        </view>
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="userStore.userInfo.avatar"
        />
      </view>
    </template>
    <!-- 房东发的 -->
    <template v-else>
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_text fangdong">
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="chatStore.fangDong.avatar"
        />
        <view class="text">{{ props.msg.content }}</view>
      </view>
    </template>
  </template>
  <!-- 语音消息 -->
  <template v-else-if="props.msg.type === msgType.voice">
    <!-- 自己发的 -->
    <template v-if="isSelf">
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_voice self">
        <view
          class="voice"
          :style="{ width: labelWidth + 'rpx' }"
          @click="playVoice"
        >
          <text class="duration">
            {{ props.msg.content?.duration }}''
          </text>
          <bit-icon name="voice" size="32" class="icon" />
        </view>
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="userStore.userInfo.avatar"
        />
      </view>
    </template>
    <!-- 房东/对方 发的 -->
    <template v-else>
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_voice fangdong">
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="chatStore.fangDong.avatar"
        />
        <view
          class="voice"
          :style="{ width: labelWidth + 'rpx' }"
          @click="playVoice"
        >
          <bit-icon name="voice" size="32" class="icon" />
          <text class="duration">
            {{ props.msg.content?.duration }}''
          </text>
          <view
            class="red_dot"
            v-if="props.msg.status === voiceMsgStatus.unPlay"
          ></view>
        </view>
      </view>
    </template>
  </template>
  <!-- 图片消息 -->
  <template v-else-if="props.msg.type === msgType.image">
    <!-- 自己发的 -->
    <template v-if="isSelf">
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_image self">
        <image
          :src="props.msg.content"
          mode="widthFix"
          class="image"
        />
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="userStore.userInfo.avatar"
        />
      </view>
    </template>
    <!-- 房东发的 -->
    <template v-else>
      <view class="time">{{ formatTime(props.msg.createTime) }}</view>
      <view class="msg msg_image fangdong">
        <bit-icon
          class="avatar"
          size="80"
          round
          :name="chatStore.fangDong.avatar"
        />
        <image
          :src="props.msg.content"
          mode="widthFix"
          class="image"
        />
      </view>
    </template>
  </template>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  // time
  .time {
    padding: 15rpx 0;
    font-size: $font-size-sm-26;
    color: $font-color-shallow;
    text-align: center;
  }
  .msg {
    display: flex;
    padding: 15rpx 0;
    &.self {
      justify-content: flex-end;
      .avatar {
        margin-left: 20rpx;
      }
    }
    &.fangdong {
      justify-content: flex-start;
      .avatar {
        margin-right: 20rpx;
      }
    }
    // 卡片消息
    &.msg_card {
      .card {
        width: 490rpx;
        height: 200rpx;
      }
    }
    // 文本消息
    &.msg_text {
      .text {
        box-sizing: border-box;
        width: fit-content;
        max-width: 490rpx;
        padding: 26rpx 25rpx 26rpx 20rpx;
        border-radius: 16rpx;
        font-size: $font-size-sm-26;
        color: $font-color-dark;
      }
      &.self {
        .text {
          background: $bg-color-chat-me;
        }
      }
      &.fangdong {
        .text {
          background: $bg-color-white;
        }
      }
    }
    // 语音消息
    &.msg_voice {
      .voice {
        display: flex;
        align-items: center;
        height: 88rpx;
        padding: 0 14rpx;
        border-radius: 16rpx;
        .duration {
          font-size: $font-size-sm-26;
          color: $font-color-dark;
        }
        .icon {
          position: relative;
        }
      }
      &.self {
        .voice {
          justify-content: flex-end;
          background: $bg-color-chat-me;
          .duration {
            margin-right: 14rpx;
          }
          .icon {
            top: 6rpx;
          }
        }
      }
      &.fangdong {
        .voice {
          position: relative;
          background: $bg-color-white;
          .icon {
            top: -3rpx;
            transform: rotate(180deg);
          }
          .duration {
            margin-left: 14rpx;
          }
          .red_dot {
            position: absolute;
            right: -26rpx;
            top: 50%;
            width: 16rpx;
            height: 16rpx;
            margin-top: -8rpx;
            border-radius: 50%;
            background: $bg-color-red-dot;
          }
        }
      }
    }
    &.msg_image {
      .image {
        max-width: 490rpx;
      }
    }
  }
</style>
