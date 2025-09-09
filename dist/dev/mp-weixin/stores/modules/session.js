"use strict";
const common_vendor = require("../../common/vendor.js");
const api_session = require("../../api/session.js");
const constants_chat = require("../../constants/chat.js");
const constants_common = require("../../constants/common.js");
const state = () => ({
  // 全局会话列表
  sessionList: []
});
const actions = {
  // 获取会话列表的 action 函数
  getSessionListAction() {
    return new Promise((resolve, reject) => {
      api_session.getSessionListApi().then((sessionList) => {
        this.sessionList = sessionList.map((session) => {
          const { lastMessageVO } = session;
          if ([constants_chat.msgType.card, constants_chat.msgType.voice].includes(
            lastMessageVO.type
          )) {
            lastMessageVO.content = JSON.parse(
              lastMessageVO.content
            );
          }
          return session;
        });
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // 清空会话列表
  clearSessionList() {
    this.sessionList = [];
  },
  /**
   * 更新会话列表(主要更新未访问消息数量)
   * @param {*} updateTime 更新时机
   * @param {*} message (最后一条)消息对象
   */
  updateSessionList(updateTime, message) {
    const i = this.sessionList.findIndex(
      (item) => item.sessionId === message.sessionId
    );
    if (i !== -1) {
      switch (updateTime) {
        case constants_common.updateSessionTime.receiveMsg:
          this.sessionList[i] = {
            ...this.sessionList[i],
            lastMessageVO: message,
            lastSessionTime: message.createTime,
            notVisitedCount: this.sessionList[i].notVisitedCount + 1
          };
          break;
        case constants_common.updateSessionTime.exitChatPage:
          this.sessionList[i] = {
            ...this.sessionList[i],
            lastMessageVO: message,
            lastSessionTime: message.createTime,
            notVisitedCount: 0
          };
          break;
      }
    } else {
      this.sessionList.push({
        lastMessageVO: message,
        lastSessionTime: message.createTime,
        notVisitedCount: 1,
        otherUser: message.otherUser,
        sessionId
      });
    }
  }
};
const getters = {
  // 统计所有未访问的消息数量
  notVisitedCount() {
    return this.sessionList.reduce(
      (prev, item) => prev + item.notVisitedCount,
      0
    );
  }
};
const useSessionStore = common_vendor.defineStore("session", {
  state,
  actions,
  getters
});
exports.useSessionStore = useSessionStore;
