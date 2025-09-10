<script setup>
  import { useFilterStore } from '@/stores'
  import { ref } from 'vue'
  const filterStore = useFilterStore()

  // 当前激活的region下标
  const currentIndex = ref(0)

  // 记录选中的区县
  const selectedRegion = ref(null)

  // 当点击区县时
  const onRegionClick = (i) => {
    if (currentIndex.value === i) return
    // 更新 currentIndex
    currentIndex.value = i
    // 更新选中的区县对象
    selectedRegion.value = filterStore.filterInfo.regionList[i]
  }

  // 通过 defineExpose 方法把选中的区县暴露出去，参数是一个对象，表明可以暴露多个属性和方法
  // 目的是在使用组件的时候可以拿到该数据
  defineExpose({
    selectedRegion
  })
</script>
<template>
  <view class="bit-filter-by-region">
    <view
      class="region-item"
      v-for="(item, index) in filterStore.filterInfo.regionList"
      :key="item.id"
      @click="onRegionClick(index)"
    >
      <text
        class="region-item__text"
        :class="{
          active: currentIndex === index
        }"
      >
        {{ item.name }}
      </text>
      <bit-icon
        name="queding"
        size="40"
        v-if="currentIndex === index"
      />
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .bit-filter-by-region {
    z-index: 2;
    position: relative;
    .region-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding: 0 24rpx;
      @include border-1rpx(top);
      &__text {
        font-size: $font-size-md-28;
        color: $font-color-dark;
        &.active {
          color: $font-color-active;
        }
      }
    }
  }
</style>
