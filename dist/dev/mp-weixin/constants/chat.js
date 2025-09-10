"use strict";
const chatMode = {
  text: "text",
  // 文本模式
  voice: "voice",
  //语音模式
  emoji: "emoji",
  // 表情包模式
  extension: "extension"
  // 扩展菜单模式
};
const emojiList = [
  { id: 1, remark: "😀", name: "嘿嘿" },
  { id: 2, remark: "😃", name: "哈哈" },
  { id: 3, remark: "😄", name: "大笑" },
  { id: 4, remark: "😁", name: "嘻嘻" },
  { id: 5, remark: "😆", name: "斜眼笑" },
  { id: 6, remark: "😅", name: "苦笑" },
  { id: 7, remark: "😂", name: "笑哭了" },
  { id: 8, remark: "🤣", name: "笑得满地打滚" },
  { id: 9, remark: "😊", name: "羞涩微笑" },
  { id: 10, remark: "🙃", name: "倒脸" },
  { id: 11, remark: "😉", name: "眨眼" },
  { id: 12, remark: "😍", name: "花痴" },
  { id: 13, remark: "🥰", name: "喜笑颜开" },
  { id: 14, remark: "😘", name: "飞吻" },
  { id: 15, remark: "😗", name: "亲亲" },
  { id: 16, remark: "😛", name: "吐舌" },
  { id: 17, remark: "🤪", name: "滑稽" },
  { id: 18, remark: "🤓", name: "书呆子脸" },
  { id: 19, remark: "😎", name: "墨镜笑脸" },
  { id: 20, remark: "🤩", name: "好崇拜" },
  { id: 21, remark: "🥳", name: "聚会笑脸" },
  { id: 22, remark: "😏", name: "得意" },
  { id: 23, remark: "😫", name: "累" },
  { id: 24, remark: "😩", name: "累死了" },
  { id: 25, remark: "🤔", name: "想一想" },
  { id: 26, remark: "😶", name: "沉默" },
  { id: 27, remark: "😐", name: "冷漠" },
  { id: 28, remark: "🙄", name: "翻白眼" },
  { id: 29, remark: "😮", name: "吃惊" },
  { id: 30, remark: "😪", name: "困" },
  { id: 31, remark: "🥴", name: "头眼昏花" },
  { id: 32, remark: "🤡", name: "小丑脸" },
  { id: 33, remark: "👏", name: "鼓掌" },
  { id: 34, remark: "🤝", name: "握手" },
  { id: 35, remark: "👍", name: "拇指向上" },
  { id: 36, remark: "👎", name: "拇指向下" },
  { id: 37, remark: "👌", name: "ok" },
  { id: 38, remark: "🤙", name: "给我电话" }
];
const extensionList = [
  {
    id: 110001,
    name: "照片",
    iconName: "xiangce",
    key: "album"
  },
  {
    id: 110002,
    name: "相机",
    iconName: "xiangji",
    key: "camera"
  }
];
const maxVoiceDuration = 60;
const msgType = {
  text: 0,
  // 文本消息
  image: 1,
  // 图片消息
  voice: 2,
  // 语音消息
  video: 3,
  // 视频消息
  card: 4
  // 房源卡片消息
};
const websocketMsgType = {
  heart_beat: "heart_beat",
  // 心跳消息
  chat: "chat"
  // 普通聊天消息
};
const msgStatus = {
  unVisited: 10
};
const voiceMsgStatus = {
  played: 1,
  // 已播放
  unPlay: 0
  // 未播放
};
exports.chatMode = chatMode;
exports.emojiList = emojiList;
exports.extensionList = extensionList;
exports.maxVoiceDuration = maxVoiceDuration;
exports.msgStatus = msgStatus;
exports.msgType = msgType;
exports.voiceMsgStatus = voiceMsgStatus;
exports.websocketMsgType = websocketMsgType;
