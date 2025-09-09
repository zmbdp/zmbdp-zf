"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const constants_common = require("../../constants/common.js");
const utils_redDot = require("../../utils/redDot.js");
const utils_websocket = require("../../utils/websocket.js");
const stores_modules_session = require("../../stores/modules/session.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_quesheng2 = common_vendor.resolveComponent("bit-quesheng");
  (_easycom_bit_nav_bar2 + _easycom_bit_quesheng2)();
}
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_quesheng = () => "../../components/bit-quesheng/bit-quesheng.js";
if (!Math) {
  (_easycom_bit_nav_bar + _easycom_bit_quesheng + SessionItem)();
}
const SessionItem = () => "./components/session-item.js";
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const sessionStore = stores_modules_session.useSessionStore();
    const userStore = stores_modules_user.useUserStore();
    const goToLoginPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login?redirectUrl=pages/message/message"
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.$on(constants_common.UniAppEvent.ExitChatPage, (message) => {
        sessionStore.updateSessionList(
          constants_common.updateSessionTime.exitChatPage,
          message
        );
        utils_redDot.setRedDot();
      });
    });
    common_vendor.onUnload(() => {
      utils_websocket.socket.close();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "消息",
          showLeft: false
        }),
        b: !common_vendor.unref(userStore).token
      }, !common_vendor.unref(userStore).token ? {
        c: common_vendor.o(goToLoginPage)
      } : common_vendor.unref(sessionStore).sessionList.length === 0 ? {} : {
        e: common_vendor.f(common_vendor.unref(sessionStore).sessionList, (session, index, i0) => {
          return {
            a: session.sessionId,
            b: "44352d5a-2-" + i0,
            c: common_vendor.p({
              session,
              last: index === common_vendor.unref(sessionStore).sessionList.length - 1
            })
          };
        })
      }, {
        d: common_vendor.unref(sessionStore).sessionList.length === 0
      });
    };
  }
};
wx.createPage(_sfc_main);
