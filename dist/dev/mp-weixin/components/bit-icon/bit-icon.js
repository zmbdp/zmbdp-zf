"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "bit-icon",
  props: {
    // 图标名称
    name: {
      type: String,
      required: true
    },
    // 图标尺寸
    size: [String, Number],
    // 图标宽度
    width: [String, Number],
    // 图标高度
    height: [String, Number],
    // 是否是圆形
    round: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const iconUrl = common_vendor.computed(() => {
      return props.name.startsWith("http") ? props.name : `/static/icons/${props.name}.png`;
    });
    const iconStyle = common_vendor.computed(() => {
      return {
        width: (props.size || props.width) + "rpx",
        height: (props.size || props.height) + "rpx",
        borderRadius: props.round ? "50%" : "none"
      };
    });
    return (_ctx, _cache) => {
      return {
        a: iconUrl.value,
        b: common_vendor.s(iconStyle.value),
        c: common_vendor.o(($event) => emit("click", $event))
      };
    };
  }
};
wx.createComponent(_sfc_main);
