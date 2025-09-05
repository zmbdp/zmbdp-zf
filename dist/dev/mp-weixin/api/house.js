"use strict";
const utils_request = require("../utils/request.js");
const getHouseDetailApi = (houseId) => {
  return utils_request.request({
    method: "GET",
    url: "/portal/housepage/get/nologin",
    data: {
      houseId
    }
  });
};
exports.getHouseDetailApi = getHouseDetailApi;
