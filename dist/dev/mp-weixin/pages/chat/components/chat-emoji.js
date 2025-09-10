"use strict";
const common_vendor = require("../../../common/vendor.js");
const constants_chat = require("../../../constants/chat.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../../../components/bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "chat-emoji",
  props: {
    // 控制是否选择了表情包
    hasContent: Boolean
  },
  emits: ["select", "del"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectEmoji = (emoji) => {
      emit("select", emoji);
    };
    const delEmoji = () => {
      if (!props.hasContent)
        return;
      emit("del");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(constants_chat.emojiList), (emoji, k0, i0) => {
          return {
            a: common_vendor.t(emoji.remark),
            b: emoji.id,
            c: common_vendor.o(($event) => selectEmoji(emoji), emoji.id)
          };
        }),
        b: common_vendor.o(delEmoji),
        c: common_vendor.p({
          name: `shanchu-${props.hasContent ? "active" : "default"}`,
          width: "96",
          height: "89"
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
