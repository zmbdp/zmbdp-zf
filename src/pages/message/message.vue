<script setup>
  import { onLoad, onUnload } from '@dcloudio/uni-app';
  import SessionItem from './components/session-item.vue';
  import { useSessionStore, useUserStore } from '@/stores';
  import { UniAppEvent, updateSessionTime } from '@/constants/common';
  import { setRedDot } from '@/utils/redDot';
  import socket from '@/utils/websocket'; // 添加socket导入

  const sessionStore = useSessionStore();
  const userStore = useUserStore();

  // 跳转至登录页
  const goToLoginPage = () => {
    // 携带消息的路由路径参数，因为登录成功后要跳回消息页
    uni.navigateTo({
      url: '/pages/login/login?redirectUrl=pages/message/message'
    });
  };

  // 消息页加载的时候，自动执行
  // 注意：对于 Tabbar 页面而言，onLoad 钩子只会执行一次；
  // 对于非Tabbar页面，onLoad 钩子在每次加载的时候都会执行一次
  onLoad(() => {
    uni.$on(UniAppEvent.ExitChatPage, (message) => {
      // 更新会话列表
      sessionStore.updateSessionList(
        updateSessionTime.exitChatPage,
        message
      );
      // 设置红点
      setRedDot();
    });
  });

  // 页面卸载时
  onUnload(() => {
    // 关闭WebSocket连接
    socket.close();
  });
</script>

<template>
  <!-- 顶部导航栏 -->
  <bit-nav-bar title="消息" :showLeft="false" />

  <!-- 主体内容：可滚动的 scroll-view -->
  <scroll-view scroll-y class="session">
    <view class="noLogin" v-if="!userStore.token">
      <text class="text">请先登录</text>
      <!-- 登录按钮(未登录的时候展示) -->
      <button class="btn-login" @click="goToLoginPage">去登录</button>
    </view>
    <!-- 缺省图(已登录但没有内容的展示) -->
    <view
      class="noContent"
      v-else-if="sessionStore.sessionList.length === 0"
    >
      <bit-quesheng />
    </view>
    <template v-else>
      <!-- 会话列表(已登录并且有内容) -->
      <view class="session-list">
        <SessionItem
          v-for="(session, index) in sessionStore.sessionList"
          :key="session.sessionId"
          :session="session"
          :last="index === sessionStore.sessionList.length - 1"
        />
      </view>
      <!-- 提示文本 -->
      <view class="tips">
        <view class="line left"></view>
        <view class="text">已经到底了</view>
        <view class="line right"></view>
      </view>
    </template>
  </scroll-view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .session {
    box-sizing: border-box;
    position: fixed;
    top: 176rpx;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 30rpx 0;
    background: $bg-color-shallow;
    // 未登录
    .noLogin {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 350rpx;
      // 提示文本
      .text {
        font-size: $font-size-sm-26;
        color: $font-color-shallow;
      }
      // 去登录按钮
      .btn-login {
        width: 260rpx;
        height: 88rpx;
        margin-top: 30rpx;
        line-height: 88rpx;
        font-size: $font-size-md-28;
        border-radius: 44rpx;
        color: $font-color-white;
        background: linear-gradient(
          to right,
          $bg-color-from,
          $bg-color-to
        );
      }
    }
    // 无内容
    .noContent {
      margin-top: 240rpx;
    }
    // 会话列表
    .session-list {
      background: $bg-color-white;
      border-radius: 16rpx;
    }

    // 提示文本
    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40rpx;
      .line {
        width: 108rpx;
        height: 3rpx;
        &.left {
          background: linear-gradient(to left, #c9c9c9, #f5f5f5);
        }
        &.right {
          background: linear-gradient(to right, #c9c9c9, #f5f5f5);
        }
      }
      .text {
        margin: 0 10rpx;
        font-size: $font-size-sm-26;
        color: $font-color-shallow;
      }
    }
  }
</style>
