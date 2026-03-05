"use strict";
const OSS_BASE_URL = "https://framework-java-web.oss-cn-shanghai.aliyuncs.com/";
const UniAppEvent = {
  LoginSuccess: "LoginSuccess",
  // 登录成功事件
  RecordAutoEnd: "RecordAutoEnd",
  // 录音自动结束事件
  LogoutSuccess: "LogoutSuccess",
  // 退出登录成功事件
  PlayVoice: "PlayVoice",
  // 通知其他语音停止播放事件
  ReceiveMsg: "ReceiveMsg",
  // 收到聊天消息事件
  ExitChatPage: "ExitChatPage"
  // 退出聊天页
};
const pattern = {
  num: /[0-9]/g,
  // 数字
  lett: /[a-z]/gi,
  // 字母(包含大小写)
  chin: /[\u4e00-\u9fa5]/g,
  // 汉字(中文)
  spec: /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’'，。、]/im
  // 特殊字符
};
const imageExtName = ["png", "jpeg", "jpg", "bmp", "raw"];
const audioExtName = ["mp3", "wav", "aac", "flac", "ogg"];
const videoExtName = [
  "mp4",
  "avi",
  "flv",
  "mov",
  "3gp",
  "mkv",
  "rmvb"
];
const authName = {
  record: "record"
};
const WS_URL = "ws://127.0.0.1:10030/chat/websocket";
const os = {
  ios: "ios",
  android: "android",
  harmonyos: "harmonyos"
};
const updateSessionTime = {
  receiveMsg: "receiveMsg",
  // 收到消息
  exitChatPage: "exitChatPage"
  // 退出聊天页
};
exports.OSS_BASE_URL = OSS_BASE_URL;
exports.UniAppEvent = UniAppEvent;
exports.WS_URL = WS_URL;
exports.audioExtName = audioExtName;
exports.authName = authName;
exports.imageExtName = imageExtName;
exports.os = os;
exports.pattern = pattern;
exports.updateSessionTime = updateSessionTime;
exports.videoExtName = videoExtName;
