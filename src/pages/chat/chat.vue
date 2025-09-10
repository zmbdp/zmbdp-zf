<script setup>
  import { computed, ref } from 'vue'
  import ChatItem from './components/chat-item.vue'
  import { chatMode, maxVoiceDuration } from '@/constants/chat'
  import { safeBottomDistance, getOsName } from '@/utils/system'
  import ChatEmoji from './components/chat-emoji.vue'
  import ChatExtension from './components/chat-extension.vue'
  import {
    pattern,
    authName,
    UniAppEvent,
    os
  } from '@/constants/common'
  import { isAuthorized, authorize } from '@/utils/auth'
  import { onLoad, onUnload } from '@dcloudio/uni-app'
  import { useChatStore, useUserStore } from '@/stores'
  import {
    getSessionInfoApi,
    createSessionApi,
    getHistoryListApi,
    getSessionHasHouseApi
  } from '@/api/chat'
  import {
    msgType,
    msgStatus,
    websocketMsgType,
    voiceMsgStatus
  } from '@/constants/chat'
  import socket from '@/utils/websocket'
  import { uploadFile2OSS } from '@/utils/file'

  import {
    putSessionBatchVisitedApi,
    putMessageBatchReadApi
  } from '@/api/session'

  const chatStore = useChatStore()
  const userStore = useUserStore()

  // 记录当前 sessionId(因为无论是发消息还是接收消息都需要依赖 sessionId)
  let sessionId = null
  // 基于哪条消息往前查询(后端返回的聊天列表中消息id的特点是依次增大的)
  let messageId = null

  // 记录当前的聊天模式（默认情况下是文本聊天模式），故初始值是 chatMode.text
  const mode = ref(chatMode.text)
  // 记录输入框是否聚焦
  const isFocus = ref(false)
  // 底部的安全距离
  const bottomDis = safeBottomDistance()
  // 底部操作区 bottom 定位值
  const actionBottomDis = ref(bottomDis)
  // 让scroll-view滚动到底部的元素id值
  const scrollViewId = ref(null)
  // 聊天区底部元素id
  const chatBottomId = 'chatBottom'
  // 控制 panel 盒子的显示或隐藏
  const visible = ref(false)

  // scroll-view(聊天列表)滚动到底部
  const scrollToBottom = () => {
    scrollViewId.value = null
    setTimeout(() => {
      // 硬编码
      scrollViewId.value = chatBottomId
    }, 400)
  }
  // 监听键盘的高度变化事件
  uni.onKeyboardHeightChange((res) => {
    // 当键盘出现或键盘消失都会触发当前change事件，
    // 可以通过 res.height 获取键盘的高度
    actionBottomDis.value = res.height || bottomDis

    // 键盘弹起了
    if (res.height > 0) {
      // 滚动到底部
      scrollToBottom()
    }
  })

  // 聊天区域 bottom 定位值
  const chatBottomDis = computed(() => {
    return actionBottomDis.value + uni.upx2px(120)
  })
  // 点击左侧图标切换聊天模式
  const changeMode = () => {
    // 当前聊天模式不是语音，则赋值语音模式；否则赋值文本模式
    mode.value =
      mode.value !== chatMode.voice ? chatMode.voice : chatMode.text
    // 当前是文本聊天模式，则输入框需要聚焦；否则不聚焦
    isFocus.value = mode.value === chatMode.text

    // 底部 panel 盒子是显示的
    if (visible.value) {
      // 将其隐藏
      visible.value = false
      // 底部操作区的 bottom 定位值设置为默认值(bottomDis的值)
      actionBottomDis.value = bottomDis
    }
  }
  // 收集输入框的值
  const msgText = ref('')

  // 右侧图标点击切换聊天模式
  const rightIconClick = (modeValue) => {
    // 文本聊天模式
    if (modeValue === chatMode.text) {
      // 输入框聚焦，会自动打开键盘
      isFocus.value = true
      // 键盘弹起了，底部灰色大盒子需要隐藏
      visible.value = false
    } else {
      // 如果点击的是同一个图标，则 isFocus 需要取反再赋值；否则赋值 false
      isFocus.value =
        mode.value === modeValue ? !isFocus.value : false
      // 键盘弹起了
      if (isFocus.value) {
        // panel 盒子要隐藏
        visible.value = false
      } else {
        // 显示 panel 盒子
        visible.value = true
        // 设置底部操作区 bottom 定位值：iPhone手机底部安全距离 + 底部 panel 盒子的高度
        actionBottomDis.value = bottomDis + uni.upx2px(490)
        // 滚动到聊天底部
        scrollToBottom()
      }
    }
    // 更新聊天模式
    mode.value = modeValue
  }

  // 页面被点击时
  const pageClick = () => {
    // 键盘弹起了
    if (isFocus.value) {
      // 收起键盘
      isFocus.value = false
    } else if (visible.value) {
      // 底部 panel 灰色盒子是显示的
      // 将其隐藏
      visible.value = false
      // 底部操作区回到默认位置
      actionBottomDis.value = bottomDis
      // 如果当前是表情包聊天模式
      if (mode.value === chatMode.emoji) {
        // 重置为文本聊天模式
        mode.value = chatMode.text
      }
    }
  }

  // 选择表情
  const selectEmoji = (emoji) => {
    msgText.value += emoji.remark
  }

  // 删除表情
  const delEmoji = () => {
    // 获取 msgText 的最后一个字符
    const last = msgText.value.slice(-1)
    // 判断最后一个字符是表情还是非表情
    const r1 = last.match(pattern.num)
    const r2 = last.match(pattern.lett)
    const r3 = last.match(pattern.chin)
    const r4 = last.match(pattern.spec)
    if (r1 !== null || r2 !== null || r3 !== null || r4 !== null) {
      // 针对的非表情（数字、大小写字母、汉字、特殊字符）
      // 如果是非表情：执行 slice(0, -1)
      msgText.value = msgText.value.slice(0, -1)
    } else {
      // 针对表情
      // 否则：执行 slice(0, -2)
      msgText.value = msgText.value.slice(0, -2)
    }
  }

  // 图片选择或拍摄成功，发送图片消息
  const selectOrTakeImage = (url) => {
    // url: 图片的真实路径
    sendMsg(msgType.image, url)
  }

  // 记录是否在录音中
  const isRecording = ref(false)
  // 记录是否取消了录音的发送
  const isCancelRecord = ref(false)
  // 记录手指按下时距离页面顶部的距离
  let startY = null
  // 手指上滑距离的临界值
  const distance = 80
  // 触摸开始(手指按下)
  const touchStart = async (e) => {
    try {
      // 判断是否授权了音频录制权限
      const flag = await isAuthorized(authName.record)
      if (!flag) {
        // 没有授权授权，引导用户授权
        await authorize(authName.record)
      } else {
        // 距离手指按下时距离页面顶部的距离
        startY = e.touches[0].pageY
        isCancelRecord.value = false
        // 开始录制
        isRecording.value = true
        chatStore.recorder.start({
          duration: maxVoiceDuration * 1000,
          format: 'mp3'
        })
      }
    } catch (e) {}
  }
  // 触摸移动(手指按下了，还没有抬起，但是盒子上移动)
  const touchMove = (e) => {
    // 判断有没有取消发送：判断手指按下距离屏幕顶部的距离与手指在移动过程中
    // 距离屏幕顶部的距离差，如果超过了预先设定的临界值，就认为取消了；否则没有取消
    isCancelRecord.value = startY - e.touches[0].pageY >= distance
  }
  // 触摸结束(手指抬起)
  const touchEnd = () => {
    chatStore.recorder.stop()
    isRecording.value = false
  }
  // 触摸中断(比如来电提醒或弹窗等)
  const touchCancel = () => {
    isRecording.value = false
    isCancelRecord.value = true
  }

  // 页面加载的时候
  onLoad(() => {
    // 注册发送语音的函数
    chatStore.registerSendVoiceEvent(
      async ({ tempFilePath, duration }) => {
        try {
          // tempFilePath: 临时语音文件的路径
          // duration: 录制的语音时长，单位是秒
          if (!isCancelRecord.value) {
            // 把临时语音文件上传至OSS云服务器，得到完整的音频路径
            const audioPath = await uploadFile2OSS(tempFilePath)
            // 调用统一的消息发送函数，传入相应的参数
            sendMsg(msgType.voice, {
              audioPath,
              duration
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
    )
    // 监听录音自动结束事件
    uni.$on(UniAppEvent.RecordAutoEnd, () => {
      // 录音自动结束之后，也需要将 isRecording 设置为 false
      isRecording.value = false
    })
  })

  // 存储聊天消息列表
  const chatList = ref([])
  let isFinished = false

  // 获取历史聊天列表
  async function getHistoryList({
    sessionId,
    lastMessageId,
    count = 10,
    needCurMessage
  }) {
    try {
      // 终止条件判断
      if (isFinished) return

      // 调接口
      const list = await getHistoryListApi({
        sessionId,
        lastMessageId,
        count,
        needCurMessage
      })
      // 后端返回的列表的长度小于 count，说明没有历史聊天数据了
      if (list.length < count) {
        isFinished = true
      }
      if (list.length > 0) {
        messageId = list[0].messageId
      }
      // 数据处理

      // 遍历 list 数组，拿到每个对象，列表合并
      chatList.value = [
        ...list.map((item) => {
          // 判断消息类型，如果是语音消息或房源卡片消息，需要将 content 的值转换成对象
          return [msgType.voice, msgType.card].includes(item.type)
            ? {
                ...item,
                // JSON.parse(): 反序列化，把json格式字符串转成json
                // JSON.stringify(): 序列化，把json转成json格式字符串
                content: JSON.parse(item.content)
              }
            : item
        }),
        ...chatList.value
      ]
    } catch (e) {
      console.log(e)
    }
  }

  // 触顶事件
  const reachTop = () => {
    getHistoryList({
      sessionId,
      lastMessageId: messageId,
      count: 2,
      needCurMessage: false
    })
  }
  // 页面加载的时候自动执行
  onLoad(async (query) => {
    try {
      if (query.sessionId) {
        sessionId = +query.sessionId
        await getHistoryList({
          sessionId,
          lastMessageId: query.lastMessageId,
          count: 10,
          needCurMessage: true
        })
      } else {
        // 获取会话信息
        const sessionInfo = await getSessionInfoApi({
          userId1: chatStore.fangDong.id,
          userId2: userStore.userInfo.userId
        })
        // 存在会话信息
        if (sessionInfo.sessionId) {
          // 记录当前会话 id
          sessionId = sessionInfo.sessionId
          // 存储 otherUser(房东信息)到 pinia中
          chatStore.setFangDong(sessionInfo.otherUser)

          // 是否存在聊天内容
          // 存在最后一条消息(说明发过消息)
          if (sessionInfo.lastMessageVO) {
            // 获取聊天历史记录
            await getHistoryList({
              sessionId,
              lastMessageId: sessionInfo.lastMessageVO.messageId,
              count: 10,
              needCurMessage: true
            })
            // 判断当前房子是否聊过
            const flag = await getSessionHasHouseApi({
              sessionId,
              houseId: chatStore.house.houseId
            })
            // 没有聊过
            if (!flag) {
              // 没有聊天内容，需要发送房源卡片消息
              await sendMsg(msgType.card, chatStore.house)
            }
          } else {
            // 不存在聊天内容，但需要发送房源卡片消息
            await sendMsg(msgType.card, chatStore.house)
          }
        } else {
          // 创建会话
          const newSessionInfo = await createSessionApi({
            userId1: chatStore.fangDong.id,
            userId2: userStore.userInfo.userId
          })
          sessionId = newSessionInfo.sessionId
          chatStore.setFangDong(newSessionInfo.otherUser)
          // 第一次聊天，需要发送房源卡片消息
          await sendMsg(msgType.card, chatStore.house)
        }
      }
      // 滚动到聊天底部
      scrollToBottom()
    } catch (e) {}
  })

  // 接收消息
  const receiveMsg = (message) => {
    // 属于同一个会话的消息，才需要加入到聊天列表中
    if (sessionId === message.sessionId) {
      console.log('收到了对方的消息：', message)
      // 将收到的消息加入到数组中
      chatList.value.push(message)
      // 滚动到底部
      scrollToBottom()
    }
  }

  // 当前手机操作系统名称
  const osName = ref('')

  onLoad(async () => {
    // 获取操作系统名称
    osName.value = await getOsName()

    // 订阅/监听/注册 接收消息事件，做响应的处理
    uni.$on(UniAppEvent.ReceiveMsg, receiveMsg)
  })

  // 语音消息id的数组
  const messageIds = []

  // 收集语音消息 id
  const collectVoiceMsgId = (messageId) => {
    messageIds.push(messageId)
  }

  // 页面卸载/退出的时候会自动执行 卸载钩子
  onUnload(async () => {
    try {
      // 取消 订阅/监听/注册 接收消息事件
      uni.$off(UniAppEvent.ReceiveMsg, receiveMsg)

      // 发请求，批量的将会话下的消息设置为已访问
      await putSessionBatchVisitedApi(sessionId)

      // 更新语音消息状态
      if (messageIds.length > 0) {
        await putMessageBatchReadApi({
          sessionId,
          messageIds
        })
      }
      // 通知消息页 退出 聊天页了
      uni.$emit(
        UniAppEvent.ExitChatPage,
        chatList.value[chatList.value.length - 1]
      )
    } catch (e) {
      console.log(e)
    }
  })

  /**
   * 统一发送消息
   * @param type 消息类型
   * @param content 消息内容
   */
  const sendMsg = async (type, content) => {
    // 消息对象
    const message = {
      type,
      sessionId,
      fromId: userStore.userInfo.userId,
      toId: chatStore.fangDong.id,
      createTime: Date.now(),
      visited: msgStatus.unVisited,
      content
    }

    // 针对语音消息，添加 status 字段，控制语音是否播放
    if (type === msgType.voice) {
      message.status = voiceMsgStatus.unPlay
    }

    try {
      // 调用 socket.send({ type, data })
      await socket.send({
        type: websocketMsgType.chat,
        // 如果是卡片消息或语音消息，content 的值是对象，但是发给服务器类型是json格式字符串，
        // 所以需要根据消息类型做判断，把卡片或语音消息的content序列化即可

        // 发送给后端的消息格式是一个 json 格式字符串
        data: JSON.stringify(
          [msgType.voice, msgType.card].includes(type)
            ? {
                ...message,
                content: JSON.stringify(content),
                otherUser: chatStore.fangDong
              }
            : {
                ...message,
                otherUser: chatStore.fangDong
              }
        )
      })
      // 将消息对象添加到 chatList 数组中
      chatList.value.push(message)
      // 滚动到底部
      scrollToBottom()

      // 如果是文本消息类型，发送完毕之后需要清空消息
      if (type === msgType.text) {
        msgText.value = ''
      }
    } catch (e) {}
  }
</script>

<template>
  <!-- 顶部导航栏(使用自定义组件) -->
  <bit-nav-bar :title="chatStore.fangDong.nickName" />
  <!-- 聊天区域(会话区域)可滚动的scroll-view -->
  <scroll-view
    scroll-y
    class="chat"
    :scroll-into-view="scrollViewId"
    scroll-with-animation
    :style="{
      bottom: chatBottomDis + 'px'
    }"
    @click="pageClick"
    @scrolltoupper="reachTop"
  >
    <!-- 单条聊天消息(记录) -->
    <ChatItem
      v-for="(item, index) in chatList"
      :key="index"
      :msg="item"
      :index="index"
      @play="collectVoiceMsgId"
    />

    <!-- 聊天区底部盒子 -->
    <view class="chatBottom" :id="chatBottomId"></view>
  </scroll-view>
  <!-- 底部操作区域 -->
  <view
    class="action"
    :style="{
      bottom: actionBottomDis + 'px'
    }"
  >
    <!-- 左 -->
    <view class="left">
      <bit-icon
        name="laba"
        size="54"
        v-if="mode !== chatMode.voice"
        @click="changeMode"
      />
      <bit-icon name="jianpan" size="54" v-else @click="changeMode" />
    </view>
    <!-- 中 -->
    <view class="middle">
      <view
        class="longpress"
        v-if="mode === chatMode.voice"
        @touchstart="touchStart"
        @touchend="touchEnd"
        @touchmove="touchMove"
        @touchcancel="touchCancel"
      >
        {{ isRecording ? '松开 结束' : '按住 说话' }}
      </view>
      <!-- 
        :adjust-position="false": 取消键盘弹起时候上推页面

        confirm-type: 设置键盘右下角按钮的文本
        confirm-hold: 点击了右下角按钮是否收起键盘
      -->
      <input
        type="text"
        placeholder="对ta发送消息"
        class="input"
        confirm-type="send"
        confirm-hold
        v-else
        v-model.trim="msgText"
        :focus="isFocus"
        :adjust-position="false"
        @confirm="sendMsg(msgType.text, msgText)"
      />
    </view>
    <!-- 右 -->
    <view class="right">
      <button
        class="btn-send"
        v-if="osName !== os.ios && msgText.length > 0"
        @click="sendMsg(msgType.text, msgText)"
      >
        发送
      </button>
      <template v-else>
        <bit-icon
          name="biaoqing"
          size="54"
          v-if="mode !== chatMode.emoji"
          class="icon"
          @click="rightIconClick(chatMode.emoji)"
        />
        <bit-icon
          name="jianpan"
          size="54"
          v-else
          class="icon"
          @click="rightIconClick(chatMode.text)"
        />
        <bit-icon
          name="gengduo"
          size="54"
          @click="rightIconClick(chatMode.extension)"
        />
      </template>
    </view>
  </view>
  <!-- 表情包或扩展菜单区域 -->
  <view
    class="panel"
    :style="{
      paddingBottom: bottomDis + 'px'
    }"
    v-show="visible"
  >
    <!-- 表情包 -->
    <ChatEmoji
      @select="selectEmoji"
      :hasContent="!!msgText"
      @del="delEmoji"
      v-if="mode === chatMode.emoji"
    />
    <!-- 扩展菜单 -->
    <ChatExtension
      @success="selectOrTakeImage"
      v-else-if="mode === chatMode.extension"
    />
  </view>

  <!-- 取消录音发送的模态框 -->
  <view class="modal" v-show="isRecording">
    <view class="content">
      <bit-icon
        name="https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/message/recording.gif"
        size="150"
      />
      <text class="text">
        {{ isCancelRecord ? '松开手指' : '手指上滑' }}，取消发送
      </text>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  // 聊天区域（会话区域）
  .chat {
    box-sizing: border-box;
    position: fixed;
    top: 176rpx;
    left: 0;
    right: 0;
    padding: 15rpx 30rpx;
    background: $bg-color-shallow;
    .chatBottom {
      width: 100%;
      height: 1rpx;
      background: transparent;
    }
  }
  // 底部操作区
  .action {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 120rpx;
    padding: 20rpx 30rpx;
    background: $bg-color-white;
    .middle {
      .input,
      .longpress {
        width: 456rpx;
        height: 80rpx;
        line-height: 80rpx;
        margin: 0 24rpx;
        border-radius: 16rpx;
        font-size: $font-size-sm-26;
        background: $bg-color-chat-longpress;
        color: $font-color-shallow;
      }
      .input {
        box-sizing: border-box;
        padding-left: 20rpx;
      }
      .longpress {
        text-align: center;
      }
    }
    .right {
      .btn-send {
        width: 132rpx;
        height: 68rpx;
        line-height: 68rpx;
        border-radius: 16rpx;
        font-size: $font-size-sm-26;
        background: $bg-color-active;
        color: $font-color-white;
      }
      .icon {
        margin-right: 24rpx;
      }
    }
  }
  // 表情包或扩展菜单区域
  .panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 690rpx;
    height: 490rpx;
    padding: 0 30rpx;
    background: $bg-color-chat-popup;
  }

  // 取消录音发送的模态框
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 176rpx;
    @include bottom-safe__distance(120);
    left: 0;
    right: 0;
    background: transparent;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 360rpx;
      height: 360rpx;
      border-radius: 36rpx;
      background: $bg-color-mask;
      .text {
        margin-top: 30rpx;
        font-size: $font-size-md-30;
        color: $font-color-white;
      }
    }
  }
</style>
