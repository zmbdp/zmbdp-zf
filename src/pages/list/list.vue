<script setup>
  import { filterTypeMap, filterTypeList } from '@/constants/home'
  import { OSS_BASE_URL } from '@/constants/common'
  import { useLocationStore, useFilterStore } from '@/stores'
  import { computed, ref } from 'vue'
  import { getHouseListApi } from '@/api/home'
  import { showNoneIconToast } from '@/utils/toast'
  import { onLoad, onUnload } from '@dcloudio/uni-app'
  import { safeBottomDistance } from '@/utils/system'
  const locationStore = useLocationStore()
  const filterStore = useFilterStore()

  // iPhone 底部安全距离
  const bottomDis = safeBottomDistance()

  // 控制筛选弹出层的显示或隐藏
  const visible = ref(false)
  // 当前筛选类型
  const filterType = ref(null)

  // 点击筛选项的时候
  const open = (item) => {
    visible.value = true
    filterType.value = item.type
    filterTypeList.value.forEach((filter) => {
      if (filter.isOpen) {
        filter.isOpen = false
      }
    })
    item.isOpen = true
  }

  // 筛选面板弹出层关闭
  const close = () => {
    visible.value = false

    filterTypeList.value.forEach((filter) => {
      if (filter.isOpen) {
        filter.isOpen = false
      }
    })
  }

  const filterByRegionRef = ref(null)
  const filterByPriceRef = ref(null)
  const filterByHouseTypeRef = ref(null)

  // 收集选中的区域
  const selectedRegion = ref({})
  // 收集选中的租金范围
  const selectedRentRangeList = ref([])
  // 收集选中的出租类型列表
  const selectedRentTypeList = ref([])
  // 收集选中的房屋数量列表
  const selectedRoomNumList = ref([])
  // 收集选中的排序规则
  const selectedSort = ref({})

  // 区域是否高亮
  const isRegionActive = computed(() => {
    return (
      Object.keys(selectedRegion.value).length > 0 &&
      selectedRegion.value.id !== -1
    )
  })
  // 展示的区域名称
  const regionName = computed(() => {
    if (!isRegionActive.value) return null
    return selectedRegion.value.name.slice(0, -1)
  })

  // 租金是否高亮
  const isPriceActive = computed(() => {
    return selectedRentRangeList.value.length > 0
  })
  // 展示的租金名称
  const priceName = computed(() => {
    if (!isPriceActive.value) return null
    return selectedRentRangeList.value
      .map((item) => item.name)
      .join(',')
  })

  // 户型是否高亮
  const isHouseTypeActive = computed(() => {
    return (
      selectedRentTypeList.value.length > 0 ||
      selectedRoomNumList.value.length > 0
    )
  })

  // 是否选择了一种筛选条件(针对的户型筛选项)
  const isSingle = computed(() => {
    if (!isHouseTypeActive.value) return true
    if (
      selectedRentTypeList.value.length > 0 &&
      selectedRoomNumList.value.length > 0
    )
      return false
    return true
  })

  // 展示的户型名称
  const houseTypeName = computed(() => {
    if (!isHouseTypeActive.value) return null
    if (isSingle.value) {
      return selectedRentTypeList.value.length > 0
        ? selectedRentTypeList.value
            .map((item) => item.name)
            .join(',')
        : selectedRoomNumList.value.map((item) => item.name).join(',')
    }

    return (
      selectedRentTypeList.value.map((item) => item.name).join(',') +
      ' · ' +
      selectedRoomNumList.value.map((item) => item.name).join(',')
    )
  })

  // 排序是否高亮
  const isSortActive = computed(() => {
    return (
      Object.keys(selectedSort.value).length > 0 &&
      selectedSort.value.key !== 'distance'
    )
  })

  // 展示的排序名称
  const sortName = computed(() => {
    if (!isSortActive.value) return null
    return selectedSort.value.title
  })

  // 页面加载的时候自动执行
  onLoad((query) => {
    // 设置高亮
    const rentTypeItem = filterStore.setRentTypeActive(query.rentType)
    // 给出租类型方式数组赋初始值
    selectedRentTypeList.value = [rentTypeItem]
    // 请求房源列表
    getHouseList()
  })

  // 页面卸载的时候自动执行
  onUnload(() => {
    // 筛选下拉列表重置
    filterStore.resetFilterInfo()
  })

  // 分页参数
  const query = {
    pageNo: 1,
    pageSize: 10
  }

  // 重置筛选
  const resetFilter = () => {
    query.pageNo = 1
    isFinished = false
    loading.value = true
    houseList.value = []
  }

  // 触底加载更多
  const reachBottom = () => {
    // 页码自增
    query.pageNo++
    // 请求列表
    getHouseList()
  }
  // 筛选确认
  const filterConfirm = (selected_sort) => {
    // 重置
    resetFilter()

    // 收集选中的值
    switch (filterType.value) {
      case filterTypeMap.region:
        // 区域
        selectedRegion.value = filterByRegionRef.value.selectedRegion
        break
      case filterTypeMap.price:
        // 租金
        selectedRentRangeList.value =
          filterByPriceRef.value.selectedRentRangeList
        break
      case filterTypeMap.houseType:
        // 户型
        selectedRentTypeList.value =
          filterByHouseTypeRef.value.selectedRentTypeList
        selectedRoomNumList.value =
          filterByHouseTypeRef.value.selectedRoomNumList
        break
      case filterTypeMap.sort:
        // 排序
        selectedSort.value = selected_sort
        break
    }

    // 获取房源列表
    getHouseList()

    // 关闭弹出层+重置筛选项的三角形
    close()
  }

  // 房源列表
  const houseList = ref([])
  // 记录请求是否结束
  let isFinished = false
  // 请求是否在加载中
  const loading = ref(true)

  // 获取房源列表
  const getHouseList = async () => {
    if (isFinished) {
      showNoneIconToast('没有更多数据啦')
      return
    }
    try {
      // 处理参数
      const params = handleFilterParams()
      // 发请求
      const resp = await getHouseListApi(params)
      if (resp.list.length < query.pageSize) {
        isFinished = true
      }
      // 如何合并
      houseList.value = [
        ...houseList.value,
        ...resp.list.map((item) => ({
          ...item,
          headImage: OSS_BASE_URL + item.headImage
        }))
      ]
      // 关闭加载状态
      loading.value = false
      // 数据处理
    } catch (e) {
      console.log(e)
    }
  }

  // 处理筛选参数
  const handleFilterParams = () => {
    const { id, longitude, latitude } = locationStore.location
    const regionId =
      selectedRegion.value.id === -1 ? null : selectedRegion.value.id
    const rentalRanges =
      selectedRentRangeList.value.length > 0
        ? selectedRentRangeList.value.map((item) => item.key)
        : null
    const rentTypes =
      selectedRentTypeList.value.length > 0
        ? selectedRentTypeList.value.map((item) => item.key)
        : null
    const rooms =
      selectedRoomNumList.value.length > 0
        ? selectedRoomNumList.value.map((item) => item.key)
        : null
    const sort = selectedSort.value.key || 'distance'

    return {
      cityId: id,
      regionId,
      rentalRanges,
      rentTypes,
      rooms,
      sort,
      ...query,
      longitude,
      latitude
    }
  }
