"use strict";
const common_vendor = require("../common/vendor.js");
const formatTime = (timestamp = Date.now(), formatStr = "MM月DD日 HH:mm:ss") => {
  return common_vendor.dayjs(timestamp).format(formatStr);
};
exports.formatTime = formatTime;
