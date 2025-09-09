"use strict";
const common_vendor = require("../../../common/vendor.js");
const constants_chat = require("../../../constants/chat.js");
const utils_file = require("../../../utils/file.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../../../components/bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "chat-extension",
  emits: ["success"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const selectOrTakePhoto = async (sourceType) => {
      try {
        const tempFilePath = await utils_file.chooseFile({
          count: 1,
          mediaType: ["image"],
          sourceType: [sourceType]
        });
        if (!tempFilePath)
          return;
        const url = await utils_file.uploadFile2OSS(tempFilePath);
        emit("success", url);
      } catch (e) {
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(constants_chat.extensionList), (extension, k0, i0) => {
          return {
            a: "14ba63be-0-" + i0,
            b: common_vendor.p({
              size: "140",
              name: extension.iconName
            }),
            c: common_vendor.t(extension.name),
            d: extension.id,
            e: common_vendor.o(($event) => selectOrTakePhoto(extension.key), extension.id)
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
