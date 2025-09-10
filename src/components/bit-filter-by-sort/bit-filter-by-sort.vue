<script setup>
  const props = defineProps()
  import { sortPullList } from '@/constants/home'
  import { ref } from 'vue'

  const emit = defineEmits(['confirm'])
  // 记录当前高亮的下标
  const currentIndex = ref(0)

  // 当点击排序项
  const onSortClick = (i) => {
    if (i === currentIndex.value) return
    currentIndex.value = i
    // 触发 confirm 自定义事件，把当前用户选择的排序规则传给父组件
    emit('confirm', sortPullList[i])
  }
</script>

<template>
  <view class="bit-filter-by-sort">
    <view
      class="sort-item"
      v-for="(item, index) in sortPullList"
      :key="item.key"
      @click="onSortClick(index)"
    >
      <text
        class="sort-item__text"
        :class="{
          active: index === currentIndex
        }"
      >
        {{ item.title }}
      </text>
      <bit-icon
        name="queding"
        size="40"
        v-if="index === currentIndex"
      />
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .bit-filter-by-sort {
    z-index: 2;
    position: relative;
    padding: 0 24rpx;
    .sort-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
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
