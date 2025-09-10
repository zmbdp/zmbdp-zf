"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_home = require("../../constants/home.js");
const constants_common = require("../../constants/common.js");
require("../../stores/index.js");
const api_home = require("../../api/home.js");
const utils_toast = require("../../utils/toast.js");
const utils_system = require("../../utils/system.js");
const stores_modules_location = require("../../stores/modules/location.js");
const stores_modules_filter = require("../../stores/modules/filter.js");
if (!Array) {
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  const _easycom_bit_house_item2 = common_vendor.resolveComponent("bit-house-item");
  const _easycom_bit_quesheng2 = common_vendor.resolveComponent("bit-quesheng");
  const _easycom_bit_filter_by_region2 = common_vendor.resolveComponent("bit-filter-by-region");
  const _easycom_bit_filter_by_price2 = common_vendor.resolveComponent("bit-filter-by-price");
  const _easycom_bit_filter_by_houseType2 = common_vendor.resolveComponent("bit-filter-by-houseType");
  const _easycom_bit_filter_by_sort2 = common_vendor.resolveComponent("bit-filter-by-sort");
  const _easycom_bit_popup2 = common_vendor.resolveComponent("bit-popup");
  (_easycom_bit_nav_bar2 + _easycom_bit_icon2 + _easycom_bit_house_item2 + _easycom_bit_quesheng2 + _easycom_bit_filter_by_region2 + _easycom_bit_filter_by_price2 + _easycom_bit_filter_by_houseType2 + _easycom_bit_filter_by_sort2 + _easycom_bit_popup2)();
}
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
const _easycom_bit_house_item = () => "../../components/bit-house-item/bit-house-item.js";
const _easycom_bit_quesheng = () => "../../components/bit-quesheng/bit-quesheng.js";
const _easycom_bit_filter_by_region = () => "../../components/bit-filter-by-region/bit-filter-by-region.js";
const _easycom_bit_filter_by_price = () => "../../components/bit-filter-by-price/bit-filter-by-price.js";
const _easycom_bit_filter_by_houseType = () => "../../components/bit-filter-by-houseType/bit-filter-by-houseType.js";
const _easycom_bit_filter_by_sort = () => "../../components/bit-filter-by-sort/bit-filter-by-sort.js";
const _easycom_bit_popup = () => "../../components/bit-popup/bit-popup.js";
if (!Math) {
  (_easycom_bit_nav_bar + _easycom_bit_icon + _easycom_bit_house_item + _easycom_bit_quesheng + _easycom_bit_filter_by_region + _easycom_bit_filter_by_price + _easycom_bit_filter_by_houseType + _easycom_bit_filter_by_sort + _easycom_bit_popup)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const locationStore = stores_modules_location.useLocationStore();
    const filterStore = stores_modules_filter.useFilterStore();
    const bottomDis = utils_system.safeBottomDistance();
    const visible = common_vendor.ref(false);
    const filterType = common_vendor.ref(null);
    const open = (item) => {
      visible.value = true;
      filterType.value = item.type;
      constants_home.filterTypeList.value.forEach((filter) => {
        if (filter.isOpen) {
          filter.isOpen = false;
        }
      });
      item.isOpen = true;
    };
    const close = () => {
      visible.value = false;
      constants_home.filterTypeList.value.forEach((filter) => {
        if (filter.isOpen) {
          filter.isOpen = false;
        }
      });
    };
    const filterByRegionRef = common_vendor.ref(null);
    const filterByPriceRef = common_vendor.ref(null);
    const filterByHouseTypeRef = common_vendor.ref(null);
    const selectedRegion = common_vendor.ref({});
    const selectedRentRangeList = common_vendor.ref([]);
    const selectedRentTypeList = common_vendor.ref([]);
    const selectedRoomNumList = common_vendor.ref([]);
    const selectedSort = common_vendor.ref({});
    const isRegionActive = common_vendor.computed(() => {
      return Object.keys(selectedRegion.value).length > 0 && selectedRegion.value.id !== -1;
    });
    const regionName = common_vendor.computed(() => {
      if (!isRegionActive.value)
        return null;
      return selectedRegion.value.name.slice(0, -1);
    });
    const isPriceActive = common_vendor.computed(() => {
      return selectedRentRangeList.value.length > 0;
    });
    const priceName = common_vendor.computed(() => {
      if (!isPriceActive.value)
        return null;
      return selectedRentRangeList.value.map((item) => item.name).join(",");
    });
    const isHouseTypeActive = common_vendor.computed(() => {
      return selectedRentTypeList.value.length > 0 || selectedRoomNumList.value.length > 0;
    });
    const isSingle = common_vendor.computed(() => {
      if (!isHouseTypeActive.value)
        return true;
      if (selectedRentTypeList.value.length > 0 && selectedRoomNumList.value.length > 0)
        return false;
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
    common_vendor.onLoad((query2) => {
      const rentTypeItem = filterStore.setRentTypeActive(query2.rentType);
      selectedRentTypeList.value = [rentTypeItem];
      getHouseList();
    });
    common_vendor.onUnload(() => {
      filterStore.resetFilterInfo();
    });
    const query = {
      pageNo: 1,
      pageSize: 10
    };
    const resetFilter = () => {
      query.pageNo = 1;
      isFinished = false;
      loading.value = true;
      houseList.value = [];
    };
    const reachBottom = () => {
      query.pageNo++;
      getHouseList();
    };
    const filterConfirm = (selected_sort) => {
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
      close();
    };
    const houseList = common_vendor.ref([]);
    let isFinished = false;
    const loading = common_vendor.ref(true);
    const getHouseList = async () => {
      if (isFinished) {
        utils_toast.showNoneIconToast("没有更多数据啦");
        return;
      }
      try {
        const params = handleFilterParams();
        const resp = await api_home.getHouseListApi(params);
        if (resp.list.length < query.pageSize) {
          isFinished = true;
        }
        houseList.value = [
          ...houseList.value,
          ...resp.list.map((item) => ({
            ...item,
            headImage: constants_common.OSS_BASE_URL + item.headImage
          }))
        ];
        loading.value = false;
      } catch (e) {
        console.log(e);
      }
    };
    const handleFilterParams = () => {
      const { id, longitude, latitude } = locationStore.location;
      const regionId = selectedRegion.value.id === -1 ? null : selectedRegion.value.id;
      const rentalRanges = selectedRentRangeList.value.length > 0 ? selectedRentRangeList.value.map((item) => item.key) : null;
      const rentTypes = selectedRentTypeList.value.length > 0 ? selectedRentTypeList.value.map((item) => item.key) : null;
      const rooms = selectedRoomNumList.value.length > 0 ? selectedRoomNumList.value.map((item) => item.key) : null;
      const sort = selectedSort.value.key || "distance";
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
      };
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "房源列表"
        }),
        b: common_vendor.f(common_vendor.unref(constants_home.filterTypeList), (item, k0, i0) => {
          return common_vendor.e({
            a: item.type === common_vendor.unref(constants_home.filterTypeMap).region
          }, item.type === common_vendor.unref(constants_home.filterTypeMap).region ? {
            b: common_vendor.t(regionName.value || item.title),
            c: item.isOpen || isRegionActive.value ? 1 : "",
            d: isRegionActive.value ? 1 : ""
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).price ? {
            f: common_vendor.t(priceName.value || item.title),
            g: item.isOpen || isPriceActive.value ? 1 : "",
            h: isPriceActive.value ? 1 : ""
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).houseType ? {
            j: common_vendor.t(houseTypeName.value || item.title),
            k: common_vendor.n({
              active: item.isOpen || isHouseTypeActive.value
            }),
            l: common_vendor.n(isSingle.value ? "single" : "multiple")
          } : item.type === common_vendor.unref(constants_home.filterTypeMap).sort ? {
            n: common_vendor.t(sortName.value || item.title),
            o: item.isOpen || isSortActive.value ? 1 : "",
            p: isSortActive.value ? 1 : ""
          } : {}, {
            e: item.type === common_vendor.unref(constants_home.filterTypeMap).price,
            i: item.type === common_vendor.unref(constants_home.filterTypeMap).houseType,
            m: item.type === common_vendor.unref(constants_home.filterTypeMap).sort,
            q: "31fc3dec-1-" + i0,
            r: common_vendor.p({
              name: item.isOpen ? "zhankai" : "xiala-light",
              size: "24"
            }),
            s: item.id,
            t: common_vendor.o(($event) => open(item), item.id)
          });
        }),
        c: houseList.value.length > 0
      }, houseList.value.length > 0 ? {
        d: common_vendor.f(houseList.value, (item, k0, i0) => {
          return {
            a: item.houseId,
            b: "31fc3dec-2-" + i0,
            c: common_vendor.p({
              item
            })
          };
        })
      } : !loading.value ? {} : {}, {
        e: !loading.value,
        f: common_vendor.unref(bottomDis) + "px",
        g: common_vendor.o(reachBottom),
        h: filterType.value === common_vendor.unref(constants_home.filterTypeMap).region
      }, filterType.value === common_vendor.unref(constants_home.filterTypeMap).region ? {
        i: common_vendor.sr(filterByRegionRef, "31fc3dec-5,31fc3dec-4", {
          "k": "filterByRegionRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).price ? {
        k: common_vendor.sr(filterByPriceRef, "31fc3dec-6,31fc3dec-4", {
          "k": "filterByPriceRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).houseType ? {
        m: common_vendor.sr(filterByHouseTypeRef, "31fc3dec-7,31fc3dec-4", {
          "k": "filterByHouseTypeRef"
        })
      } : filterType.value === common_vendor.unref(constants_home.filterTypeMap).sort ? {
        o: common_vendor.o(filterConfirm)
      } : {}, {
        j: filterType.value === common_vendor.unref(constants_home.filterTypeMap).price,
        l: filterType.value === common_vendor.unref(constants_home.filterTypeMap).houseType,
        n: filterType.value === common_vendor.unref(constants_home.filterTypeMap).sort,
        p: common_vendor.o(close),
        q: common_vendor.o(filterConfirm),
        r: common_vendor.o(($event) => visible.value = $event),
        s: common_vendor.p({
          showConfirmButton: filterType.value !== common_vendor.unref(constants_home.filterTypeMap).sort,
          modelValue: visible.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
