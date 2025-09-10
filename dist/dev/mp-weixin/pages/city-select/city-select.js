"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/index.js");
const api_citySelect = require("../../api/city-select.js");
const stores_modules_location = require("../../stores/modules/location.js");
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
  __name: "city-select",
  setup(__props) {
    const locationStore = stores_modules_location.useLocationStore();
    const hotCityList = common_vendor.ref([]);
    const allCityMap = common_vendor.ref({});
    const getCityList = async () => {
      const resp = await api_citySelect.getCityListApi();
      hotCityList.value = resp.hotCityList;
      allCityMap.value = resp.allCityMap;
    };
    getCityList();
    const scrollIntoViewId = common_vendor.ref(null);
    const onLetterClick = (id) => {
      scrollIntoViewId.value = id;
    };
    const onRelocation = async () => {
      try {
        await locationStore.getLocationAction();
      } catch (e) {
      } finally {
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 500);
      }
    };
    const onCitySelect = (city) => {
      if (city.id !== locationStore.location.id) {
        locationStore.setLocationAction(city);
      }
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "选择城市"
        }),
        b: common_vendor.p({
          name: "weizhi",
          size: "32"
        }),
        c: common_vendor.t(common_vendor.unref(locationStore).location.name),
        d: common_vendor.o(onRelocation),
        e: common_vendor.f(hotCityList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.id === common_vendor.unref(locationStore).location.id ? 1 : "",
            c: item.id,
            d: common_vendor.o(($event) => onCitySelect(item), item.id)
          };
        }),
        f: common_vendor.f(allCityMap.value, (cityList, title, i0) => {
          return {
            a: common_vendor.t(title),
            b: title,
            c: common_vendor.f(cityList, (city, k1, i1) => {
              return {
                a: common_vendor.t(city.name),
                b: city.id,
                c: common_vendor.o(($event) => onCitySelect(city), city.id)
              };
            }),
            d: title
          };
        }),
        g: scrollIntoViewId.value,
        h: common_vendor.f(allCityMap.value, (v0, key, i0) => {
          return {
            a: common_vendor.t(key),
            b: key === scrollIntoViewId.value ? 1 : "",
            c: key,
            d: common_vendor.o(($event) => onLetterClick(key), key)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
