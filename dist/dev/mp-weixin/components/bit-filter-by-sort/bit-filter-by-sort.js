"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_home = require("../../constants/home.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "bit-filter-by-sort",
  emits: ["confirm"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const currentIndex = common_vendor.ref(0);
    const onSortClick = (i) => {
      if (i === currentIndex.value)
        return;
      currentIndex.value = i;
      emit("confirm", constants_home.sortPullList[i]);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(constants_home.sortPullList), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: index === currentIndex.value ? 1 : "",
            c: index === currentIndex.value
          }, index === currentIndex.value ? {
            d: "7fa87ba0-0-" + i0,
            e: common_vendor.p({
              name: "queding",
              size: "40"
            })
          } : {}, {
            f: item.key,
            g: common_vendor.o(($event) => onSortClick(index), item.key)
          });
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
