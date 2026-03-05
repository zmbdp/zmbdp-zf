"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_home = require("../../constants/home.js");
const constants_common = require("../../constants/common.js");
require("../../stores/index.js");
const api_home = require("../../api/home.js");
const utils_toast = require("../../utils/toast.js");
const utils_redDot = require("../../utils/redDot.js");
const stores_modules_filter = require("../../stores/modules/filter.js");
const stores_modules_location = require("../../stores/modules/location.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_house_item2 = common_vendor.resolveComponent("bit-house-item");
  const _easycom_bit_quesheng2 = common_vendor.resolveComponent("bit-quesheng");
  const _easycom_bit_filter_by_region2 = common_vendor.resolveComponent("bit-filter-by-region");
  const _easycom_bit_filter_by_price2 = common_vendor.resolveComponent("bit-filter-by-price");
  const _easycom_bit_filter_by_houseType2 = common_vendor.resolveComponent("bit-filter-by-houseType");
  const _easycom_bit_filter_by_sort2 = common_vendor.resolveComponent("bit-filter-by-sort");
  const _easycom_bit_popup2 = common_vendor.resolveComponent("bit-popup");
  (_easycom_bit_icon2 + _easycom_bit_nav_bar2 + _easycom_bit_house_item2 + _easycom_bit_quesheng2 + _easycom_bit_filter_by_region2 + _easycom_bit_filter_by_price2 + _easycom_bit_filter_by_houseType2 + _easycom_bit_filter_by_sort2 + _easycom_bit_popup2)();
}
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_house_item = () => "../../components/bit-house-item/bit-house-item.js";
const _easycom_bit_quesheng = () => "../../components/bit-quesheng/bit-quesheng.js";
const _easycom_bit_filter_by_region = () => "../../components/bit-filter-by-region/bit-filter-by-region.js";
const _easycom_bit_filter_by_price = () => "../../components/bit-filter-by-price/bit-filter-by-price.js";
const _easycom_bit_filter_by_houseType = () => "../../components/bit-filter-by-houseType/bit-filter-by-houseType.js";
const _easycom_bit_filter_by_sort = () => "../../components/bit-filter-by-sort/bit-filter-by-sort.js";
const _easycom_bit_popup = () => "../../components/bit-popup/bit-popup.js";
if (!Math) {
  (_easycom_bit_icon + _easycom_bit_nav_bar + _easycom_bit_house_item + _easycom_bit_quesheng + _easycom_bit_filter_by_region + _easycom_bit_filter_by_price + _easycom_bit_filter_by_houseType + _easycom_bit_filter_by_sort + _easycom_bit_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const locationStore = stores_modules_location.useLocationStore();
    const filterStore = stores_modules_filter.useFilterStore();
    const userStore = stores_modules_user.useUserStore();
    const offsetTop = common_vendor.index.upx2px(453);
    const isFixedTop = common_vendor.ref(false);
    const scrollIntoView = common_vendor.ref(null);
    const onScroll = (e) => {
      isFixedTop.value = e.detail.scrollTop >= offsetTop;
      if (!isFixedTop.value) {
        scrollIntoView.value = null;
      }
    };
    const visible = common_vendor.ref(false);
    const filterType = common_vendor.ref(null);
    const fn = () => {
      filterStore.getFilterPullListAction({
        cityId: locationStore.location.id,
        dirtTypes: ["rent_range", "rent_type_list", "room_num"]
      });
      resetFilter();
      resetFilterParams();
      getHouseList();
    };
    locationStore.$subscribe(() => {
      fn();
    });
    const onFilterClick = (item) => {
      filterType.value = item.type;
      isFixedTop.value = true;
      scrollIntoView.value = "indexFilterViewId";
      constants_home.filterTypeList.value.forEach((item2) => {
        item2.isOpen = false;
      });
      item.isOpen = true;
      visible.value = true;
    };
    const onClose = () => {
      constants_home.filterTypeList.value.forEach((item) => {
        if (item.isOpen) {
          item.isOpen = false;
        }
      });
      visible.value = false;
      isFixedTop.value = false;
    };
    const filterByRegionRef = common_vendor.ref(null);
    const filterByPriceRef = common_vendor.ref(null);
    const filterByHouseTypeRef = common_vendor.ref(null);
    const selectedRegion = common_vendor.ref({});
    const selectedRentRangeList = common_vendor.ref([]);
    const selectedRentTypeList = common_vendor.ref([]);
    const selectedRoomNumList = common_vendor.ref([]);
    const selectedSort = common_vendor.ref({});
    const houseList = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    const isRegionActive = common_vendor.computed(() => {
      return Object.keys(selectedRegion.value).length > 0 && selectedRegion.value.id !== -1;
    });
    const regionName = common_vendor.computed(() => {
      if (!isRegionActive.value)
        return null;
      const arr = ["区", "县"];
      const lastWord = selectedRegion.value.name.slice(-1);
      if (arr.includes(lastWord)) {
        return selectedRegion.value.name.slice(0, -1);
      }
      return selectedRegion.value.name;
    });
    const isRentRangeActive = common_vendor.computed(() => {
      return selectedRentRangeList.value.length > 0;
    });
    const rentRangeName = common_vendor.computed(() => {
      if (!isRentRangeActive.value)
        return null;
      return selectedRentRangeList.value.map((item) => item.name).join(",");
    });
    const isHouseTypeActive = common_vendor.computed(() => {
      return selectedRentTypeList.value.length > 0 || selectedRoomNumList.value.length > 0;
    });
    const isSingle = common_vendor.computed(() => {
      if (!isHouseTypeActive.value)
        return true;
      if (selectedRentTypeList.value.length > 0 && selectedRoomNumList.value.length > 0) {
        return false;
      }
      return true;
    });
    const houseTypeName = common_vendor.computed(() => {
      if (!isHouseTypeActive.value)
        return null;
      if (isSingle.value) {
        return selectedRentTypeList.value.length > 0 ? selectedRentTypeList.value.map((item) => item.name).join(",") : selectedRoomNumList.value.map((item) => item.name).join(",");
      }
      return selectedRentTypeList.value.map((item) => item.name).join(",") + " · " + selectedRoomNumList.value.map((item) => item.name).join(",");
    });
    const isSortActive = common_vendor.computed(() => {
      return Object.keys(selectedSort.value).length > 0 && selectedSort.value.key !== "distance";
    });
    const sortName = common_vendor.computed(() => {
      if (!isSortActive.value)
        return null;
      return selectedSort.value.title;
    });
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
    const resetFilter = () => {
      pageQuery.pageNo = 1;
      houseList.value = [];
      isFinished = false;
      loading.value = true;
    };
    const onFilterConfirm = async (selected_sort) => {
      resetFilter();
      switch (filterType.value) {
        case constants_home.filterTypeMap.region:
          selectedRegion.value = filterByRegionRef.value.selectedRegion;
          break;
        case constants_home.filterTypeMap.price:
          selectedRentRangeList.value = filterByPriceRef.value.selectedRentRangeList;
          break;
        case constants_home.filterTypeMap.houseType:
          selectedRentTypeList.value = filterByHouseTypeRef.value.selectedRentTypeList;
          selectedRoomNumList.value = filterByHouseTypeRef.value.selectedRoomNumList;
          break;
        case constants_home.filterTypeMap.sort:
          selectedSort.value = selected_sort;
          break;
      }
      getHouseList();
      onClose();
    };
    const pageQuery = {
      pageNo: 1,
      // 页码
      pageSize: 10
      // 每页条数
    };
    const handleFilterParams = () => {
      const {
        id: cityId,
        longitude,
        latitude
      } = locationStore.location;
      const regionId = selectedRegion.value.id === -1 ? null : selectedRegion.value.id;
      const rentalRanges = selectedRentRangeList.value.length ? selectedRentRangeList.value.map((item) => item.key) : null;
      const rentTypes = selectedRentTypeList.value.length ? selectedRentTypeList.value.map((item) => item.key) : null;
      const rooms = selectedRoomNumList.value.length ? selectedRoomNumList.value.map((item) => item.key) : null;
      const sort = selectedSort.value.key || "distance";
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
    let isFinished = false;
    const getHouseList = async () => {
      if (isFinished) {
        utils_toast.showNoneIconToast("没有更多数据啦");
        return;
      }
      const params = handleFilterParams();
      const resp = await api_home.getHouseListApi(params);
      if (resp.list.length === 0) {
        isFinished = true;
        loading.value = false;
        return;
      }
      houseList.value = [
        ...houseList.value,
        ...resp.list.map((item) => ({
          ...item,
          headImage: item.headImage ? item.headImage.startsWith("http") ? item.headImage : constants_common.OSS_BASE_URL + item.headImage : ""
        }))
      ];
    };
    const onReachBottom = () => {
      pageQuery.pageNo++;
      getHouseList();
    };
    const goToCitySelectPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/city-select/city-select"
      });
    };
    common_vendor.onLoad(() => {
      console.log("首页加载完毕");
      common_vendor.index.$on(constants_common.UniAppEvent.LogoutSuccess, () => {
        console.log("首页收到了用户退出登录成功的消息");
      });
    });
    common_vendor.onShow(async () => {
      if (userStore.token) {
        utils_redDot.setRedDot();
      }
      if (houseList.value.length === 0 && locationStore.location.id !== void 0) {
        getHouseList();
      }
    });
    const goToListPage = (rentType) => {
      common_vendor.index.navigateTo({
        url: "/pages/list/list?rentType=" + rentType
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(locationStore).location.name),
        b: common_vendor.o(goToCitySelectPage),
        c: common_vendor.p({
          name: "xiala-dark",
          size: "24"
        }),
        d: common_vendor.p({
          title: "稚能安居"
        }),
        e: common_vendor.f(common_vendor.unref(constants_home.diamondList), (item, k0, i0) => {
          return {
            a: "647e9730-2-" + i0,
            b: common_vendor.p({
              name: item.iconPath,
              size: "100"
            }),
            c: common_vendor.t(item.title),
            d: item.id,
            e: common_vendor.o(($event) => goToListPage(item.key), item.id)
          };
        }),
        f: common_vendor.f(common_vendor.unref(constants_home.filterTypeList), (item, k0, i0) => {
          return common_vendor.e({
            a: item.type === common_vendor.unref(constants_home.filterTypeMap).region
          }, item.type === common_vendor.unref(constants_home.filterTypeMap).region ? {
            b: common_vendor.t(regionName.value || item.title),
            c: item.isOpen || isRegionActive.value ? 1 : ""
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).price ? {
            e: common_vendor.t(rentRangeName.value || item.title),
            f: item.isOpen || isRentRangeActive.value ? 1 : "",
            g: isRentRangeActive.value ? 1 : ""
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).houseType ? {
            i: common_vendor.t(houseTypeName.value || item.title),
            j: common_vendor.n({
              active: item.isOpen || isHouseTypeActive.value
            }),
            k: common_vendor.n(isSingle.value ? "single" : "multiple")
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).sort ? {
            m: common_vendor.t(sortName.value || item.title),
            n: item.isOpen || isSortActive.value ? 1 : "",
            o: isSortActive.value ? 1 : ""
          } : {}, {
            d: item.type === common_vendor.unref(constants_home.filterTypeMap).price,
            h: item.type === common_vendor.unref(constants_home.filterTypeMap).houseType,
            l: item.type === common_vendor.unref(constants_home.filterTypeMap).sort,
            p: "647e9730-3-" + i0,
            q: common_vendor.p({
              name: item.isOpen ? "zhankai" : "xiala-light",
              size: "24"
            }),
            r: item.id,
            s: common_vendor.o(($event) => onFilterClick(item), item.id)
          });
        }),
        g: isFixedTop.value ? 1 : "",
        h: houseList.value.length > 0
      }, houseList.value.length > 0 ? {
        i: common_vendor.f(houseList.value, (item, k0, i0) => {
          return {
            a: item.houseId,
            b: "647e9730-4-" + i0,
            c: common_vendor.p({
              item
            })
          };
        }),
        j: isFixedTop.value ? 1 : ""
      } : !loading.value ? {} : {}, {
        k: !loading.value,
        l: scrollIntoView.value,
        m: common_vendor.o(onScroll),
        n: isFixedTop.value ? 1 : "",
        o: common_vendor.o(onReachBottom),
        p: filterType.value === common_vendor.unref(constants_home.filterTypeMap).region
      }, filterType.value === common_vendor.unref(constants_home.filterTypeMap).region ? {
        q: common_vendor.sr(filterByRegionRef, "647e9730-7,647e9730-6", {
          "k": "filterByRegionRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).price ? {
        s: common_vendor.sr(filterByPriceRef, "647e9730-8,647e9730-6", {
          "k": "filterByPriceRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).houseType ? {
        v: common_vendor.sr(filterByHouseTypeRef, "647e9730-9,647e9730-6", {
          "k": "filterByHouseTypeRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).sort ? {
        x: common_vendor.o(onFilterConfirm)
      } : {}, {
        r: filterType.value === common_vendor.unref(constants_home.filterTypeMap).price,
        t: filterType.value === common_vendor.unref(constants_home.filterTypeMap).houseType,
        w: filterType.value === common_vendor.unref(constants_home.filterTypeMap).sort,
        y: common_vendor.o(onClose),
        z: common_vendor.o(onFilterConfirm),
        A: common_vendor.o(($event) => visible.value = $event),
        B: common_vendor.p({
          showConfirmButton: filterType.value !== common_vendor.unref(constants_home.filterTypeMap).sort,
          modelValue: visible.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
