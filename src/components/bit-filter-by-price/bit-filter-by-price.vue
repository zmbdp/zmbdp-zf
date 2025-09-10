<script setup>
  import { useFilterStore } from '@/stores'
  import { computed } from 'vue'

  const filterStore = useFilterStore()

  // 当点击单个租金时
  const onPriceClick = (item) => {
    // 当点击的是不限，不限要高亮，其他都取消高亮
    if (item.key === null) {
      filterStore.filterInfo.rentRangeList.forEach((rentRange) => {
        if (rentRange.selected) {
          rentRange.selected = false
        }
      })
      item.selected = true
    } else {
      // 当点击的不是不限，当前的需要高亮，不限要取消高亮
      item.selected = !item.selected

      // 当 rentRangeList 中全部没有选中的时候，不限要高亮
      filterStore.filterInfo.rentRangeList[0].selected =
        filterStore.filterInfo.rentRangeList
          .filter((rentRange) => rentRange.key !== null)
          .every((rentRange) => !rentRange.selected)
    }
  }

  // 计算选中的价格区间
  const selectedRentRangeList = computed(() => {
    // 把选中的非不限的价格区间计算出来
    return filterStore.filterInfo.rentRangeList.filter(
      (item) => item.key !== null && item.selected
    )
  })

  defineExpose({
    selectedRentRangeList
  })
</script>

<template>
  <view class="bit-filter-by-price">
    <view
      class="filter-grid-item"
      :class="{
        active: item.selected
      }"
      v-for="item in filterStore.filterInfo.rentRangeList"
      :key="item.id"
      @click="onPriceClick(item)"
    >
      {{ item.name }}
    </view>
  </view>
</template>

<style lang="scss">
  .bit-filter-by-price {
    display: flex;
    // 一行放不下的元素换行显示
    flex-wrap: wrap;
    padding-top: 20rpx;
  }
</style>
