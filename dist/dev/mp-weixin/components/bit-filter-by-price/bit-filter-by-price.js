"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const stores_modules_filter = require("../../stores/modules/filter.js");
const _sfc_main = {
  __name: "bit-filter-by-price",
  setup(__props, { expose: __expose }) {
    const filterStore = stores_modules_filter.useFilterStore();
    const onPriceClick = (item) => {
      if (item.key === null) {
        filterStore.filterInfo.rentRangeList.forEach((rentRange) => {
          if (rentRange.selected) {
            rentRange.selected = false;
          }
        });
        item.selected = true;
      } else {
        item.selected = !item.selected;
        filterStore.filterInfo.rentRangeList[0].selected = filterStore.filterInfo.rentRangeList.filter((rentRange) => rentRange.key !== null).every((rentRange) => !rentRange.selected);
      }
    };
    const selectedRentRangeList = common_vendor.computed(() => {
      return filterStore.filterInfo.rentRangeList.filter(
        (item) => item.key !== null && item.selected
      );
    });
    __expose({
      selectedRentRangeList
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(filterStore).filterInfo.rentRangeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.selected ? 1 : "",
            c: item.id,
            d: common_vendor.o(($event) => onPriceClick(item), item.id)
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
