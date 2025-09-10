"use strict";
const common_vendor = require("../common/vendor.js");
const isAuthorized = (key) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.getSetting({
      success: (res) => {
        resolve(res.authSetting["scope." + key]);
      },
      fail: () => {
        reject();
      }
    });
  });
};
const authorize = (key) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.authorize({
      scope: "scope." + key,
      success: () => {
        resolve();
      },
      fail: () => {
        reject();
        common_vendor.index.openSetting();
      }
    });
  });
};
exports.authorize = authorize;
exports.isAuthorized = isAuthorized;
