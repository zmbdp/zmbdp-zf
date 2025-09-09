"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "bit-house-item",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const goToHouseDetailPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?houseId=" + props.item.houseId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: props.item.headImage,
        b: common_vendor.t(props.item.title),
        c: common_vendor.t(props.item.area),
        d: common_vendor.t(props.item.position),
        e: common_vendor.t(props.item.regionName),
        f: common_vendor.t(props.item.price),
        g: common_vendor.o(goToHouseDetailPage)
      };
    };
  }
};
wx.createComponent(_sfc_main);
