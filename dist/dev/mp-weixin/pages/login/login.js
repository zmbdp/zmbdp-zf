"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_verify = require("../../utils/verify.js");
const api_user = require("../../api/user.js");
const utils_toast = require("../../utils/toast.js");
require("../../stores/index.js");
const utils_websocket = require("../../utils/websocket.js");
const constants_common = require("../../constants/common.js");
const stores_modules_chat = require("../../stores/modules/chat.js");
const stores_modules_session = require("../../stores/modules/session.js");
const stores_modules_user = require("../../stores/modules/user.js");
const tabBar = {
  list: [
    {
      pagePath: "pages/index/index",
      iconPath: "static/images/tabbar/index-default.png",
      selectedIconPath: "static/images/tabbar/index-selected.png",
      text: "首页"
    },
    {
      pagePath: "pages/message/message",
      iconPath: "static/images/tabbar/message-default.png",
      selectedIconPath: "static/images/tabbar/message-selected.png",
      text: "消息"
    },
    {
      pagePath: "pages/mine/mine",
      iconPath: "static/images/tabbar/mine-default.png",
      selectedIconPath: "static/images/tabbar/mine-selected.png",
      text: "我的"
    }
  ]
};
const pagesJson = {
  tabBar
};
if (!Array) {
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  (_easycom_bit_icon2 + _easycom_bit_nav_bar2)();
}
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
if (!Math) {
  (_easycom_bit_icon + _easycom_bit_nav_bar)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const chatStore = stores_modules_chat.useChatStore();
    const sessionStore = stores_modules_session.useSessionStore();
    let redirectUrl = null;
    common_vendor.onLoad((query) => {
      redirectUrl = query.redirectUrl;
    });
    const onBack = () => {
      const pages = getCurrentPages();
      if (pages.length >= 2) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }
    };
    const onGoHome = () => {
      common_vendor.index.$emit(constants_common.UniAppEvent.GoToHomePage);
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    let codeValue = null;
    const loginForm = common_vendor.reactive({
      phone: "",
      // 手机号
      code: ""
      // 验证码
    });
    const timeLeft = common_vendor.ref(0);
    const getCode = async () => {
      const { phone } = loginForm;
      if (!utils_verify.verifyPhone(phone))
        return;
      if (timeLeft.value > 0) {
        utils_toast.showNoneIconToast("请在60秒后重新获取");
        return;
      }
      try {
        codeValue = await api_user.getCodeApi(phone);
        timeLeft.value = 60;
        const timer = setInterval(() => {
          timeLeft.value--;
          if (timeLeft.value === 0) {
            clearInterval(timer);
            timeLeft.value = 0;
          }
        }, 1e3);
      } catch (e) {
        timeLeft.value = 0;
        utils_toast.showNoneIconToast(e.message);
      }
    };
    const isAgree = common_vendor.ref(false);
    const codeLoading = common_vendor.ref(false);
    const wxLoading = common_vendor.ref(false);
    const onToggle = () => {
      isAgree.value = !isAgree.value;
    };
    const userStore = stores_modules_user.useUserStore();
    const onLogin = (loginFn) => {
      if (!isAgree.value) {
        utils_toast.showNoneIconToast("请勾选并同意用户协议");
        return;
      }
      loginFn().then(async () => {
        try {
          utils_toast.showSuccessToast("登录成功");
          utils_websocket.socket.initSocketConnect();
          await sessionStore.getSessionListAction();
          common_vendor.index.$emit(constants_common.UniAppEvent.LoginSuccess);
        } catch (e) {
          console.log(e);
        }
        userStore.getUserInfoAction().then(() => {
        }).catch((e) => {
          utils_toast.showNoneIconToast(e.message);
        });
        setTimeout(() => {
          if (redirectUrl) {
            const isTabBarPage = pagesJson.tabBar.list.some(
              (route) => route.pagePath === redirectUrl
            );
            if (isTabBarPage) {
              common_vendor.index.switchTab({
                url: "/" + redirectUrl
              });
            } else {
              if (
                // 本人并且携带的路由路径还是聊天页，由于本人不能自己聊天，压根就去不了聊天
                chatStore.fangDong.id === userStore.userInfo.userId && redirectUrl === "pages/chat/chat"
              ) {
                utils_toast.showNoneIconToast("不能与自己聊天");
                common_vendor.index.redirectTo({
                  url: "/pages/detail/detail?houseId=" + chatStore.house.houseId
                });
              } else {
                common_vendor.index.redirectTo({
                  url: "/" + redirectUrl
                });
              }
            }
          } else {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }
        }, 500);
      }).catch((error) => {
        utils_toast.showErrorToast(error.message);
      });
    };
    const onLoginByCode = () => {
      onLogin(() => {
        return new Promise((resolve, reject) => {
          const { phone, code } = loginForm;
          if (!utils_verify.verifyPhone(phone))
            return reject();
          if (!utils_verify.verifyCode(code))
            return reject();
          if (code !== codeValue) {
            utils_toast.showNoneIconToast("验证码不正确");
            return reject();
          }
          codeLoading.value = true;
          userStore.loginByCodeAction(loginForm).then(resolve).catch(reject).finally(() => {
            codeLoading.value = false;
          });
        });
      });
    };
    const onLoginByWx = () => {
      onLogin(() => {
        return new Promise((resolve, reject) => {
          wxLoading.value = true;
          common_vendor.index.login({
            provider: "weixin",
            success: (res) => {
              common_vendor.index.request({
                method: "GET",
                url: "https://api.weixin.qq.com/sns/jscode2session",
                data: {
                  appid: "wx16b05799dcd4b403",
                  secret: "da4a97229fd2a97b8c030a0da7ae6cc3",
                  js_code: res.code,
                  grant_type: "authorization_code"
                },
                success: (result) => {
                  userStore.loginByWxAction(result.data.openid).then(resolve).catch(reject).finally(() => {
                    wxLoading.value = false;
                  });
                },
                // 失败
                fail: (error) => {
                  reject(new Error(error.errMsg));
                  wxLoading.value = false;
                },
                complete: () => {
                  common_vendor.index.hideLoading({
                    fail: () => {
                    }
                  });
                }
              });
            },
            fail: (error) => {
              reject(new Error(error.errMsg));
              wxLoading.value = false;
            }
          });
        });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onBack),
        b: common_vendor.p({
          name: "fanhui-left",
          size: "32"
        }),
        c: common_vendor.o(onGoHome),
        d: common_vendor.p({
          name: "shouye",
          size: "32"
        }),
        e: common_vendor.p({
          title: "稚能安居",
          direction: "bottom",
          bgStartColor: "#EBFBFF",
          bgEndColor: "#DFF8FF"
        }),
        f: loginForm.phone,
        g: common_vendor.o(common_vendor.m(($event) => loginForm.phone = $event.detail.value, {
          trim: true
        })),
        h: loginForm.code,
        i: common_vendor.o(common_vendor.m(($event) => loginForm.code = $event.detail.value, {
          trim: true
        })),
        j: common_vendor.t(timeLeft.value > 0 ? `${timeLeft.value}秒后重新获取` : "获取验证码"),
        k: common_vendor.o(getCode),
        l: common_vendor.o(onToggle),
        m: common_vendor.p({
          name: isAgree.value ? "agree" : "unagree",
          size: "22"
        }),
        n: common_vendor.o(onToggle),
        o: codeLoading.value,
        p: codeLoading.value,
        q: common_vendor.o(onLoginByCode),
        r: wxLoading.value,
        s: wxLoading.value,
        t: common_vendor.o(onLoginByWx)
      };
    };
  }
};
wx.createPage(_sfc_main);
