<script setup>
  import { useUserStore } from '@/stores'
  const userStore = useUserStore()

  const goToLoginPage = () => {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }

  // 退出登录
  const onLogout = () => {
    // 询问
    uni.showModal({
      title: '温馨提示',
      content: '确定退出么?',
      success: async (res) => {
        if (res.confirm) {
          // 点击了确定
          // 封装退出登录action函数：清空token和userInfo
          await userStore.logoutAction()
        }
      }
    })
  }

  const goToEditPage = () => {
    uni.navigateTo({
      url: '/pages/edit/edit'
    })
  }
</script>

<template>
  <view class="mine">
    <!-- 顶部 -->
    <view class="header">
      <view class="info">
        <!-- 已登录 -->
        <template v-if="userStore.token">
          <image
            class="avatar"
            :src="userStore.userInfo.avatar"
            mode="scaleToFill"
          />
          <text class="text">{{ userStore.userInfo.nickName }}</text>
        </template>
        <!-- 未登录 -->
        <template v-else>
          <bit-icon name="morentouxiang" size="118" />
          <text class="text" @click="goToLoginPage">点击登录</text>
        </template>
      </view>
    </view>
    <!-- 主体 -->
    <view class="main">
      <!-- 编辑资料 -->
      <view class="link" v-if="userStore.token" @click="goToEditPage">
        <text class="text">编辑资料</text>
        <bit-icon name="fanhui-right" size="26" />
      </view>
      <!-- 二维码 -->
      <view class="qrCode">
        <image
          class="qrCodeImage"
          src="https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/profile/zmbdp-qrcode.jpg"
          mode="scaleToFill"
          show-menu-by-longpress
        />
        <text class="text">扫二维码</text>
        <text class="text">关注"稚能安居"公众号</text>
      </view>
      <!-- 退出按钮 -->
      <button
        class="btn-login"
        plain
        v-if="userStore.token"
        @click="onLogout"
      >
        退出登录
      </button>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  .mine {
    .header {
      display: flex;
      align-items: flex-end;
      box-sizing: border-box;
      height: 354rpx;
      padding: 30rpx;
      background: linear-gradient(
        to right bottom,
        $bg-color-from,
        $bg-color-to
      );

      .info {
        display: flex;
        height: 118rpx;
        align-items: center;
        .avatar {
          width: 118rpx;
          height: 118rpx;
          border-radius: 50%;
        }
        .text {
          margin-left: 23rpx;
          font-size: 36rpx;
          font-weight: 600;
          color: $font-color-white;
        }
      }
    }
    .main {
      padding: 20rpx 30rpx;
      background-color: $bg-color-shallow;
      .link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100rpx;
        padding: 0 33rpx 0 57rpx;
        border-radius: 16rpx;
        background: $bg-color-white;
      }
      .text {
        font-size: $font-size-md-28;
        color: $font-color-dark;
        font-weight: 600;
      }
      .qrCode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20rpx 0 30rpx;
        padding: 266rpx 0 124rpx;
        background: $bg-color-white;
        border-radius: 16rpx;
        .qrCodeImage {
          width: 280rpx;
          height: 280rpx;
          margin-bottom: 22rpx;
        }
      }
      .btn-login {
        height: 100rpx;
        line-height: 100rpx;
        border-radius: 16rpx;
        font-size: $font-size-md-28;
        font-weight: 600;
        color: $font-color-middle;
        background: $bg-color-white;
        border: none;
      }
    }
  }
</style>
