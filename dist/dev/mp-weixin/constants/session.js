"use strict";
const constants_chat = require("./chat.js");
const msgSimplify = {
  [constants_chat.msgType.image]: "图片",
  [constants_chat.msgType.voice]: "语音",
  [constants_chat.msgType.video]: "视频",
  [constants_chat.msgType.card]: "卡片"
};
exports.msgSimplify = msgSimplify;
