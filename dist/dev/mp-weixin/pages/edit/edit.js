"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_file = require("../../utils/file.js");
require("../../stores/index.js");
const api_user = require("../../api/user.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  (_easycom_bit_nav_bar2 + _easycom_bit_icon2)();
}
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
if (!Math) {
  (_easycom_bit_nav_bar + _easycom_bit_icon)();
}
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const tempAvatar = common_vendor.ref(userStore.userInfo.avatar);
    const tempNickName = common_vendor.ref(userStore.userInfo.nickName);
    const onSelectAvatar = async () => {
      const tempFilePath = await utils_file.chooseFile({
        count: 1,
        mediaType: ["image"]
      });
      if (!tempFilePath)
        return;
      try {
        tempAvatar.value = await utils_file.uploadFile2OSS(tempFilePath);
      } catch (e) {
      }
    };
    const onSubmit = async () => {
      const params = {};
      if (tempAvatar.value !== userStore.userInfo.avatar) {
        params.avatar = tempAvatar.value;
      }
      if (tempNickName.value && tempNickName.value !== userStore.userInfo.nickName) {
        params.nickName = tempNickName.value;
      }
      console.log("修改后的用户信息", params);
      if (Object.keys(params).length > 0) {
        try {
          await api_user.putUserInfoApi({
            ...params,
            userId: userStore.userInfo.userId
          });
          userStore.setUserInfoAction(params);
        } catch (e) {
        }
      }
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "编辑资料"
        }),
        b: tempAvatar.value,
        c: common_vendor.p({
          name: "fanhui-right",
          size: "26"
        }),
        d: common_vendor.o(onSelectAvatar),
        e: tempNickName.value,
        f: common_vendor.o(common_vendor.m(($event) => tempNickName.value = $event.detail.value, {
          trim: true
        })),
        g: common_vendor.p({
          name: "fanhui-right",
          size: "26"
        }),
        h: common_vendor.o(onSubmit)
      };
    };
  }
};
wx.createPage(_sfc_main);
