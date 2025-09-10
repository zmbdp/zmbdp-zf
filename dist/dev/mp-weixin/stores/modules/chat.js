"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_chat = require("../../constants/chat.js");
const utils_toast = require("../../utils/toast.js");
const constants_common = require("../../constants/common.js");
let recorderTimer = null;
const state = () => ({
  // 房东信息
  fangDong: {},
  // 房屋信息
  house: {},
  // 全局共享的录音管理器
  recorder: null,
  // 发送语音的函数（通过该函数将录制到语音信息传递给外界）
  sendVoice: null
});
const actions = {
  // 设置房东信息
  setFangDong(fangdong) {
    this.fangDong = {
      ...this.fangDong,
      ...fangdong
    };
  },
  // 设置房屋信息
  setHouse(house) {
    this.house = {
      ...this.house,
      ...house
    };
  },
  // 初始化录音管理器
  initRecorder() {
    this.recorder = common_vendor.index.getRecorderManager();
    this.recorder.onStart(() => {
      if (recorderTimer)
        clearTimeout(recorderTimer);
      recorderTimer = setTimeout(() => {
        this.recorder.stop();
      }, constants_chat.maxVoiceDuration * 1e3);
    });
    this.recorder.onStop((res) => {
      const { tempFilePath, duration } = res;
      if (duration < 1e3) {
        utils_toast.showNoneIconToast("录音时间太短");
        clearTimeout(recorderTimer);
      } else if (duration >= constants_chat.maxVoiceDuration * 1e3) {
        utils_toast.showNoneIconToast(`录音最长不超过${constants_chat.maxVoiceDuration}秒`);
        this.recorder.stop();
        common_vendor.index.$emit(constants_common.UniAppEvent.RecordAutoEnd);
        this.sendVoice({
          tempFilePath,
          duration: constants_chat.maxVoiceDuration
        });
      } else {
        this.sendVoice({
          tempFilePath,
          // 把毫秒换算成秒，需要除以1000，然后四舍五入取整
          duration: Math.round(duration / 1e3)
        });
        clearTimeout(recorderTimer);
      }
    });
  },
  // 注册发送语音的函数
  registerSendVoiceEvent(sendVoiceFn) {
    this.sendVoice = sendVoiceFn;
  }
};
const useChatStore = common_vendor.defineStore("chat", {
  state,
  actions,
  // 开启数据持久化
  persist: true
});
exports.useChatStore = useChatStore;
