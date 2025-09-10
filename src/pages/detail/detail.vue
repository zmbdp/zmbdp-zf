<script setup>
  import { getHouseDetailApi } from '@/api/house'
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
  import { computed, ref } from 'vue'
  import { OSS_BASE_URL } from '@/constants/common'
  import { positionMap, tagMap } from '@/constants/house'
  import { showNoneIconToast } from '@/utils/toast'
  import { useUserStore, useChatStore } from '@/stores'

  const userStore = useUserStore()
  const chatStore = useChatStore()

  // 页面生命周期钩子，在页面加载的时候会自动执行
  // query 拿到就是携带过来的路由问号参数
  onLoad((query) => {
    getHouseDetail(query.houseId)
  })

  // 存储房源对象
  const houseDetail = ref({})

  // 获取房源详情
  const getHouseDetail = async (houseId) => {
    try {
      houseDetail.value = await getHouseDetailApi(houseId)
      houseDetail.value.intro = houseDetail.value.intro.replaceAll(
        '<br>',
        ''
      )
    } catch (e) {}
  }

  // 计算得到地图定位的 markers 数组
  const covers = computed(() => {
    return houseDetail.value.houseId
      ? [
          {
            id: 1,
            longitude: houseDetail.value.longitude,
            latitude: houseDetail.value.latitude,
            iconPath: '/static/icons/marker.png',
            width: uni.upx2px(48),
            height: uni.upx2px(48)
          }
        ]
      : []
  })

  // 记录swiper滑动的下标
  const currentIndex = ref(0)
  // swiper下标改变时
  const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current
  }

  // 点击map组件打开地图
  const openLocation = () => {
    if (!houseDetail.value.houseId) return
    const { longitude, latitude, communityName } = houseDetail.value
    uni.openLocation({
      longitude,
      latitude,
      name: communityName,
      success: () => {},
      fail: (e) => {
        showNoneIconToast(e.errMsg)
      }
    })
  }

  // 自定义的分享函数
  onShareAppMessage(() => {
    if (!houseDetail.value.houseId) return
    const { houseId, title, headImage } = houseDetail.value
    // 返回自定义的房源卡片内容
    return {
      title, // 标题
      path: '/pages/detail/detail?houseId=' + houseId, // 房源详情页的路由路径并带上houseId
      imageUrl: OSS_BASE_URL + headImage // 房屋的图片
    }
  })

  // 点击在线咨询按钮
  const onConsult = () => {
    // 登录了
    if (userStore.token) {
      // 禁止与自己聊天
      if (houseDetail.value.userId === userStore.userInfo.userId) {
        showNoneIconToast('不能与自己聊天')
        return
      }
    }

    // 解构
    const {
      headImage,
      title,
      area,
      position,
      regionName,
      price,
      userId,
      houseId
    } = houseDetail.value

    // 保存房东id
    chatStore.setFangDong({
      id: houseDetail.value.userId
    })
    // 保存房源信息
    chatStore.setHouse({
      headImage: OSS_BASE_URL + headImage,
      title,
      area,
      position: positionMap[position],
      regionName,
      price,
      userId,
      houseId
    })

    // 登录了
    if (userStore.token) {
      // 跳转至聊天页
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    } else {
      // 未登录，跳转至登录页，并且携带聊天页的路由路径
      uni.navigateTo({
        url: '/pages/login/login?redirectUrl=pages/chat/chat'
      })
    }
  }
</script>

