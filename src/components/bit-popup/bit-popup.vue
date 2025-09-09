<script setup>
  const model = defineModel()

  const props = defineProps({
    // 控制是否显示确定按钮
    showConfirmButton: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['close', 'confirm'])

  // 点击遮罩层（关闭弹出层）
  const onClose = () => {
    model.value = false
    // 通知外界（组件使用者），触发 close 自定义事件
    emit('close')
  }

  // 点击确定按钮
  const onConfirm = () => {
    // 通知外界（组件使用者），触发 confirm 自定义事件
    emit('confirm')
  }
</script>

<template>
  <view class="bit-popup" v-show="model">
    <!-- 遮罩层 -->
    <view class="mask" @click="onClose"></view>
    <!-- 主体内容 -->
    <view
      class="container"
      :style="{
        paddingBottom: props.showConfirmButton ? '110rpx' : '0'
      }"
    >
      <scroll-view scroll-y class="main">
        <!-- 用插槽占位 -->
        <slot></slot>
      </scroll-view>
      <button
        class="btn-confirm"
        v-if="props.showConfirmButton"
        @click="onConfirm"
      >
        确定
      </button>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  .bit-popup {
    position: fixed;
    top: 264rpx;
    left: 0;
    right: 0;
    bottom: 0;
    // 遮罩层
    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: $bg-color-mask;
    }
    // 主体内容
    .container {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-height: 820rpx;
      min-height: 240rpx;
      padding: 0 34rpx;
      background: $bg-color-white;
      border-radius: 0 0 30rpx 30rpx;
      .main {
        max-height: 700rpx;
        min-height: 240rpx;
      }
      .btn-confirm {
        position: absolute;
        bottom: 30rpx;
        width: 682rpx;
        height: 80rpx;
        font-size: $font-size-md-28;
        color: $font-color-white;
        font-weight: 600;
        border-radius: 16rpx;
        background: linear-gradient(
          to right,
          $bg-color-from,
          $bg-color-to
        );
      }
    }
  }
</style>
