<script setup>
  const props = defineProps({
    item: {
      type: Object,
      default: () => ({})
    }
  })
  // 跳转至房源详情页
  const goToHouseDetailPage = () => {
    uni.navigateTo({
      url: '/pages/detail/detail?houseId=' + props.item.houseId
    })
  }
</script>

<template>
  <view class="bit-house-item" @click="goToHouseDetailPage">
    <!-- 左侧头图 -->
    <image
      class="headImage"
      :src="props.item.headImage"
      mode="scaleToFill"
    />
    <!-- 右侧信息 -->
    <view class="info">
      <!-- 标题 -->
      <view class="title">
        {{ props.item.title }}
      </view>
      <!-- 主体信息 -->
      <view class="main">
        <!-- 描述 -->
        <view class="desc">
          <view class="area">{{ props.item.area }}㎡</view>
          <view class="verticalLine"></view>
          <view class="position">朝{{ props.item.position }}</view>
          <view class="verticalLine"></view>
          <view class="regionName">{{ props.item.regionName }}</view>
        </view>
        <!-- 价格 -->
        <view class="price">
          <text class="rmb">¥</text>
          <text class="num">{{ props.item.price }}</text>
          <text class="perMonth">/月</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .bit-house-item {
    display: flex;
    padding: 20rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    background: $bg-color-white;
    .headImage {
      width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
      margin-right: 20rpx;
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      .title {
        @include text-ellipsis(2);
        font-size: $font-size-md-28;
        color: $font-color-dark;
        font-weight: 600;
      }
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 5rpx;
        .desc {
          display: flex;
          align-items: center;
          .area,
          .position,
          .regionName {
            font-size: $font-size-sm-24;
            color: $font-color-middle;
          }
          .verticalLine {
            width: 1rpx;
            height: 16rpx;
            margin: 0 19rpx;
            background-color: $bg-color-middle;
          }
        }

        .price {
          display: flex;
          align-items: baseline;
          color: $font-color-price;
          font-weight: 600;
          .rmb {
            font-size: $font-size-sm-24;
          }
          .num {
            font-size: $font-size-md-30;
          }
          .perMonth {
            font-size: $font-size-sm-26;
          }
        }
      }
    }
  }
</style>