<template>
  <!-- 导航栏(顶部) -->
  <bit-nav-bar title="房源详情" />
  <!-- 主体内容(可滚动的scroll-view) -->
  <scroll-view scroll-y class="detail" v-if="houseDetail.houseId">
    <!-- swiper轮播图 -->
    <view class="swiper">
      <!-- swiper列表 -->
      <swiper
        autoplay
        circular
        class="swiper-list"
        @change="onSwiperChange"
      >
        <swiper-item
          v-for="(url, index) in houseDetail.images"
          :key="index"
        >
          <image
            :src="OSS_BASE_URL + url"
            mode="scaleToFill"
            class="swiper-image"
          />
        </swiper-item>
      </swiper>
      <!-- 右下角的数字统计 -->
      <view class="swiper-statics">
        <text class="text">{{ currentIndex + 1 }}</text>
        <text class="text">/</text>
        <text class="text">{{ houseDetail.images.length }}</text>
      </view>
    </view>
    <!-- 房源信息1 -->
    <view class="info1">
      <view class="title main-title">
        {{ houseDetail.title }}
      </view>
      <view class="price">
        <text class="rmb">¥</text>
        <text class="num">{{ houseDetail.price }}</text>
        <text class="perMonth">/月</text>
      </view>
      <view class="prop">
        <view class="prop-item">
          <view class="prop-item-value">
            {{ houseDetail.houseType }}
          </view>
          <view class="prop-item-key">户型</view>
        </view>
        <view class="prop-item">
          <view class="prop-item-value">
            {{ houseDetail.area }}㎡
          </view>
          <view class="prop-item-key">建筑面积</view>
        </view>
        <view class="prop-item">
          <view class="prop-item-value">
            {{ houseDetail.floor }}/{{ houseDetail.allFloor }}层
          </view>
          <view class="prop-item-key">楼层</view>
        </view>
        <view class="prop-item">
          <view class="prop-item-value">
            朝{{ positionMap[houseDetail.position] }}
          </view>
          <view class="prop-item-key">朝向</view>
        </view>
      </view>
      <view class="tag">
        <view
          class="tag-item"
          v-for="item in houseDetail.tags"
          :key="item.tagCode"
        >
          <bit-icon :name="tagMap[item.tagCode]" size="44" />
          <text clas="tag-item-text">{{ item.tagName }}</text>
        </view>
      </view>
    </view>
    <!-- 房源信息2 -->
    <view class="info2">
      <!-- 小区 -->
      <view class="xiaoqu">
        <view class="title sub-title">
          {{ houseDetail.communityName }}
        </view>
        <!-- 地图 -->
        <map
          class="map"
          :longitude="houseDetail.longitude"
          :latitude="houseDetail.latitude"
          :markers="covers"
          @click="openLocation"
        />
      </view>
      <!-- 介绍 -->
      <view class="intro">
        <view class="title sub-title">房屋介绍</view>
        <view class="text">
          {{ houseDetail.intro }}
        </view>
      </view>
      <!-- 设备 -->
      <view class="device">
        <view class="title sub-title">房屋设备</view>
        <view class="list">
          <view
            class="item"
            v-for="item in houseDetail.devices"
            :key="item.deviceCode"
          >
            <bit-icon name="peizhi" size="24" />
            <text class="name">{{ item.deviceName }}</text>
          </view>
        </view>
      </view>
      <!-- 核验 -->
      <view class="heyan">
        <bit-icon
          name="anxuanyanzhen"
          width="140"
          height="32"
          class="icon"
        />
        <text class="text">已通过真房实拍核验</text>
      </view>
    </view>
  </scroll-view>
  <!-- 在线咨询按钮(底部) -->
  <view class="footer">
    <!-- 分享按钮 -->
    <button class="btn-share" open-type="share" plain>
      <bit-icon name="fenxiang" size="40" class="icon" />
      <text class="text">分享</text>
    </button>
    <!-- 在线咨询按钮 -->
    <button class="btn-consult" @click="onConsult">在线咨询</button>
  </view>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  .detail {
    position: fixed;
    top: 176rpx;
    @include bottom-safe__distance(114);
    left: 0;
    right: 0;
    background: $bg-color-white;
    // 标题
    .title {
      font-weight: 600;
      color: $font-color-dark;
      &.main-title {
        font-size: $font-size-lg-36;
        @include text-ellipsis;
      }
      &.sub-title {
        font-size: $font-size-lg-32;
      }
    }
    // 轮播图
    .swiper {
      position: relative;
      width: 750rpx;
      height: 530rpx;
      &-list {
        width: 100%;
        height: 100%;
        .swiper-image {
          width: 750rpx;
          height: 530rpx;
        }
      }
      &-statics {
        position: absolute;
        right: 30rpx;
        bottom: 60rpx;
        padding: 10rpx 30rpx;
        border-radius: 27rpx;
        background: $bg-color-mask;
        .text {
          font-size: $font-size-sm-26;
          color: $font-color-white;
        }
      }
    }
    // 房源信息1
    .info1 {
      box-sizing: border-box;
      position: relative;
      top: -30rpx;
      padding: 30rpx;
      border-bottom: 12rpx solid $bg-color-shallow;
      border-radius: 30rpx 30rpx 0 0;
      background: $bg-color-white;
      // 价格
      .price {
        display: flex;
        align-items: baseline;
        margin: 15rpx 0;
        font-weight: 600;
        color: $font-color-price;
        .rmb,
        .perMonth {
          font-size: $font-size-sm-24;
        }
        .num {
          font-size: 42rpx;
        }
      }
      // 属性
      .prop {
        box-sizing: border-box;
        display: flex;
        width: 690rpx;
        height: 142rpx;
        padding: 0 30rpx;
        border-radius: 16rpx;
        background: $bg-color-shallow;
        &-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 157.5rpx;
          margin-right: 15rpx;
          &:last-child {
            margin-right: 0;
          }
          &-key {
            margin-top: 4rpx;
            font-size: $font-size-sm-24;
            color: $font-color-shallow;
          }
          &-value {
            @include text-ellipsis;
            width: 100%;
            font-size: $font-size-lg-32;
            font-weight: 600;
            color: $font-color-dark;
          }
        }
      }
      // 标签
      .tag {
        display: flex;
        margin-top: 30rpx;
        padding: 0 21rpx;
        &-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 54rpx;
          &:last-child {
            margin-right: 0;
          }
          &-text {
            font-size: $font-size-sm-24;
            color: #333;
          }
        }
      }
    }
    // 房源信息2
    .info2 {
      padding: 0 30rpx 30rpx;
      background: $bg-color-white;
      .xiaoqu {
        .map {
          width: 690rpx;
          height: 260rpx;
          margin-top: 20rpx;
        }
      }
      .intro {
        .sub-title {
          margin: 40rpx 0 20rpx;
        }
        .text {
          line-height: 1.5;
          padding: 20rpx;
          border-radius: 16rpx;
          font-size: $font-size-sm-26;
          color: #333;
          background: $bg-color-shallow;
        }
      }
      .device {
        .sub-title {
          margin: 30rpx 0 20rpx;
        }
        .list {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .item {
            display: flex;
            align-items: center;
            width: 172.5rpx;
            margin-bottom: 16rpx;
            .name {
              margin-left: 16rpx;
              font-size: $font-size-sm-24;
              color: #333;
            }
          }
        }
      }
      .heyan {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 690rpx;
        height: 80rpx;
        margin-top: 24rpx;
        padding: 0 20rpx;
        border-radius: 16rpx;
        background: $bg-color-shallow;
        .icon {
          position: relative;
          top: 6rpx;
        }
        .text {
          margin-left: 10rpx;
          font-size: $font-size-sm-24;
          font-weight: 600;
          color: $font-color-dark;
        }
      }
    }
  }
  .footer {
    box-sizing: border-box;
    position: fixed;
    @include bottom-safe__distance;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 114rpx;
    padding: 0 30rpx;
    @include border-1rpx(top);
    background: $bg-color-white;
    .btn-share {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 80rpx;
      padding: 0;
      border: none;
      .icon {
        width: 44rpx;
        height: 40rpx;
      }
      .text {
        width: 44rpx;
        font-size: $font-size-xs-22;
        color: $font-color-dark;
      }
    }
    .btn-consult {
      width: 606rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: $font-size-md-28;
      color: $font-color-white;
      background: linear-gradient(
        to right,
        $bg-color-from,
        $bg-color-to
      );
    }
  }
</style>
