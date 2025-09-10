"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
const utils_websocket = require("./utils/websocket.js");
const utils_redDot = require("./utils/redDot.js");
const constants_common = require("./constants/common.js");
const stores_modules_location = require("./stores/modules/location.js");
const stores_modules_chat = require("./stores/modules/chat.js");
const stores_modules_user = require("./stores/modules/user.js");
const stores_modules_session = require("./stores/modules/session.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/mine/mine.js";
  "./pages/login/login.js";
  "./pages/edit/edit.js";
  "./pages/city-select/city-select.js";
  "./pages/detail/detail.js";
  "./pages/chat/chat.js";
  "./pages/list/list.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const locationStore = stores_modules_location.useLocationStore();
    const chatStore = stores_modules_chat.useChatStore();
    const userStore = stores_modules_user.useUserStore();
    const sessionStore = stores_modules_session.useSessionStore();
    common_vendor.onLaunch(async () => {
      try {
        console.log("App Launch");
        common_vendor.index.setInnerAudioOption({
          obeyMuteSwitch: false,
          fail: () => {
          }
        });
        await locationStore.getLocationAction();
        chatStore.initRecorder();
        common_vendor.index.$on(constants_common.UniAppEvent.LoginSuccess, () => {
          console.log(
            "App中监听到了登录成功, 需要更新会话列表，并且设置红点"
          );
          common_vendor.index.$on(constants_common.UniAppEvent.ReceiveMsg, updateSessionList);
        });
      } catch (e) {
      }
    });
    function updateSessionList(message) {
      sessionStore.updateSessionList(
        constants_common.updateSessionTime.receiveMsg,
        message
      );
      utils_redDot.setRedDot();
    }
    common_vendor.onShow(async () => {
      try {
        if (userStore.token) {
          await sessionStore.getSessionListAction();
          utils_redDot.setRedDot();
          common_vendor.index.$on(constants_common.UniAppEvent.ReceiveMsg, updateSessionList);
        }
      } catch (e) {
      }
      console.log("App Show");
      utils_websocket.socket.initSocketConnect();
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
      common_vendor.index.$off(constants_common.UniAppEvent.ReceiveMsg, updateSessionList);
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(stores_index.pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
