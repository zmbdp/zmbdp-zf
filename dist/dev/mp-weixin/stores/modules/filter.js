"use strict";
const common_vendor = require("../../common/vendor.js");
const api_home = require("../../api/home.js");
const utils_normalize = require("../../utils/normalize.js");
const state = () => ({
  filterInfo: {
    regionList: [],
    // 区域列表
    rentRangeList: [],
    // 租金列表
    rentTypeList: [],
    // 出租类型列表
    roomNumList: []
    // 居室列表
  }
});
const actions = {
  // 获取筛选列表 action 函数
  getFilterPullListAction({ cityId, dirtTypes }) {
    return new Promise((resolve, reject) => {
      api_home.getFilterPullListApi({
        cityId,
        dirtTypes
      }).then((res) => {
        this.filterInfo.regionList = utils_normalize.normalize(
          res.regionList,
          false
        );
        this.filterInfo.rentRangeList = utils_normalize.normalize(
          res.dictMap.rent_range
        );
        this.filterInfo.rentTypeList = utils_normalize.normalize(
          res.dictMap.rent_type_list
        );
        this.filterInfo.roomNumList = utils_normalize.normalize(
          res.dictMap.room_num
        );
        resolve();
      }).catch(reject);
    });
  },
  // 设置出租方式高亮
  setRentTypeActive(rentTypeKey) {
    if (this.filterInfo.rentRangeList.length === 0)
      return;
    const rentTypeItem = this.filterInfo.rentTypeList.find(
      (item) => item.key === rentTypeKey
    );
    this.filterInfo.rentTypeList[0].selected = false;
    rentTypeItem.selected = true;
    return rentTypeItem;
  },
  // 重置筛选信息
  resetFilterInfo() {
    if (this.filterInfo.rentRangeList.length > 0) {
      this.filterInfo.rentRangeList[0].selected = true;
      this.filterInfo.rentRangeList.slice(1).forEach((item) => {
        if (item.selected) {
          item.selected = false;
        }
      });
    }
    if (this.filterInfo.rentTypeList.length > 0) {
      this.filterInfo.rentTypeList[0].selected = true;
      this.filterInfo.rentTypeList.slice(1).forEach((item) => {
        if (item.selected) {
          item.selected = false;
        }
      });
    }
    if (this.filterInfo.roomNumList.length > 0) {
      this.filterInfo.roomNumList[0].selected = true;
      this.filterInfo.roomNumList.slice(1).forEach((item) => {
        if (item.selected) {
          item.selected = false;
        }
      });
    }
  }
};
const useFilterStore = common_vendor.defineStore("filter", {
  state,
  actions
});
exports.useFilterStore = useFilterStore;
