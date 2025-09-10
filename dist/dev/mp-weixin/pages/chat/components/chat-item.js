"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../stores/index.js");
const constants_chat = require("../../../constants/chat.js");
const utils_time = require("../../../utils/time.js");
const constants_common = require("../../../constants/common.js");
const stores_modules_chat = require("../../../stores/modules/chat.js");
const stores_modules_user = require("../../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_house_item2 = common_vendor.resolveComponent("bit-house-item");
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  (_easycom_bit_house_item2 + _easycom_bit_icon2)();
}
const _easycom_bit_house_item = () => "../../../components/bit-house-item/bit-house-item.js";
const _easycom_bit_icon = () => "../../../components/bit-icon/bit-icon.js";
if (!Math) {
  (_easycom_bit_house_item + _easycom_bit_icon)();
}
const maxLabelWidth = 660;
const minLabelWidth = 110;
const _sfc_main = {
  __name: "chat-item",
  props: {
    // 单条消息
    msg: {
      type: Object,
      default: () => ({})
    },
    // 消息的下标
    index: Number
  },
  emits: ["play"],
  setup(__props, { emit: __emit }) {
    const chatStore = stores_modules_chat.useChatStore();
    const userStore = stores_modules_user.useUserStore();
    const props = __props;
    const emit = __emit;
    const isSelf = common_vendor.computed(() => {
      return props.msg.fromId === userStore.userInfo.userId;
    });
    const labelWidth = common_vendor.computed(() => {
      const width = maxLabelWidth * props.msg.content.duration / constants_chat.maxVoiceDuration;
      return width < minLabelWidth ? minLabelWidth : width;
    });
    let innerAudioContext = null;
    const playVoice = () => {
      if (!innerAudioContext) {
        innerAudioContext = common_vendor.index.createInnerAudioContext();
        innerAudioContext.src = props.msg.content.audioPath;
        innerAudioContext.play();
      } else {
        innerAudioContext.stop();
        innerAudioContext.play();
      }
      common_vendor.index.$emit(constants_common.UniAppEvent.PlayVoice, props.index);
      if (props.msg.status === constants_chat.voiceMsgStatus.unPlay) {
        props.msg.status = constants_chat.voiceMsgStatus.played;
        emit("play", props.msg.messageId);
      }
    };
    common_vendor.onMounted(() => {
      if (props.msg.type === constants_chat.msgType.voice) {
        common_vendor.index.$on(constants_common.UniAppEvent.PlayVoice, (i) => {
          if (
            // 排除自己（不能让自己停止播放）
            props.index !== i && // 有 innerAudioContext 对象
            innerAudioContext && // 其他语音在播放
            innerAudioContext.paused
          ) {
            innerAudioContext.stop();
          }
        });
      }
    });
    common_vendor.onUnmounted(() => {
      if (props.msg.type === constants_chat.msgType.voice) {
        innerAudioContext == null ? void 0 : innerAudioContext.destroy();
        innerAudioContext = null;
      }
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: props.msg.type === common_vendor.unref(constants_chat.msgType).card
      }, props.msg.type === common_vendor.unref(constants_chat.msgType).card ? common_vendor.e({
        b: isSelf.value
      }, isSelf.value ? {
        c: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        d: common_vendor.p({
          item: props.msg.content
        }),
        e: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(userStore).userInfo.avatar
        })
      } : {
        f: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        g: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(chatStore).fangDong.avatar
        }),
        h: common_vendor.p({
          item: props.msg.content
        })
      }) : props.msg.type === common_vendor.unref(constants_chat.msgType).text ? common_vendor.e({
        j: isSelf.value
      }, isSelf.value ? {
        k: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        l: common_vendor.t(props.msg.content),
        m: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(userStore).userInfo.avatar
        })
      } : {
        n: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        o: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(chatStore).fangDong.avatar
        }),
        p: common_vendor.t(props.msg.content)
      }) : props.msg.type === common_vendor.unref(constants_chat.msgType).voice ? common_vendor.e({
        r: isSelf.value
      }, isSelf.value ? {
        s: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        t: common_vendor.t((_a = props.msg.content) == null ? void 0 : _a.duration),
        v: common_vendor.p({
          name: "voice",
          size: "32"
        }),
        w: labelWidth.value + "rpx",
        x: common_vendor.o(playVoice),
        y: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(userStore).userInfo.avatar
        })
      } : common_vendor.e({
        z: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        A: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(chatStore).fangDong.avatar
        }),
        B: common_vendor.p({
          name: "voice",
          size: "32"
        }),
        C: common_vendor.t((_b = props.msg.content) == null ? void 0 : _b.duration),
        D: props.msg.status === common_vendor.unref(constants_chat.voiceMsgStatus).unPlay
      }, props.msg.status === common_vendor.unref(constants_chat.voiceMsgStatus).unPlay ? {} : {}, {
        E: labelWidth.value + "rpx",
        F: common_vendor.o(playVoice)
      })) : props.msg.type === common_vendor.unref(constants_chat.msgType).image ? common_vendor.e({
        H: isSelf.value
      }, isSelf.value ? {
        I: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        J: props.msg.content,
        K: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(userStore).userInfo.avatar
        })
      } : {
        L: common_vendor.t(common_vendor.unref(utils_time.formatTime)(props.msg.createTime)),
        M: common_vendor.p({
          size: "80",
          round: true,
          name: common_vendor.unref(chatStore).fangDong.avatar
        }),
        N: props.msg.content
      }) : {}, {
        i: props.msg.type === common_vendor.unref(constants_chat.msgType).text,
        q: props.msg.type === common_vendor.unref(constants_chat.msgType).voice,
        G: props.msg.type === common_vendor.unref(constants_chat.msgType).image
      });
    };
  }
};
wx.createComponent(_sfc_main);
