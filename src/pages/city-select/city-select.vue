<script setup>
  import { useLocationStore } from '@/stores'
  import { ref } from 'vue'
  import { getCityListApi } from '@/api/city-select'
  const locationStore = useLocationStore()
  // 热门城市列表
  const hotCityList = ref([])
  // 全城市
  const allCityMap = ref({})

  const getCityList = async () => {
    const resp = await getCityListApi()
    hotCityList.value = resp.hotCityList
    allCityMap.value = resp.allCityMap
  }
  getCityList()

  const scrollIntoViewId = ref(null)
  // 右侧字母点击时
  const onLetterClick = (id) => {
    scrollIntoViewId.value = id
  }

  // 重新定位
  const onRelocation = async () => {
    try {
      // 请求用户所在位置城市信息（保存在locationStore中）
      await locationStore.getLocationAction()
      // 返回到首页（基于当前的城市请求房源列表）
    } catch (e) {
    } finally {
      // 返回到首页
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }
  }
  // 选择城市时
  const onCitySelect = (city) => {
    // 选择的城市与当前所在城市不是同一个
    if (city.id !== locationStore.location.id) {
      // 更新位置信息
      locationStore.setLocationAction(city)
    }
    // 返回到上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
  }
</script>

<template>
  <!-- 导航栏 -->
  <bit-nav-bar title="选择城市" />
  <!-- 当前城市 -->
  <view class="now">
    <text class="title">当前定位</text>
    <view class="position">
      <view class="left">
        <bit-icon name="weizhi" size="32" class="icon-weizhi" />
        <text class="cityName">
          {{ locationStore.location.name }}
        </text>
      </view>
      <text class="right" @click="onRelocation">重新定位</text>
    </view>
  </view>
  <!-- 可滚动的 scroll-view -->
  <scroll-view
    scroll-y
    class="city-select"
    :scroll-into-view="scrollIntoViewId"
    scroll-with-animation
  >
    <!-- 热门城市 -->
    <view class="hot">
      <!-- 热门城市 -->
      <text class="title">热门城市</text>
      <view class="hot-list">
        <view
          class="hot-item"
          :class="{
            active: item.id === locationStore.location.id
          }"
          v-for="item in hotCityList"
          :key="item.id"
          @click="onCitySelect(item)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>
    <!-- 城市列表 -->
    <view class="list">
      <view
        class="list-group"
        v-for="(cityList, title) in allCityMap"
        :key="title"
      >
        <text class="title" :id="title">{{ title }}</text>
        <view
          class="group-item"
          v-for="city in cityList"
          :key="city.id"
          @click="onCitySelect(city)"
        >
          {{ city.name }}
        </view>
      </view>
    </view>
  </scroll-view>
  <!-- 字母列表 -->
  <view class="letter-list">
    <view
      class="letter-item"
      :class="{
        active: key === scrollIntoViewId
      }"
      v-for="(,key) in allCityMap"
      :key="key"
      @click="onLetterClick(key)"
    >
      {{ key }}
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .now {
    box-sizing: border-box;
    position: fixed;
    top: 176rpx;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 148rpx;
    padding: 0 30rpx;
    border-bottom: 10rpx solid $bg-color-shallow;
    background: $bg-color-white;
    .position {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      .left {
        .icon-weizhi {
          position: relative;
          top: 6rpx;
        }
        .cityName {
          margin-left: 10rpx;
          font-size: $font-size-md-28;
          font-weight: 600;
          color: $font-color-dark;
        }
      }
      .right {
        font-size: $font-size-sm-26;
        color: $font-color-active;
      }
    }
  }
  .title {
    font-size: $font-size-sm-26;
    color: $font-color-middle;
  }

  .city-select {
    box-sizing: border-box;
    position: fixed;
    top: 324rpx;
    @include bottom-safe__distance;
    left: 0;
    right: 0;
    padding: 30rpx;
    background: $bg-color-white;
    // 热门城市
    .hot {
      &-list {
        display: flex;
        flex-wrap: wrap;
        padding: 10rpx 38rpx;
        .hot-item {
          width: 192rpx;
          height: 74rpx;
          margin: 10rpx 20rpx 10rpx 0;
          line-height: 74rpx;
          text-align: center;
          border-radius: 16rpx;
          font-size: $font-size-sm-26;
          color: $font-color-dark;
          background: $bg-color-shallow;
          &:nth-child(3n) {
            margin-right: 0;
          }
          &.active {
            color: $font-color-active;
            background: $bg-color-grid-active;
          }
        }
      }
    }
    // 城市列表
    .list {
      &-group {
        .title,
        .group-item {
          height: 79rpx;
          line-height: 79rpx;
        }
        .group-item {
          padding: 0 38rpx;
          @include border-1rpx;
          font-size: $font-size-md-28;
          color: #222;
        }
      }
    }
  }

  // 右侧字母列表
  .letter-list {
    position: fixed;
    right: 30rpx;
    top: 462rpx;
    .letter-item {
      margin-bottom: 20rpx;
      font-size: $font-size-xs-22;
      color: $font-color-dark;
      &:last-child {
        margin-bottom: 0;
      }
      &.active {
        font-weight: 600;
        color: $font-color-active;
      }
    }
  }
</style>
