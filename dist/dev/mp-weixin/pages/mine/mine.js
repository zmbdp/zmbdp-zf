"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  _easycom_bit_icon2();
}
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
if (!Math) {
  _easycom_bit_icon();
}
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const goToLoginPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const onLogout = () => {
      common_vendor.index.showModal({
        title: "温馨提示",
        content: "确定退出么?",
        success: async (res) => {
          if (res.confirm) {
            await userStore.logoutAction();
          }
        }
      });
    };
    const goToEditPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/edit/edit"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).token
      }, common_vendor.unref(userStore).token ? {
        b: common_vendor.unref(userStore).userInfo.avatar,
        c: common_vendor.t(common_vendor.unref(userStore).userInfo.nickName)
      } : {
        d: common_vendor.p({
          name: "morentouxiang",
          size: "118"
        }),
        e: common_vendor.o(goToLoginPage)
      }, {
        f: common_vendor.unref(userStore).token
      }, common_vendor.unref(userStore).token ? {
        g: common_vendor.p({
          name: "fanhui-right",
          size: "26"
        }),
        h: common_vendor.o(goToEditPage)
      } : {}, {
        i: common_vendor.unref(userStore).token
      }, common_vendor.unref(userStore).token ? {
        j: common_vendor.o(onLogout)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
