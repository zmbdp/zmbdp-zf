"use strict";
const common_vendor = require("../common/vendor.js");
const showErrorToast = (msg) => {
  common_vendor.index.showToast({
    title: msg,
    icon: "error"
  });
};
exports.showErrorToast = showErrorToast;
