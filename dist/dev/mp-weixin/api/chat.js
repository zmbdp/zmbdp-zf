"use strict";
const utils_request = require("../utils/request.js");
const getSessionInfoApi = ({ userId1, userId2 }) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/session/get",
    data: {
      userId1,
      userId2
    }
  });
};
const createSessionApi = ({ userId1, userId2 }) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/session/add",
    data: {
      userId1,
      userId2
    }
  });
};
const getHistoryListApi = ({
  sessionId,
  lastMessageId,
  count = 10,
  needCurMessage
}) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/message/list",
    data: {
      sessionId,
      lastMessageId,
      count,
      needCurMessage
    }
  });
};
const getSessionHasHouseApi = ({ sessionId, houseId }) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/session/has_house",
    data: {
      sessionId,
      houseId
    }
  });
};
exports.createSessionApi = createSessionApi;
exports.getHistoryListApi = getHistoryListApi;
exports.getSessionHasHouseApi = getSessionHasHouseApi;
exports.getSessionInfoApi = getSessionInfoApi;