</script>

<template>
  <!-- 顶部导航栏 -->
  <bit-nav-bar title="房源列表" />
  <!-- 筛选位 -->
  <view class="filter">
    <view
      class="filter-item"
      v-for="item in filterTypeList"
      :key="item.id"
      @click="open(item)"
    >
      <!-- 区域 -->
      <view
        class="text"
        v-if="item.type === filterTypeMap.region"
        :class="{
          active: item.isOpen || isRegionActive,
          region: isRegionActive
        }"
      >
        {{ regionName || item.title }}
      </view>
      <!-- 租金 -->
      <view
        class="text"
        v-else-if="item.type === filterTypeMap.price"
        :class="{
          active: item.isOpen || isPriceActive,
          price: isPriceActive
        }"
      >
        {{ priceName || item.title }}
      </view>
      <!-- 户型 -->
      <view
        class="text houseType"
        v-else-if="item.type === filterTypeMap.houseType"
        :class="[
          {
            active: item.isOpen || isHouseTypeActive
          },
          isSingle ? 'single' : 'multiple'
        ]"
      >
        {{ houseTypeName || item.title }}
      </view>
      <!-- 排序 -->
      <view
        class="text"
        v-else-if="item.type === filterTypeMap.sort"
        :class="{
          active: item.isOpen || isSortActive,
          sort: isSortActive
        }"
      >
        {{ sortName || item.title }}
      </view>

      <bit-icon
        :name="item.isOpen ? 'zhankai' : 'xiala-light'"
        size="24"
      />
    </view>
  </view>
  <!-- 房源列表 -->
  <scroll-view
    scroll-y
    class="list"
    :style="{
      paddingBottom: bottomDis + 'px'
    }"
    @scrolltolower="reachBottom"
  >
    <!-- 列表 -->
    <view class="main" v-if="houseList.length > 0">
      <!-- 房源卡片组件 -->
      <bit-house-item
        v-for="item in houseList"
        :key="item.houseId"
        :item="item"
      />
    </view>
    <!-- 缺省图 -->
    <bit-quesheng v-else-if="!loading" />
  </scroll-view>
  <!-- 筛选弹出层 -->
  <bit-popup
    v-model="visible"
    @close="close"
    @confirm="filterConfirm"
    :showConfirmButton="filterType !== filterTypeMap.sort"
  >
    <!-- 区域筛选 -->
    <bit-filter-by-region
      ref="filterByRegionRef"
      v-if="filterType === filterTypeMap.region"
    />
    <!-- 租金筛选 -->
    <bit-filter-by-price
      ref="filterByPriceRef"
      v-else-if="filterType === filterTypeMap.price"
    />
    <!-- 户型筛选 -->
    <bit-filter-by-houseType
      ref="filterByHouseTypeRef"
      v-else-if="filterType === filterTypeMap.houseType"
    />
    <!-- 排序筛选 -->
    <bit-filter-by-sort
      v-else-if="filterType === filterTypeMap.sort"
      @confirm="filterConfirm"
    />
  </bit-popup>
