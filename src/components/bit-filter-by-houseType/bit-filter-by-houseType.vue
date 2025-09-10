<script setup>
  import { useFilterStore } from '@/stores'
  import { computed } from 'vue'

  const filterStore = useFilterStore()

  // 当点击租房类型单元格时
  const onRentTypeClick = (item) => {
    // 点击的是不限
    if (item.key === null) {
      // 让其他的取消选中
      filterStore.filterInfo.rentTypeList.forEach((rentType) => {
        if (rentType.selected) {
          rentType.selected = false
        }
      })
      // 让不限选中
      item.selected = true
    } else {
      item.selected = !item.selected

      // 检测除了不限之外的有没有选中的，如果有，则不限让取消选中；否则不限要选中

      // slice(startIndex, endIndex): 数组的截取
      // some(() => {}): 检测数组中是否有满足条件的元素，只要有，返回true；否则（都不满足）返回false
      filterStore.filterInfo.rentTypeList[0].selected =
        !filterStore.filterInfo.rentTypeList
          .slice(1)
          .some((rentType) => rentType.selected)
    }
  }

  // 当点击居室单元格时
  const onRoomNumClick = (item) => {
    if (item.key === null) {
      filterStore.filterInfo.roomNumList.forEach((roomNum) => {
        if (roomNum.selected) {
          roomNum.selected = false
        }
      })
      item.selected = true
    } else {
      item.selected = !item.selected
      filterStore.filterInfo.roomNumList[0].selected =
        !filterStore.filterInfo.roomNumList
          .slice(1)
          .some((roomNum) => roomNum.selected)
    }
  }

  // 计算选中的租房类型列表
  const selectedRentTypeList = computed(() => {
    return filterStore.filterInfo.rentTypeList
      .slice(1)
      .filter((item) => item.selected)
  })

  // 计算选中的居室列表
  const selectedRoomNumList = computed(() => {
    return filterStore.filterInfo.roomNumList
      .slice(1)
      .filter((item) => item.selected)
  })

  defineExpose({
    selectedRentTypeList,
    selectedRoomNumList
  })
</script>
<template>
  <view class="bit-filter-by-houseType">
    <view class="title">租房类型</view>
    <view class="rent-list">
      <view
        class="filter-grid-item"
        :class="{
          active: item.selected
        }"
        v-for="item in filterStore.filterInfo.rentTypeList"
        :key="item.id"
        @click="onRentTypeClick(item)"
      >
        {{ item.name }}
      </view>
    </view>

    <view class="title">居室</view>
    <view class="room-list">
      <view
        class="filter-grid-item"
        :class="{
          active: item.selected
        }"
        v-for="item in filterStore.filterInfo.roomNumList"
        :key="item.id"
        @click="onRoomNumClick(item)"
      >
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/variables.scss';
  .bit-filter-by-houseType {
    z-index: 2;
    position: relative;
    .title {
      margin: 30rpx 0 20rpx;
      font-size: $font-size-md-28;
      font-weight: 600;
      color: $font-color-dark;
    }
    .rent-list,
    .room-list {
      display: flex;
      // 换行显示
      flex-wrap: wrap;
    }
  }
</style>
