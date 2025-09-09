"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const utils_websocket = require("../../utils/websocket.js");
const constants_common = require("../../constants/common.js");
const stores_modules_session = require("./session.js");
const utils_redDot = require("../../utils/redDot.js");
const state = () => ({
  // token: 用户登录凭证
  token: "",
  // 用户信息
  userInfo: {}
});
const actions = {
  // 验证码登录action函数
  loginByCodeAction({ phone, code }) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await api_user.loginByCodeApi({ phone, code });
        this.token = resp.accessToken;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 微信一键登录action函数
  loginByWxAction(openId) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await api_user.loginByWxApi(openId);
        this.token = resp.accessToken;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 获取用户信息action函数
  getUserInfoAction() {
    return new Promise(async (resolve, reject) => {
      try {
        this.userInfo = await api_user.getUserInfoApi();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 退出登录action函数
  logoutAction() {
    return new Promise((resolve, reject) => {
      try {
        this.token = "";
        this.userInfo = {};
        utils_websocket.socket.close();
        common_vendor.index.$emit(constants_common.UniAppEvent.LogoutSuccess);
        const sessionStore = stores_modules_session.useSessionStore();
        sessionStore.clearSessionList();
        utils_redDot.removeRedDot();
        common_vendor.index.$off(constants_common.UniAppEvent.LoginSuccess);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 修改用户信息
  setUserInfoAction(userInfo) {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo
    };
  }
};
const useUserStore = common_vendor.defineStore("user", {
  state,
  actions,
  // 开启数据持久化
  persist: true
});
exports.useUserStore = useUserStore;
