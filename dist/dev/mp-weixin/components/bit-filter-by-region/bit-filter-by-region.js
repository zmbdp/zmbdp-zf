"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const stores_modules_filter = require("../../stores/modules/filter.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "bit-filter-by-region",
  setup(__props, { expose: __expose }) {
    const filterStore = stores_modules_filter.useFilterStore();
    const currentIndex = common_vendor.ref(0);
    const selectedRegion = common_vendor.ref(null);
    const onRegionClick = (i) => {
      if (currentIndex.value === i)
        return;
      currentIndex.value = i;
      selectedRegion.value = filterStore.filterInfo.regionList[i];
    };
    __expose({
      selectedRegion
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(filterStore).filterInfo.regionList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: currentIndex.value === index ? 1 : "",
            c: currentIndex.value === index
          }, currentIndex.value === index ? {
            d: "12444ce0-0-" + i0,
            e: common_vendor.p({
              name: "queding",
              size: "40"
            })
          } : {}, {
            f: item.id,
            g: common_vendor.o(($event) => onRegionClick(index), item.id)
          });
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
