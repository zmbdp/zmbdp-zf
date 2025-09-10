<script setup>
  import { extensionList } from '@/constants/chat'
  import { chooseFile, uploadFile2OSS } from '@/utils/file'

  const emit = defineEmits(['success'])

  // 选择或拍摄图片
  const selectOrTakePhoto = async (sourceType) => {
    try {
      // 调用 chooseFile 得到临时文件路径
      const tempFilePath = await chooseFile({
        count: 1,
        mediaType: ['image'],
        sourceType: [sourceType]
      })
      if (!tempFilePath) return
      // 调用 uploadFile2OSS 上传至云服务器
      const url = await uploadFile2OSS(tempFilePath)
      // 把得到的完整的网络图片地址以子传父的形式给到父组件
      emit('success', url)
    } catch (e) {}
  }
</script>
<template>
  <scroll-view scroll-y class="extension">
    <view class="list">
      <view
        class="item"
        v-for="extension in extensionList"
        :key="extension.id"
        @click="selectOrTakePhoto(extension.key)"
      >
        <bit-icon size="140" :name="extension.iconName" />
        <text class="text">{{ extension.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  .extension {
    .list {
      display: flex;
      flex-wrap: nowrap;
      padding: 40rpx 0;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 25%;
        margin-right: 12rpx;
        text-align: center;
        &:nth-child(4n) {
          margin-right: 0;
        }
        .text {
          margin-top: 12rpx;
          font-size: $font-size-sm-24;
          color: $font-color-middle;
        }
      }
    }
  }
</style>
