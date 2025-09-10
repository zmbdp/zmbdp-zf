"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "bit-popup",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    // 控制是否显示确定按钮
    showConfirmButton: {
      type: Boolean,
      default: true
    }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ common_vendor.mergeModels(["close", "confirm"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const model = common_vendor.useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const onClose = () => {
      model.value = false;
      emit("close");
    };
    const onConfirm = () => {
      emit("confirm");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onClose),
        b: props.showConfirmButton
      }, props.showConfirmButton ? {
        c: common_vendor.o(onConfirm)
      } : {}, {
        d: props.showConfirmButton ? "110rpx" : "0",
        e: model.value
      });
    };
  }
};
wx.createComponent(_sfc_main);
