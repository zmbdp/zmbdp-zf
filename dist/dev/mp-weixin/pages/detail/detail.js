"use strict";
const common_vendor = require("../../common/vendor.js");
const api_house = require("../../api/house.js");
const constants_common = require("../../constants/common.js");
const constants_house = require("../../constants/house.js");
const utils_toast = require("../../utils/toast.js");
require("../../stores/index.js");
const stores_modules_user = require("../../stores/modules/user.js");
const stores_modules_chat = require("../../stores/modules/chat.js");
if (!Array) {
  const _easycom_bit_nav_bar2 = common_vendor.resolveComponent("bit-nav-bar");
  const _easycom_bit_icon2 = common_vendor.resolveComponent("bit-icon");
  (_easycom_bit_nav_bar2 + _easycom_bit_icon2)();
}
const _easycom_bit_nav_bar = () => "../../components/bit-nav-bar/bit-nav-bar.js";
const _easycom_bit_icon = () => "../../components/bit-icon/bit-icon.js";
if (!Math) {
  (_easycom_bit_nav_bar + _easycom_bit_icon)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const chatStore = stores_modules_chat.useChatStore();
    common_vendor.onLoad((query) => {
      getHouseDetail(query.houseId);
    });
    const houseDetail = common_vendor.ref({});
    const getHouseDetail = async (houseId) => {
      try {
        houseDetail.value = await api_house.getHouseDetailApi(houseId);
        houseDetail.value.intro = houseDetail.value.intro.replaceAll(
          "<br>",
          ""
        );
      } catch (e) {
      }
    };
    const covers = common_vendor.computed(() => {
      return houseDetail.value.houseId ? [
        {
          id: 1,
          longitude: houseDetail.value.longitude,
          latitude: houseDetail.value.latitude,
          iconPath: "/static/icons/marker.png",
          width: common_vendor.index.upx2px(48),
          height: common_vendor.index.upx2px(48)
        }
      ] : [];
    });
    const currentIndex = common_vendor.ref(0);
    const onSwiperChange = (e) => {
      currentIndex.value = e.detail.current;
    };
    const openLocation = () => {
      if (!houseDetail.value.houseId)
        return;
      const { longitude, latitude, communityName } = houseDetail.value;
      common_vendor.index.openLocation({
        longitude,
        latitude,
        name: communityName,
        success: () => {
        },
        fail: (e) => {
          utils_toast.showNoneIconToast(e.errMsg);
        }
      });
    };
    common_vendor.onShareAppMessage(() => {
      if (!houseDetail.value.houseId)
        return;
      const { houseId, title, headImage } = houseDetail.value;
      return {
        title,
        // 标题
        path: "/pages/detail/detail?houseId=" + houseId,
        // 房源详情页的路由路径并带上houseId
        imageUrl: constants_common.OSS_BASE_URL + headImage
        // 房屋的图片
      };
    });
    const onConsult = () => {
      if (userStore.token) {
        if (houseDetail.value.userId === userStore.userInfo.userId) {
          utils_toast.showNoneIconToast("不能与自己聊天");
          return;
        }
      }
      const {
        headImage,
        title,
        area,
        position,
        regionName,
        price,
        userId,
        houseId
      } = houseDetail.value;
      chatStore.setFangDong({
        id: houseDetail.value.userId
      });
      chatStore.setHouse({
        headImage: constants_common.OSS_BASE_URL + headImage,
        title,
        area,
        position: constants_house.positionMap[position],
        regionName,
        price,
        userId,
        houseId
      });
      if (userStore.token) {
        common_vendor.index.navigateTo({
          url: "/pages/chat/chat"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/login/login?redirectUrl=pages/chat/chat"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "房源详情"
        }),
        b: houseDetail.value.houseId
      }, houseDetail.value.houseId ? {
        c: common_vendor.f(houseDetail.value.images, (url, index, i0) => {
          return {
            a: common_vendor.unref(constants_common.OSS_BASE_URL) + url,
            b: index
          };
        }),
        d: common_vendor.o(onSwiperChange),
        e: common_vendor.t(currentIndex.value + 1),
        f: common_vendor.t(houseDetail.value.images.length),
        g: common_vendor.t(houseDetail.value.title),
        h: common_vendor.t(houseDetail.value.price),
        i: common_vendor.t(houseDetail.value.houseType),
        j: common_vendor.t(houseDetail.value.area),
        k: common_vendor.t(houseDetail.value.floor),
        l: common_vendor.t(houseDetail.value.allFloor),
        m: common_vendor.t(common_vendor.unref(constants_house.positionMap)[houseDetail.value.position]),
        n: common_vendor.f(houseDetail.value.tags, (item, k0, i0) => {
          return {
            a: "927a702c-1-" + i0,
            b: common_vendor.p({
              name: common_vendor.unref(constants_house.tagMap)[item.tagCode],
              size: "44"
            }),
            c: common_vendor.t(item.tagName),
            d: item.tagCode
          };
        }),
        o: common_vendor.t(houseDetail.value.communityName),
        p: houseDetail.value.longitude,
        q: houseDetail.value.latitude,
        r: covers.value,
        s: common_vendor.o(openLocation),
        t: common_vendor.t(houseDetail.value.intro),
        v: common_vendor.f(houseDetail.value.devices, (item, k0, i0) => {
          return {
            a: "927a702c-2-" + i0,
            b: common_vendor.t(item.deviceName),
            c: item.deviceCode
          };
        }),
        w: common_vendor.p({
          name: "peizhi",
          size: "24"
        }),
        x: common_vendor.p({
          name: "anxuanyanzhen",
          width: "140",
          height: "32"
        })
      } : {}, {
        y: common_vendor.p({
          name: "fenxiang",
          size: "40"
        }),
        z: common_vendor.o(onConsult)
      });
    };
  }
};
_sfc_main.__runtimeHooks = 2;
wx.createPage(_sfc_main);
