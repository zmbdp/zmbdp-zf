"use strict";
const utils_request = require("../utils/request.js");
const getCodeApi = (phone) => {
  return utils_request.request({
    method: "GET",
    url: "/portal/user/send_code",
    data: {
      phone
    }
  });
};
const loginByCodeApi = ({ phone, code }) => {
  return utils_request.request({
    method: "POST",
    url: "/portal/user/login/code",
    data: {
      phone,
      code
    }
  });
};
const loginByWxApi = (openId) => {
  return utils_request.request({
    method: "POST",
    url: "/portal/user/login/wechat",
    data: {
      openId
    }
  });
};
const getUserInfoApi = () => {
  return utils_request.request({
    method: "GET",
    url: "/portal/user/login_info/get"
  });
};
const putUserInfoApi = ({ userId, nickName, avatar }) => {
  return utils_request.request({
    method: "POST",
    url: "/portal/user/edit",
    data: {
      userId,
      nickName,
      avatar
    }
  });
};
exports.getCodeApi = getCodeApi;
exports.getUserInfoApi = getUserInfoApi;
exports.loginByCodeApi = loginByCodeApi;
exports.loginByWxApi = loginByWxApi;
exports.putUserInfoApi = putUserInfoApi;
