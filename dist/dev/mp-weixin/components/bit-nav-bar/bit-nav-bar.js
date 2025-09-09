"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "bit-nav-bar",
  props: {
    // 标题
    title: {
      type: String,
      default: "稚能安居"
    },
    // 背景色(纯色)
    bgColor: {
      type: String,
      default: "#fff"
    },
    // 渐变的方向（从上往下，从左往右等）
    direction: String,
    // 渐变起始色
    bgStartColor: String,
    // 渐变结束色
    bgEndColor: String,
    // 是否展示左侧内容
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const props = __props;
    const navbarStyle = common_vendor.computed(() => {
      return {
        background: props.direction ? `linear-gradient(to ${props.direction}, ${props.bgStartColor}, ${props.bgEndColor})` : props.bgColor
      };
    });
    const onBack = () => {
      const pages = getCurrentPages();
      if (pages.length >= 2) {
        common_vendor.index.navigateBack();
      } else {
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }, 500);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.showLeft
      }, props.showLeft ? {
        b: common_vendor.o(onBack),
        c: common_vendor.p({
          name: "fanhui-left",
          size: "32"
        })
      } : {}, {
        d: common_vendor.t(props.title),
        e: common_vendor.s(navbarStyle.value)
      });
    };
  }
};
wx.createComponent(_sfc_main);
