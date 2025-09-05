"use strict";
const utils_request = require("../utils/request.js");
const getCityListApi = () => {
  return utils_request.request({
    method: "GET",
    url: "/portal/citypage/get/nologin"
  });
};
exports.getCityListApi = getCityListApi;
