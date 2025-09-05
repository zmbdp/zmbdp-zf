"use strict";
const utils_request = require("../utils/request.js");
const getCityInfoApi = ({ lng, lat }) => {
  return utils_request.request({
    method: "GET",
    url: "/portal/homepage/city_desc/get/nologin",
    data: {
      lng,
      lat
    }
  });
};
const getFilterPullListApi = ({ cityId, dirtTypes }) => {
  return utils_request.request({
    method: "POST",
    url: "/portal/homepage/pull_list/get/nologin",
    data: {
      cityId,
      dirtTypes
    }
  });
};
const getHouseListApi = ({
  cityId,
  regionId,
  rentalRanges,
  rentTypes,
  rooms,
  sort,
  pageNo,
  pageSize,
  longitude,
  latitude
}) => {
  return utils_request.request({
    method: "POST",
    url: "/portal/homepage/house_list/search/nologin",
    data: {
      cityId,
      regionId,
      rentalRanges,
      rentTypes,
      rooms,
      sort,
      pageNo,
      pageSize,
      longitude,
      latitude
    }
  });
};
exports.getCityInfoApi = getCityInfoApi;
exports.getFilterPullListApi = getFilterPullListApi;
exports.getHouseListApi = getHouseListApi;
