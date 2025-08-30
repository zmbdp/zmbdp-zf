"use strict";
const common_vendor = require("../common/vendor.js");
const pinia = common_vendor.createPinia();
pinia.use(
  common_vendor.createPersistedState({
    // 重写持久化的存储规则：默认采用的是 localStorage 的存储方式，
    // 无论是 localStorage 还是 sessionStorage 都只适用于浏览器端,
    // 而小程序并不是运行在浏览器端的，所以需要用小程序本身的存储规则
    storage: {
      setItem: common_vendor.index.setStorageSync,
      getItem: common_vendor.index.getStorageSync
    }
  })
);
exports.pinia = pinia;
