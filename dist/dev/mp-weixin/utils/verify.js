"use strict";
const utils_toast = require("./toast.js");
const isEmpty = (value) => {
  return value === "" || value === null || value === void 0;
};
const verify = (reg) => {
  return (value) => {
    return reg.test(value);
  };
};
const isValidPhone = verify(/^1[3-9]\d{9}$/);
const isValidCode = verify(/^\d{6}$/);
const verifyPhone = (phone) => {
  if (isEmpty(phone)) {
    utils_toast.showNoneIconToast("手机号不能为空");
    return false;
  } else if (!isValidPhone(phone)) {
    utils_toast.showNoneIconToast("手机号格式不对");
    return false;
  }
  return true;
};
const verifyCode = (code) => {
  if (isEmpty(code)) {
    utils_toast.showNoneIconToast("验证码不能为空");
    return false;
  } else if (!isValidCode(code)) {
    utils_toast.showNoneIconToast("验证码格式不对");
    return false;
  }
  return true;
};
exports.verifyCode = verifyCode;
exports.verifyPhone = verifyPhone;
