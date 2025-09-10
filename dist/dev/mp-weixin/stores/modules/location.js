"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_home = require("../../api/home.js");
const getLngAndLat = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.getLocation({
      type: "gcj02",
      accuracy: "best",
      isHighAccuracy: true,
      success: (res) => {
        console.log("获取到的经纬度:", {
          longitude: res.longitude,
          latitude: res.latitude
        });
        resolve({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail: (error) => {
        utils_toast.showNoneIconToast(error.errMsg);
        reject(new Error(error.errMsg));
      }
    });
  });
};
const defaultLocationInfo = {
  id: 35,
  latitude: 39.905023,
  longitude: 116.724502,
  name: "北京",
  fullName: "北京市"
};
const state = () => ({
  location: {}
});
const actions = {
  // 给 location 赋值
  setLocationAction(location) {
    this.location = {
      ...this.location,
      ...location
    };
  },
  // 获取位置信息 action 函数
  getLocationAction() {
    return new Promise((resolve, reject) => {
      getLngAndLat().then(({ longitude, latitude }) => {
        api_home.getCityInfoApi({
          lng: longitude,
          lat: latitude
        }).then((location) => {
          console.log("获取位置信息成功", location);
          if (location && location.id) {
            console.log("成功获取到城市ID:", location.id);
            console.log("城市名称:", location.name);
            console.log("城市全称:", location.fullName);
          } else {
            console.log("未能获取到有效的城市信息");
          }
          this.setLocationAction({
            ...location,
            longitude,
            latitude
          });
          resolve();
        }).catch((error) => {
          this.setLocationAction(defaultLocationInfo);
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    }, 1e3);
  }
};
const useLocationStore = common_vendor.defineStore("location", {
  state,
  actions
});
exports.useLocationStore = useLocationStore;
