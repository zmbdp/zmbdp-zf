"use strict";
const common_vendor = require("../common/vendor.js");
require("../stores/index.js");
const stores_modules_session = require("../stores/modules/session.js");
const setRedDot = () => {
  const sessionStore = stores_modules_session.useSessionStore();
  const { notVisitedCount } = sessionStore;
  if (notVisitedCount > 0) {
    common_vendor.index.setTabBarBadge({
      index: 1,
      text: String(notVisitedCount),
      fail: () => {
      }
    });
  } else {
    removeRedDot();
  }
};
const removeRedDot = () => {
  common_vendor.index.removeTabBarBadge({
    index: 1,
    fail: () => {
    }
  });
};
exports.removeRedDot = removeRedDot;
exports.setRedDot = setRedDot;
