"use strict";
const common_vendor = require("../common/vendor.js");
require("../stores/index.js");
const utils_toast = require("./toast.js");
const stores_modules_user = require("../stores/modules/user.js");
const BASE_URL = "http://127.0.0.1:10030";
const requestInterceptor = {
  // 请求拦截器，任何请求在请求发出去之后，到达服务器之前，必须经过 invoke 函数的处理
  // 因此可以再 invoke 函数中对请求做统一处理，比如在添加基地址，请求头中统一携带token
  invoke: (options) => {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
    if (!options.url.startsWith("http")) {
      options.url = BASE_URL + options.url;
    }
    options.header = {
      ...options.header,
      // 当前传给服务器的参数列表是json格式字符串，因此可以把原有的header展示，
      // 然后再追加新属性 content-type 字段
      "content-type": "application/json"
    };
    const userStore = stores_modules_user.useUserStore();
    const { token } = userStore;
    if (token) {
      options.header.Authorization = token;
    }
  }
};
const request = ({ method = "GET", url, header = {}, data = {} }) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      method,
      url,
      header,
      data,
      // 成功回调
      success: async (response) => {
        const { code, errMsg, data: data2 } = response.data;
        if (code === 2e5) {
          common_vendor.index.hideLoading({
            fail: () => {
            }
          });
          resolve(data2);
        } else {
          common_vendor.index.hideLoading({
            fail: () => {
            },
            complete: () => {
              utils_toast.showNoneIconToast(errMsg);
            }
          });
          const userStore = stores_modules_user.useUserStore();
          if ([401e3, 401001, 401002, 401003].includes(code)) {
            await userStore.logoutAction();
            const pages = getCurrentPages();
            const routePath = pages[pages.length - 1].route;
            common_vendor.index.navigateTo({
              url: "/pages/login/login?redirectUrl=" + routePath
            });
          }
          reject(new Error(errMsg));
        }
      },
      // 失败回调
      fail: (error) => {
        common_vendor.index.hideLoading({
          fail: () => {
          }
        });
        utils_toast.showNoneIconToast(error.errMsg || "请求超时,请稍后重试");
        reject(new Error(error.errMsg));
      }
    });
  });
};
common_vendor.index.addInterceptor("request", requestInterceptor);
common_vendor.index.addInterceptor("uploadFile", requestInterceptor);
exports.request = request;
