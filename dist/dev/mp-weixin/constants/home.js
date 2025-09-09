"use strict";
const common_vendor = require("../common/vendor.js");
const diamondList = [
  {
    id: 10000025,
    title: "整租",
    key: "whole_rent",
    iconPath: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/zhengzu.png"
  },
  {
    id: 10000026,
    title: "合租",
    key: "share_rent",
    iconPath: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/hezu.png"
  },
  {
    id: 10000027,
    title: "省心租",
    key: "worry_free_rental",
    iconPath: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/shengxinzu.png"
  },
  {
    id: 10000028,
    title: "公寓",
    key: "apartment",
    iconPath: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/gongyu.png"
  },
  {
    id: 10000029,
    title: "个人房源",
    key: "personal_house",
    iconPath: "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/web/home/gerenfangyuan.png"
  }
];
const filterTypeMap = {
  // 区域
  region: "region",
  // 租金
  price: "price",
  // 户型
  houseType: "houseType",
  // 排序
  sort: "sort"
};
const filterTypeList = common_vendor.ref([
  {
    id: 1100001,
    // 筛选项的名称
    title: "区域",
    // 筛选类型
    type: filterTypeMap.region,
    // 筛选面板是否打开
    isOpen: false
  },
  {
    id: 1100002,
    title: "租金",
    type: filterTypeMap.price,
    isOpen: false
  },
  {
    id: 1100003,
    title: "户型",
    type: filterTypeMap.houseType,
    isOpen: false
  },
  {
    id: 1100004,
    title: "排序",
    type: filterTypeMap.sort,
    isOpen: false
  }
]);
const sortPullList = [
  {
    title: "距离优先",
    key: "distance"
  },
  {
    title: "价格从低到高",
    key: "price_asc"
  },
  {
    title: "价格从高到低",
    key: "price_desc"
  }
];
exports.diamondList = diamondList;
exports.filterTypeList = filterTypeList;
exports.filterTypeMap = filterTypeMap;
exports.sortPullList = sortPullList;
