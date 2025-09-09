"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      name: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/quesheng.png",
      width: "588",
      height: "504"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
