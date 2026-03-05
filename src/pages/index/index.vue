<script setup>
  import {
    diamondList,
    filterTypeMap,
    filterTypeList
  } from '@/constants/home';
  import { OSS_BASE_URL } from '@/constants/common';
  import {
    useLocationStore,
    useFilterStore,
    useUserStore
  } from '@/stores';

  import { computed, ref } from 'vue';
  import { getHouseListApi } from '@/api/home';
  import { showNoneIconToast } from '@/utils/toast';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { UniAppEvent } from '@/constants/common';
  import { setRedDot } from '@/utils/redDot';

  const locationStore = useLocationStore();
  const filterStore = useFilterStore();
  const userStore = useUserStore();

  // uni.upx2px()： 把 upx/rpx 转换成相应的 px，该方法会根据不同的手机机型自动适配
  // 记录筛选位距离顶部导航的高度
  const offsetTop = uni.upx2px(453);
  // 记录是否要固定定位在顶部
  const isFixedTop = ref(false);
  // 关联 scroll-view 组件滚动到的元素 id
  const scrollIntoView = ref(null);
  // scroll-view 滚动事件
  const onScroll = (e) => {
    // e.detail.scrollTop: 滚动高，单位是 px
    // 如果滚动高大于等于筛选位距离顶部的距离，说明已经滚动到了筛选位了，则需要吸顶了；反之就不吸顶
    isFixedTop.value = e.detail.scrollTop >= offsetTop;
    // 如果没有吸顶，需要把 scrollIntoView 设置为null
    if (!isFixedTop.value) {
      scrollIntoView.value = null;
    }
  };

  // 控制弹出层可见性
  const visible = ref(false);
  // 记录筛选类型
  const filterType = ref(null);

  const fn = () => {
    // 当位置变了，批量请求筛选下拉列表
    filterStore.getFilterPullListAction({
      cityId: locationStore.location.id,
      dirtTypes: ['rent_range', 'rent_type_list', 'room_num']
    });
    // 当位置变了之后，在请求房源列表之前，需要将之前一些数据进行重置
    // 当城市变了，不要保留上个城市的参数信息去请求房源
    // 调用重置筛选数据（房源列表，页码等）
    resetFilter();
    // 调用重置筛选参数函数
    resetFilterParams();
    // 当位置变化时，需要获取房源列表
    getHouseList();
  };

  // 当location位置信息发生变化，都会执行回调一次
  locationStore.$subscribe(() => {
    fn();
  });

  // 点击筛选项时
  const onFilterClick = (item) => {
    // 同步当前点击的筛选类型
    filterType.value = item.type;
    // 把 isFixedTop 设置为 true
    isFixedTop.value = true;
    // 让 scroll-view 组件滚动到筛选位的位置
    scrollIntoView.value = 'indexFilterViewId';
    // 把其他的item的isOpen设置为false
    filterTypeList.value.forEach((item) => {
      item.isOpen = false;
    });
    // 把 item的 isOpen 设置为true
    item.isOpen = true;
    visible.value = true;
  };

  // 弹出层关闭事件
  const onClose = () => {
    // 重置筛选项的三角形图标
    filterTypeList.value.forEach((item) => {
      if (item.isOpen) {
        item.isOpen = false;
      }
    });
    // 关闭弹出层
    visible.value = false;

    // 重置 isFixedTop
    isFixedTop.value = false;
  };

  const filterByRegionRef = ref(null);
  const filterByPriceRef = ref(null);
  const filterByHouseTypeRef = ref(null);

  // 收集选中的区域
  const selectedRegion = ref({});
  // 收集选中的租金范围列表
  const selectedRentRangeList = ref([]);
  // 收集选中的出租类型列表
  const selectedRentTypeList = ref([]);
  // 收集选中的居室列表
  const selectedRoomNumList = ref([]);
  // 收集选中的排序规则
  const selectedSort = ref({});

  // 房源列表
  const houseList = ref([]);
  // 房源列表接口是否加载完毕
  const loading = ref(true);

  // 区域是否高亮
  const isRegionActive = computed(() => {
    return (
      Object.keys(selectedRegion.value).length > 0 &&
      selectedRegion.value.id !== -1
    );
  });
  // 计算选中的区域名称
  const regionName = computed(() => {
    if (!isRegionActive.value) return null;
    const arr = ['区', '县'];
    // 获取区县最后一个汉字
    const lastWord = selectedRegion.value.name.slice(-1);
    if (arr.includes(lastWord)) {
      return selectedRegion.value.name.slice(0, -1);
    }
    return selectedRegion.value.name;
  });

  // 租金是否高亮
  const isRentRangeActive = computed(() => {
    return selectedRentRangeList.value.length > 0;
  });
  // 计算展示的租金名称
  const rentRangeName = computed(() => {
    if (!isRentRangeActive.value) return null;
    // 通过拿到name属性的数组，然后利用 join() 拼接成字符串
    return selectedRentRangeList.value
      .map((item) => item.name)
      .join(',');
  });

  // 户型是否高亮
  const isHouseTypeActive = computed(() => {
    return (
      selectedRentTypeList.value.length > 0 ||
      selectedRoomNumList.value.length > 0
    );
  });
  // 是否选中了户型中一种类型
  const isSingle = computed(() => {
    if (!isHouseTypeActive.value) return true;

    if (
      selectedRentTypeList.value.length > 0 &&
      selectedRoomNumList.value.length > 0
    ) {
      return false;
    }
    return true;
  });
  // 计算展示的户型名称
  const houseTypeName = computed(() => {
    if (!isHouseTypeActive.value) return null;
    if (isSingle.value) {
      return selectedRentTypeList.value.length > 0
        ? selectedRentTypeList.value
            .map((item) => item.name)
            .join(',')
        : selectedRoomNumList.value
            .map((item) => item.name)
            .join(',');
    }
    return (
      selectedRentTypeList.value.map((item) => item.name).join(',') +
      ' · ' +
      selectedRoomNumList.value.map((item) => item.name).join(',')
    );
  });
  // 排序是否高亮
  const isSortActive = computed(() => {
    return (
      Object.keys(selectedSort.value).length > 0 &&
      selectedSort.value.key !== 'distance'
    );
  });
  // 计算展示的排序名称
  const sortName = computed(() => {
    if (!isSortActive.value) return null;
    return selectedSort.value.title;
  });
  // 重置筛选参数
  const resetFilterParams = () => {
    if (isRegionActive.value) {
      selectedRegion.value = {};
    }
    if (isRentRangeActive.value) {
      selectedRentRangeList.value = [];
    }
    if (isHouseTypeActive.value) {
      selectedRentTypeList.value = selectedRoomNumList.value = [];
    }
    if (isSortActive.value) {
      selectedSort.value = {};
    }
  };
  // 重置筛选数据
  const resetFilter = () => {
    // 重置页码为1
    pageQuery.pageNo = 1;
    // 清空之前的房源列表
    houseList.value = [];
    // 没有加载完毕
    isFinished = false;
    // 记录房源列表接口在请求中
    loading.value = true;
  };

  // 点击筛选确认时
  const onFilterConfirm = async (selected_sort) => {
    // 当切换了筛选条件 会执行当前函数
    // 需要将之前的数据做重置，然后进行请求房源列表
    resetFilter();
    // 根据当前筛选类型做相应的赋值
    switch (filterType.value) {
      case filterTypeMap.region:
        // 区域
        // 获取选中的区县并完成赋值
        selectedRegion.value = filterByRegionRef.value.selectedRegion;
        break;
      case filterTypeMap.price:
        // 租金
        // 获取选中的租金区间并完成赋值
        selectedRentRangeList.value =
          filterByPriceRef.value.selectedRentRangeList;
        break;
      case filterTypeMap.houseType:
        // 户型
        // 获取选中的租房类型列表和居室列表并完成赋值
        selectedRentTypeList.value =
          filterByHouseTypeRef.value.selectedRentTypeList;
        selectedRoomNumList.value =
          filterByHouseTypeRef.value.selectedRoomNumList;
        break;
      case filterTypeMap.sort:
        // 排序
        // 获取选中的排序规则并完成赋值
        selectedSort.value = selected_sort;
        break;
    }
    // 调用 getHouseList 函数
    getHouseList();
    // 执行关闭操作
    onClose();
  };

  // 分页参数对象
  const pageQuery = {
    pageNo: 1, // 页码
    pageSize: 10 // 每页条数
  };
  // 处理获取房源列表接口的参数
  const handleFilterParams = () => {
    // 城市 id，经纬度
    const {
      id: cityId,
      longitude,
      latitude
    } = locationStore.location;
    // 区县 id
    const regionId =
      selectedRegion.value.id === -1 ? null : selectedRegion.value.id;
    // 得到租金范围 key 的数组
    // map(): 数组映射方法，由一个已有的数组可以得到另一个数组
    const rentalRanges = selectedRentRangeList.value.length
      ? selectedRentRangeList.value.map((item) => item.key)
      : null;
    // 得到租房类型 key 的数组
    const rentTypes = selectedRentTypeList.value.length
      ? selectedRentTypeList.value.map((item) => item.key)
      : null;
    // 得到居室 key 的数组
    const rooms = selectedRoomNumList.value.length
      ? selectedRoomNumList.value.map((item) => item.key)
      : null;
    // 排序规则
    const sort = selectedSort.value.key || 'distance';

    // 返回接口需要的参数对象
    return {
      cityId,
      longitude,
      latitude,
      regionId,
      rentalRanges,
      rentTypes,
      rooms,
      sort,
      ...pageQuery
    };
  };
  // 记录房源列表是否加载完毕
  let isFinished = false;
  // 获取房源列表
  const getHouseList = async () => {
    if (isFinished) {
      showNoneIconToast('没有更多数据啦');
      return;
    }
    // 处理参数：得到接口函数需要的参数格式
    const params = handleFilterParams();
    // 调用接口（请求房源列表）
    const resp = await getHouseListApi(params);
    if (resp.list.length === 0) {
      isFinished = true;
      loading.value = false;
      return;
    }
    // 数据处理(数组的合并)
    // 在之前数组的基础上，追加新数组
    houseList.value = [
      ...houseList.value,
      ...resp.list.map((item) => ({
        ...item,
        headImage: item.headImage
          ? item.headImage.startsWith('http')
            ? item.headImage
            : OSS_BASE_URL + item.headImage
          : ''
      }))
    ];
  };

  // 当房源列表触底的时候（监听触底）
  const onReachBottom = () => {
    // 页码自增
    pageQuery.pageNo++;
    // 请求房源列表
    getHouseList();
  };

  // 跳转至城市选择页
  const goToCitySelectPage = () => {
    uni.navigateTo({
      url: '/pages/city-select/city-select'
    });
  };

  onLoad(() => {
    console.log('首页加载完毕');
    uni.$on(UniAppEvent.LogoutSuccess, () => {
      console.log('首页收到了用户退出登录成功的消息');
    });
  });

  // 每次首页显示(切回来)的时候，都会自动执行 1 次 onShow 钩子
  onShow(async () => {
    // 如果登录了(肯定是有会话列表的)
    if (userStore.token) {
      // 设置红点
      setRedDot();
    }

    // 房源列表为空，并且有城市信息
    if (
      houseList.value.length === 0 &&
      locationStore.location.id !== undefined
    ) {
      // 获取房源列表
      getHouseList();
    }
  });

  // 跳转至列表页，并且携带出租类型参数
  const goToListPage = (rentType) => {
    uni.navigateTo({
      url: '/pages/list/list?rentType=' + rentType
    });
  };
