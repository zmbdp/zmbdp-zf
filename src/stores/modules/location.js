// 管理位置信息

import { showNoneIconToast } from '@/utils/toast';
import { getCityInfoApi } from '@/api/home';
import { defineStore } from 'pinia';
/**
 * 获取经纬度
 */
const getLngAndLat = () => {
  return new Promise((resolve, reject) => {
    // 调用 uni-app 获取位置 api
    uni.getLocation({
      type: 'gcj02',
      accuracy: 'best',
      isHighAccuracy: true,
      success: (res) => {
        console.log('获取到的经纬度:', {
          longitude: res.longitude,
          latitude: res.latitude
        });
        resolve({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail: (error) => {
        showNoneIconToast(error.errMsg);
        reject(new Error(error.errMsg));
      }
    });
  });
};

// 默认位置 - 北京
const defaultLocationInfo = {
  id: 35,
  latitude: 39.905023,
  longitude: 116.724502,
  name: '北京',
  fullName: '北京市'
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
      // 获取经纬度
      getLngAndLat()
        .then(({ longitude, latitude }) => {
          // 调接口(基于经纬度获取城市信息)
          getCityInfoApi({
            lng: longitude,
            lat: latitude
          })
            .then((location) => {
              // location: 经纬度对应的城市信息
              // 将后端响应的城市信息存储在pinia中
              console.log('获取位置信息成功', location);

              // 添加日志，检查是否获取到城市ID
              if (location && location.id) {
                console.log('成功获取到城市ID:', location.id);
                console.log('城市名称:', location.name);
                console.log('城市全称:', location.fullName);
              } else {
                console.log('未能获取到有效的城市信息');
              }
              this.setLocationAction({
                ...location,
                longitude,
                latitude
              });
              resolve();
            })
            .catch((error) => {
              // 获取位置信息的接口如果调用失败了，会执行当前
              // catch中的代码块，为了避免失败后没有城市可显示，因此当接口调用失败了，可以展示一个默认位置（北京）
              this.setLocationAction(defaultLocationInfo);
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    }, 1000);
  }
};

export const useLocationStore = defineStore('location', {
  state,
  actions
});
