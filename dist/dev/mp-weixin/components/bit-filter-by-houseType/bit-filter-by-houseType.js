"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const stores_modules_filter = require("../../stores/modules/filter.js");
const _sfc_main = {
  __name: "bit-filter-by-houseType",
  setup(__props, { expose: __expose }) {
    const filterStore = stores_modules_filter.useFilterStore();
    const onRentTypeClick = (item) => {
      if (item.key === null) {
        filterStore.filterInfo.rentTypeList.forEach((rentType) => {
          if (rentType.selected) {
            rentType.selected = false;
          }
        });
        item.selected = true;
      } else {
        item.selected = !item.selected;
        filterStore.filterInfo.rentTypeList[0].selected = !filterStore.filterInfo.rentTypeList.slice(1).some((rentType) => rentType.selected);
      }
    };
    const onRoomNumClick = (item) => {
      if (item.key === null) {
        filterStore.filterInfo.roomNumList.forEach((roomNum) => {
          if (roomNum.selected) {
            roomNum.selected = false;
          }
        });
        item.selected = true;
      } else {
        item.selected = !item.selected;
        filterStore.filterInfo.roomNumList[0].selected = !filterStore.filterInfo.roomNumList.slice(1).some((roomNum) => roomNum.selected);
      }
    };
    const selectedRentTypeList = common_vendor.computed(() => {
      return filterStore.filterInfo.rentTypeList.slice(1).filter((item) => item.selected);
    });
    const selectedRoomNumList = common_vendor.computed(() => {
      return filterStore.filterInfo.roomNumList.slice(1).filter((item) => item.selected);
    });
    __expose({
      selectedRentTypeList,
      selectedRoomNumList
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(filterStore).filterInfo.rentTypeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.selected ? 1 : "",
            c: item.id,
            d: common_vendor.o(($event) => onRentTypeClick(item), item.id)
          };
        }),
        b: common_vendor.f(common_vendor.unref(filterStore).filterInfo.roomNumList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.selected ? 1 : "",
            c: item.id,
            d: common_vendor.o(($event) => onRoomNumClick(item), item.id)
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
