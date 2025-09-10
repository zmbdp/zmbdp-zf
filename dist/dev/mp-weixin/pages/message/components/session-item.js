"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_time = require("../../../utils/time.js");
const constants_session = require("../../../constants/session.js");
const constants_chat = require("../../../constants/chat.js");
require("../../../stores/index.js");
const stores_modules_chat = require("../../../stores/modules/chat.js");
const stores_modules_session = require("../../../stores/modules/session.js");
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  (_easycom_bit_icon2 + _easycom_uni_badge2)();
}
const _easycom_bit_icon = () => "../../../components/bit-icon/bit-icon.js";
const _easycom_uni_badge = () => "../../../node-modules/@dcloudio/uni-ui/lib/uni-badge/uni-badge.js";
if (!Math) {
  (_easycom_bit_icon + _easycom_uni_badge)();
}
const _sfc_main = {
  __name: "session-item",
  props: {
    // 会话对象
    session: {
      type: Object,
      default: () => ({})
    },
    // 是否是最后一个 session-item 组件
    last: Boolean
  },
  setup(__props) {
    const chatStore = stores_modules_chat.useChatStore();
    const sessionStore = stores_modules_session.useSessionStore();
    const props = __props;
    const goToChatPage = async () => {
      try {
        await sessionStore.getSessionListAction();
        const { sessionId, lastMessageVO, otherUser } = props.session;
        const tempOtherUser = {
          ...otherUser,
          // 追加 id 属性
          id: otherUser.userId
        };
        delete tempOtherUser.userId;
        chatStore.setFangDong(tempOtherUser);
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?sessionId=${sessionId}&lastMessageId=${lastMessageVO.messageId}`
        });
      } catch (e) {
        console.log(e);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.session.sessionId
      }, props.session.sessionId ? common_vendor.e({
        b: common_vendor.p({
          name: props.session.otherUser.avatar,
          size: "80",
          round: true
        }),
        c: common_vendor.p({
          text: props.session.notVisitedCount,
          size: "normal",
          absolute: "rightTop"
        }),
        d: common_vendor.t(props.session.otherUser.nickName),
        e: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.session.lastSessionTime, "MM/DD")),
        f: props.session.lastMessageVO.type === common_vendor.unref(constants_chat.msgType).text
      }, props.session.lastMessageVO.type === common_vendor.unref(constants_chat.msgType).text ? {
        g: common_vendor.t(props.session.lastMessageVO.content)
      } : {
        h: common_vendor.t(common_vendor.unref(constants_session.msgSimplify)[props.session.lastMessageVO.type])
      }, {
        i: props.session.lastMessageVO.type === common_vendor.unref(constants_chat.msgType).voice
      }, props.session.lastMessageVO.type === common_vendor.unref(constants_chat.msgType).voice ? {
        j: common_vendor.t(props.session.lastMessageVO.content.duration)
      } : {}, {
        k: props.session.notVisitedCount > 0 ? 1 : "",
        l: props.last ? "transparent" : "auto",
        m: common_vendor.o(goToChatPage)
      }) : {});
    };
  }
};
wx.createComponent(_sfc_main);
