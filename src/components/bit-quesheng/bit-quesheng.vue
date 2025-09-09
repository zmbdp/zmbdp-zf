<script setup></script>

<template>
  <view class="bit-quesheng">
    <!-- 图标 -->
    <bit-icon
      name="https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/quesheng.png"
      width="588"
      height="504"
    />
    <!-- 文本 -->
    <text class="text">暂无内容</text>
  </view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  // 缺省图
  .bit-quesheng {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 588rpx;
    height: 588rpx;
    margin: 0 auto;
    .text {
      font-size: $font-size-sm-26;
      color: $font-color-shallow;
    }
  }
</style>
