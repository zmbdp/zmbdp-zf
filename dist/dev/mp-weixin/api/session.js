"use strict";
const utils_request = require("../utils/request.js");
const getSessionListApi = () => {
  return utils_request.request({
    method: "POST",
    url: "/chat/session/list"
  });
};
const putSessionBatchVisitedApi = (sessionId) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/message/batch_visited",
    data: {
      sessionId
    }
  });
};
const putMessageBatchReadApi = ({ sessionId, messageIds }) => {
  return utils_request.request({
    method: "POST",
    url: "/chat/message/batch_read",
    data: {
      sessionId,
      messageIds
    }
  });
};
exports.getSessionListApi = getSessionListApi;
exports.putMessageBatchReadApi = putMessageBatchReadApi;
exports.putSessionBatchVisitedApi = putSessionBatchVisitedApi;
