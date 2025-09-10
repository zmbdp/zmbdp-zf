"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_chat = require("../../constants/chat.js");
const utils_system = require("../../utils/system.js");
const constants_common = require("../../constants/common.js");
const utils_auth = require("../../utils/auth.js");
require("../../stores/index.js");
const api_chat = require("../../api/chat.js");
const utils_websocket = require("../../utils/websocket.js");
const utils_file = require("../../utils/file.js");
const api_session = require("../../api/session.js");
const stores_modules_chat = require("../../stores/modules/chat.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  (_easycom_bit_nav_bar2 + _easycom_bit_icon2)();
}
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
if (!Math) {
  (_easycom_bit_nav_bar + ChatItem + _easycom_bit_icon + ChatEmoji + ChatExtension)();
}
const ChatItem = () => "./components/chat-item.js";
const ChatEmoji = () => "./components/chat-emoji.js";
const ChatExtension = () => "./components/chat-extension.js";
const chatBottomId = "chatBottom";
const distance = 80;
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const chatStore = stores_modules_chat.useChatStore();
    const userStore = stores_modules_user.useUserStore();
    let sessionId = null;
    let messageId = null;
    const mode = common_vendor.ref(constants_chat.chatMode.text);
    const isFocus = common_vendor.ref(false);
    const bottomDis = utils_system.safeBottomDistance();
    const actionBottomDis = common_vendor.ref(bottomDis);
    const scrollViewId = common_vendor.ref(null);
    const visible = common_vendor.ref(false);
    const scrollToBottom = () => {
      scrollViewId.value = null;
      setTimeout(() => {
        scrollViewId.value = chatBottomId;
      }, 400);
    };
    common_vendor.index.onKeyboardHeightChange((res) => {
      actionBottomDis.value = res.height || bottomDis;
      if (res.height > 0) {
        scrollToBottom();
      }
    });
    const chatBottomDis = common_vendor.computed(() => {
      return actionBottomDis.value + common_vendor.index.upx2px(120);
    });
    const changeMode = () => {
      mode.value = mode.value !== constants_chat.chatMode.voice ? constants_chat.chatMode.voice : constants_chat.chatMode.text;
      isFocus.value = mode.value === constants_chat.chatMode.text;
      if (visible.value) {
        visible.value = false;
        actionBottomDis.value = bottomDis;
      }
    };
    const msgText = common_vendor.ref("");
    const rightIconClick = (modeValue) => {
      if (modeValue === constants_chat.chatMode.text) {
        isFocus.value = true;
        visible.value = false;
      } else {
        isFocus.value = mode.value === modeValue ? !isFocus.value : false;
        if (isFocus.value) {
          visible.value = false;
        } else {
          visible.value = true;
          actionBottomDis.value = bottomDis + common_vendor.index.upx2px(490);
          scrollToBottom();
        }
      }
      mode.value = modeValue;
    };
    const pageClick = () => {
      if (isFocus.value) {
        isFocus.value = false;
      } else if (visible.value) {
        visible.value = false;
        actionBottomDis.value = bottomDis;
        if (mode.value === constants_chat.chatMode.emoji) {
          mode.value = constants_chat.chatMode.text;
        }
      }
    };
    const selectEmoji = (emoji) => {
      msgText.value += emoji.remark;
    };
    const delEmoji = () => {
      const last = msgText.value.slice(-1);
      const r1 = last.match(constants_common.pattern.num);
      const r2 = last.match(constants_common.pattern.lett);
      const r3 = last.match(constants_common.pattern.chin);
      const r4 = last.match(constants_common.pattern.spec);
      if (r1 !== null || r2 !== null || r3 !== null || r4 !== null) {
        msgText.value = msgText.value.slice(0, -1);
      } else {
        msgText.value = msgText.value.slice(0, -2);
      }
    };
    const selectOrTakeImage = (url) => {
      sendMsg(constants_chat.msgType.image, url);
    };
    const isRecording = common_vendor.ref(false);
    const isCancelRecord = common_vendor.ref(false);
    let startY = null;
    const touchStart = async (e) => {
      try {
        const flag = await utils_auth.isAuthorized(constants_common.authName.record);
        if (!flag) {
          await utils_auth.authorize(constants_common.authName.record);
        } else {
          startY = e.touches[0].pageY;
          isCancelRecord.value = false;
          isRecording.value = true;
          chatStore.recorder.start({
            duration: constants_chat.maxVoiceDuration * 1e3,
            format: "mp3"
          });
        }
      } catch (e2) {
      }
    };
    const touchMove = (e) => {
      isCancelRecord.value = startY - e.touches[0].pageY >= distance;
    };
    const touchEnd = () => {
      chatStore.recorder.stop();
      isRecording.value = false;
    };
    const touchCancel = () => {
      isRecording.value = false;
      isCancelRecord.value = true;
    };
    common_vendor.onLoad(() => {
      chatStore.registerSendVoiceEvent(
        async ({ tempFilePath, duration }) => {
          try {
            if (!isCancelRecord.value) {
              const audioPath = await utils_file.uploadFile2OSS(tempFilePath);
              sendMsg(constants_chat.msgType.voice, {
                audioPath,
                duration
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      );
      common_vendor.index.$on(constants_common.UniAppEvent.RecordAutoEnd, () => {
        isRecording.value = false;
      });
    });
    const chatList = common_vendor.ref([]);
    let isFinished = false;
    async function getHistoryList({
      sessionId: sessionId2,
      lastMessageId,
      count = 10,
      needCurMessage
    }) {
      try {
        if (isFinished)
          return;
        const list = await api_chat.getHistoryListApi({
          sessionId: sessionId2,
          lastMessageId,
          count,
          needCurMessage
        });
        if (list.length < count) {
          isFinished = true;
        }
        if (list.length > 0) {
          messageId = list[0].messageId;
        }
        chatList.value = [
          ...list.map((item) => {
            return [constants_chat.msgType.voice, constants_chat.msgType.card].includes(item.type) ? {
              ...item,
              // JSON.parse(): 反序列化，把json格式字符串转成json
              // JSON.stringify(): 序列化，把json转成json格式字符串
              content: JSON.parse(item.content)
            } : item;
          }),
          ...chatList.value
        ];
      } catch (e) {
        console.log(e);
      }
    }
    const reachTop = () => {
      getHistoryList({
        sessionId,
        lastMessageId: messageId,
        count: 2,
        needCurMessage: false
      });
    };
    common_vendor.onLoad(async (query) => {
      try {
        if (query.sessionId) {
          sessionId = +query.sessionId;
          await getHistoryList({
            sessionId,
            lastMessageId: query.lastMessageId,
            count: 10,
            needCurMessage: true
          });
        } else {
          const sessionInfo = await api_chat.getSessionInfoApi({
            userId1: chatStore.fangDong.id,
            userId2: userStore.userInfo.userId
          });
          if (sessionInfo.sessionId) {
            sessionId = sessionInfo.sessionId;
            chatStore.setFangDong(sessionInfo.otherUser);
            if (sessionInfo.lastMessageVO) {
              await getHistoryList({
                sessionId,
                lastMessageId: sessionInfo.lastMessageVO.messageId,
                count: 10,
                needCurMessage: true
              });
              const flag = await api_chat.getSessionHasHouseApi({
                sessionId,
                houseId: chatStore.house.houseId
              });
              if (!flag) {
                await sendMsg(constants_chat.msgType.card, chatStore.house);
              }
            } else {
              await sendMsg(constants_chat.msgType.card, chatStore.house);
            }
          } else {
            const newSessionInfo = await api_chat.createSessionApi({
              userId1: chatStore.fangDong.id,
              userId2: userStore.userInfo.userId
            });
            sessionId = newSessionInfo.sessionId;
            chatStore.setFangDong(newSessionInfo.otherUser);
            await sendMsg(constants_chat.msgType.card, chatStore.house);
          }
        }
        scrollToBottom();
      } catch (e) {
      }
    });
    const receiveMsg = (message) => {
      if (sessionId === message.sessionId) {
        console.log("收到了对方的消息：", message);
        chatList.value.push(message);
        scrollToBottom();
      }
    };
    const osName = common_vendor.ref("");
    common_vendor.onLoad(async () => {
      osName.value = await utils_system.getOsName();
      common_vendor.index.$on(constants_common.UniAppEvent.ReceiveMsg, receiveMsg);
    });
    const messageIds = [];
    const collectVoiceMsgId = (messageId2) => {
      messageIds.push(messageId2);
    };
    common_vendor.onUnload(async () => {
      try {
        common_vendor.index.$off(constants_common.UniAppEvent.ReceiveMsg, receiveMsg);
        await api_session.putSessionBatchVisitedApi(sessionId);
        if (messageIds.length > 0) {
          await api_session.putMessageBatchReadApi({
            sessionId,
            messageIds
          });
        }
        common_vendor.index.$emit(
          constants_common.UniAppEvent.ExitChatPage,
          chatList.value[chatList.value.length - 1]
        );
      } catch (e) {
        console.log(e);
      }
    });
    const sendMsg = async (type, content) => {
      const message = {
        type,
        sessionId,
        fromId: userStore.userInfo.userId,
        toId: chatStore.fangDong.id,
        createTime: Date.now(),
        visited: constants_chat.msgStatus.unVisited,
        content
      };
      if (type === constants_chat.msgType.voice) {
        message.status = constants_chat.voiceMsgStatus.unPlay;
      }
      try {
        await utils_websocket.socket.send({
          type: constants_chat.websocketMsgType.chat,
          // 如果是卡片消息或语音消息，content 的值是对象，但是发给服务器类型是json格式字符串，
          // 所以需要根据消息类型做判断，把卡片或语音消息的content序列化即可
          // 发送给后端的消息格式是一个 json 格式字符串
          data: JSON.stringify(
            [constants_chat.msgType.voice, constants_chat.msgType.card].includes(type) ? {
              ...message,
              content: JSON.stringify(content),
              otherUser: chatStore.fangDong
            } : {
              ...message,
              otherUser: chatStore.fangDong
            }
          )
        });
        chatList.value.push(message);
        scrollToBottom();
        if (type === constants_chat.msgType.text) {
          msgText.value = "";
        }
      } catch (e) {
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: common_vendor.unref(chatStore).fangDong.nickName
        }),
        b: common_vendor.f(chatList.value, (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(collectVoiceMsgId, index),
            c: "0a18654a-1-" + i0,
            d: common_vendor.p({
              msg: item,
              index
            })
          };
        }),
        c: chatBottomId,
        d: scrollViewId.value,
        e: chatBottomDis.value + "px",
        f: common_vendor.o(pageClick),
        g: common_vendor.o(reachTop),
        h: mode.value !== common_vendor.unref(constants_chat.chatMode).voice
      }, mode.value !== common_vendor.unref(constants_chat.chatMode).voice ? {
        i: common_vendor.o(changeMode),
        j: common_vendor.p({
          name: "laba",
          size: "54"
        })
      } : {
        k: common_vendor.o(changeMode),
        l: common_vendor.p({
          name: "jianpan",
          size: "54"
        })
      }, {
        m: mode.value === common_vendor.unref(constants_chat.chatMode).voice
      }, mode.value === common_vendor.unref(constants_chat.chatMode).voice ? {
        n: common_vendor.t(isRecording.value ? "松开 结束" : "按住 说话"),
        o: common_vendor.o(touchStart),
        p: common_vendor.o(touchEnd),
        q: common_vendor.o(touchMove),
        r: common_vendor.o(touchCancel)
      } : {
        s: isFocus.value,
        t: common_vendor.o(($event) => sendMsg(common_vendor.unref(constants_chat.msgType).text, msgText.value)),
        v: msgText.value,
        w: common_vendor.o(common_vendor.m(($event) => msgText.value = $event.detail.value, {
          trim: true
        }))
      }, {
        x: osName.value !== common_vendor.unref(constants_common.os).ios && msgText.value.length > 0
      }, osName.value !== common_vendor.unref(constants_common.os).ios && msgText.value.length > 0 ? {
        y: common_vendor.o(($event) => sendMsg(common_vendor.unref(constants_chat.msgType).text, msgText.value))
      } : common_vendor.e({
        z: mode.value !== common_vendor.unref(constants_chat.chatMode).emoji
      }, mode.value !== common_vendor.unref(constants_chat.chatMode).emoji ? {
        A: common_vendor.o(($event) => rightIconClick(common_vendor.unref(constants_chat.chatMode).emoji)),
        B: common_vendor.p({
          name: "biaoqing",
          size: "54"
        })
      } : {
        C: common_vendor.o(($event) => rightIconClick(common_vendor.unref(constants_chat.chatMode).text)),
        D: common_vendor.p({
          name: "jianpan",
          size: "54"
        })
      }, {
        E: common_vendor.o(($event) => rightIconClick(common_vendor.unref(constants_chat.chatMode).extension)),
        F: common_vendor.p({
          name: "gengduo",
          size: "54"
        })
      }), {
        G: actionBottomDis.value + "px",
        H: mode.value === common_vendor.unref(constants_chat.chatMode).emoji
      }, mode.value === common_vendor.unref(constants_chat.chatMode).emoji ? {
        I: common_vendor.o(selectEmoji),
        J: common_vendor.o(delEmoji),
        K: common_vendor.p({
          hasContent: !!msgText.value
        })
      } : mode.value === common_vendor.unref(constants_chat.chatMode).extension ? {
        M: common_vendor.o(selectOrTakeImage)
      } : {}, {
        L: mode.value === common_vendor.unref(constants_chat.chatMode).extension,
        N: common_vendor.unref(bottomDis) + "px",
        O: visible.value,
        P: common_vendor.p({
          name: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/message/recording.gif",
          size: "150"
        }),
        Q: common_vendor.t(isCancelRecord.value ? "松开手指" : "手指上滑"),
        R: isRecording.value
      });
    };
  }
};
wx.createPage(_sfc_main);