</script>

<template>
  <!-- 顶部导航栏 -->
  <bit-nav-bar title="稚能安居">
    <template #left>
      <text class="index-city" @click="goToCitySelectPage">
        {{ locationStore.location.name }}
      </text>
      <bit-icon name="xiala-dark" size="24" />
    </template>
  </bit-nav-bar>
  <!-- 
    view: 视图容器，类似于div
    scroll-view: 可滚动的容器
  -->
  <!-- 可滚动的 scroll-view -->
  <scroll-view
    class="index"
    scroll-y
    :scroll-into-view="scrollIntoView"
    @scroll="onScroll"
    :class="{
      active: isFixedTop
    }"
    @scrolltolower="onReachBottom"
  >
    <!-- banner位 -->
    <view class="index-banner">
      <image
        src="https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/banner.png"
        mode="scaleToFill"
        class="index-banner__image"
      />
    </view>
    <!-- 金刚位 -->
    <view class="index-diamond">
      <view
        class="index-diamond-item"
        v-for="item in diamondList"
        :key="item.id"
        @click="goToListPage(item.key)"
      >
        <!-- 图标 -->
        <bit-icon :name="item.iconPath" size="100" />
        <!-- 文本 -->
        <text class="text">{{ item.title }}</text>
      </view>
    </view>
    <!-- 筛选位 -->
    <view
      class="index-filter"
      id="indexFilterViewId"
      :class="{
        fixedTop: isFixedTop
      }"
    >
      <view
        class="index-filter-item"
        v-for="item in filterTypeList"
        :key="item.id"
        @click="onFilterClick(item)"
      >
        <!-- 区域筛选 -->
        <template v-if="item.type === filterTypeMap.region">
          <view
            class="text"
            :class="{
              active: item.isOpen || isRegionActive
            }"
          >
            {{ regionName || item.title }}
          </view>
        </template>
        <!-- 租金筛选 -->
        <template v-else-if="item.type === filterTypeMap.price">
          <view
            class="text"
            :class="{
              active: item.isOpen || isRentRangeActive,
              price: isRentRangeActive
            }"
          >
            {{ rentRangeName || item.title }}
          </view>
        </template>
        <!-- 户型筛选 -->
        <template v-else-if="item.type === filterTypeMap.houseType">
          <view
            class="text houseType"
            :class="[
              {
                active: item.isOpen || isHouseTypeActive
              },
              isSingle ? 'single' : 'multiple'
            ]"
          >
            {{ houseTypeName || item.title }}
          </view>
        </template>
        <!-- 排序筛选 -->
        <template v-else-if="item.type === filterTypeMap.sort">
          <view
            class="text"
            :class="{
              active: item.isOpen || isSortActive,
              sort: isSortActive
            }"
          >
            {{ sortName || item.title }}
          </view>
        </template>
        <bit-icon
          :name="item.isOpen ? 'zhankai' : 'xiala-light'"
          size="24"
        />
      </view>
    </view>
    <!-- 房源列表位 -->
    <view
      class="index-houseList"
      :class="{ active: isFixedTop }"
      v-if="houseList.length > 0"
    >
      <bit-house-item
        v-for="item in houseList"
        :key="item.houseId"
        :item="item"
      />
    </view>
    <!-- 缺省页 -->
    <bit-quesheng v-else-if="!loading" />
  </scroll-view>

  <!-- 弹出层组件：显示筛选面板 -->
  <bit-popup
    v-model="visible"
    :showConfirmButton="filterType !== filterTypeMap.sort"
    @close="onClose"
    @confirm="onFilterConfirm"
  >
    <bit-filter-by-region
      v-if="filterType === filterTypeMap.region"
      ref="filterByRegionRef"
    />
    <bit-filter-by-price
      v-else-if="filterType === filterTypeMap.price"
      ref="filterByPriceRef"
    />
    <bit-filter-by-houseType
      v-else-if="filterType === filterTypeMap.houseType"
      ref="filterByHouseTypeRef"
    />
    <bit-filter-by-sort
      v-else-if="filterType === filterTypeMap.sort"
      @confirm="onFilterConfirm"
    />
  </bit-popup>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  // 导航栏城市名称
  .index-city {
    margin-right: 8rpx;
    font-size: $font-size-md-28;
    color: $font-color-dark;
  }
  // 主体内容
  .index {
    box-sizing: border-box;
    position: fixed;
    top: 176rpx;
    bottom: 0;
    width: 100%;
    padding: 0 30rpx;
    background: $bg-color-shallow;
    &.active {
      padding: 0;
    }
    // banner位
    &-banner {
      padding-top: 30rpx;
      &__image {
        width: 690rpx;
        height: 222rpx;
      }
    }
    // 金刚位
    &-diamond {
      display: flex;
      justify-content: space-between;
      width: 690rpx;
      margin: 28rpx 0 30rpx;
      // 每一项
      &-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text {
          margin-top: 8rpx;
          font-size: $font-size-sm-24;
          color: $font-color-dark;
        }
      }
    }
    // 筛选位
    &-filter {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 690rpx;
      height: 88rpx;
      margin-bottom: 20rpx;
      padding: 0 44rpx 0 50rpx;
      border-radius: 16rpx;
      background: $bg-color-white;
      &.fixedTop {
        box-sizing: border-box;
        position: fixed;
        top: 176rpx;
        left: 0;
        width: 100%;
        border-radius: 0;
        @include border-1rpx;
      }
      &-item {
        display: flex;
        .text {
          width: fit-content;
          margin-right: 3rpx;
          font-size: $font-size-sm-26;
          color: $font-color-dark;
          &.active {
            color: $font-color-active;
          }
          // 租金筛选项
          &.price {
            @include text-ellipsis;
            width: 120rpx;
          }
          // 户型筛选项
          &.houseType {
            // 选中了单一类型
            &.single {
              @include text-ellipsis;
              width: fit-content;
              max-width: 115rpx;
            }
            // 选中了两种类型
            &.multiple {
              @include text-ellipsis;
              width: 120rpx;
            }
          }
          // 排序筛选项
          &.sort {
            @include text-ellipsis;
            width: 130rpx;
          }
        }
      }
    }
    // 房源列表位
    &-houseList {
      width: 690rpx;
      padding-bottom: 5rpx;
      &.active {
        box-sizing: border-box;
        width: 750rpx;
        margin-top: 128rpx;
        padding: 0 30rpx 5rpx;
      }
    }
  }
</style>