</template>

<style lang="scss">
  @import '@/styles/mixins.scss';
  // 筛选位
  .filter {
    box-sizing: border-box;
    position: fixed;
    top: 176rpx;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 50rpx;
    background: $bg-color-white;
    &-item {
      flex: 1;
      display: flex;
      justify-content: center;
      .text {
        margin-right: 8rpx;
        font-size: $font-size-sm-26;
        font-weight: 600;
        color: $font-color-dark;
        // 高亮样式
        &.active {
          color: $font-color-active;
        }
        // 区域
        &.region {
          @include text-ellipsis;
          width: fit-content;
          max-width: 92rpx;
        }
        // 租金
        &.price {
          @include text-ellipsis;
          width: 120rpx;
        }
        // 户型
        &.houseType {
          @include text-ellipsis;
          &.single {
            width: fit-content;
            max-width: 115rpx;
          }
          &.multiple {
            width: 120rpx;
          }
        }
        // 排序
        &.sort {
          @include text-ellipsis;
          width: 130rpx;
        }
      }
    }
  }
  // 列表
  .list {
    position: fixed;
    top: 264rpx;
    bottom: 0;
    left: 0;
    right: 0;
    width: 690rpx;
    padding: 0 30rpx;
    background: $bg-color-shallow;
    .main {
      padding: 20rpx 0 5rpx;
    }
  }
</style>
