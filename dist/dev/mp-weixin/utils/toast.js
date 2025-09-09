"use strict";
const common_vendor = require("../common/vendor.js");
const showSuccessToast = (msg) => {
  common_vendor.index.showToast({
    title: msg,
    icon: "success"
  });
};
const showErrorToast = (msg) => {
  common_vendor.index.showToast({
    title: msg,
    icon: "error"
  });
};
const showNoneIconToast = (msg) => {
  common_vendor.index.showToast({
    title: msg,
    icon: "none"
  });
};
exports.showErrorToast = showErrorToast;
exports.showNoneIconToast = showNoneIconToast;
exports.showSuccessToast = showSuccessToast;
