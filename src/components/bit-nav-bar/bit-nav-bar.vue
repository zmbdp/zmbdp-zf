<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    // 标题
    title: {
      type: String,
      default: '稚能安居'
    },
    // 背景色(纯色)
    bgColor: {
      type: String,
      default: '#fff'
    },
    // 渐变的方向（从上往下，从左往右等）
    direction: String,
    // 渐变起始色
    bgStartColor: String,
    // 渐变结束色
    bgEndColor: String,
    // 是否展示左侧内容
    showLeft: {
      type: Boolean,
      default: true
    }
  });

  const navbarStyle = computed(() => {
    return {
      background: props.direction
        ? `linear-gradient(to ${props.direction}, ${props.bgStartColor}, ${props.bgEndColor})`
        : props.bgColor
    };
  });

  // 点击左侧箭头，返回到上一页
  const onBack = () => {
    // 获取所有的页面战
    const pages = getCurrentPages();

    // 如果有其他页面
    if (pages.length >= 2) {
      // 返回到上个页面
      uni.navigateBack();
    } else {
      setTimeout(() => {
        // 跳转到首页，因为首页是 tabbar 页面
        // 必须用 switchTab 的方式进行跳转
        uni.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    }
  };
</script>

<template>
  <view class="bit-nav-bar" :style="navbarStyle">
    <view class="main">
      <view class="left">
        <slot name="left" v-if="props.showLeft">
          <bit-icon name="fanhui-left" size="32" @click="onBack" />
        </slot>
      </view>
      <view class="middle">{{ props.title }}</view>
      <view class="right"></view>
    </view>
  </view>
  <!-- 空白占位 -->
  <view class="bit-blank-space"></view>
</template>
<style lang="scss">
  @import '@/styles/mixins.scss';
  .bit-nav-bar {
    display: flex;
    align-items: flex-end;
    z-index: 99;
    position: fixed;
    left: 0;
    top: 0;
    width: 750rpx;
    height: 176rpx;
    @include border-1rpx;
    .main {
      display: flex;
      align-items: center;
      width: 750rpx;
      height: 88rpx;
      padding: 0 30rpx;
      .left,
      .middle,
      .right {
        flex: 1;
      }
      .left {
        display: flex;
        align-items: center;
      }
      .middle {
        font-size: $font-size-lg-32;
        color: $font-color-dark;
        font-weight: 600;
        text-align: center;
      }
    }
  }

  .bit-blank-space {
    z-index: 0;
    position: relative;
    height: 176rpx;
  }
</style>
