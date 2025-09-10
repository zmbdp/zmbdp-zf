"use strict";
const common_vendor = require("../common/vendor.js");
const safeBottomDistance = () => {
  return common_vendor.index.getWindowInfo().safeAreaInsets.bottom;
};
const getOsName = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.getSystemInfo({
      success: (res) => {
        resolve(res.osName);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
exports.getOsName = getOsName;
exports.safeBottomDistance = safeBottomDistance;
