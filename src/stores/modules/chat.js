// import { defineStore } from 'pinia'
// import { maxVoiceDuration } from '@/constants/chat'
// import { showNoneIconToast } from '@/utils/toast'
// import { UniAppEvent } from '@/constants/common'

// // 保存录音延迟器的 id
// let recorderTimer = null

// const state = () => ({
//   // 房东信息
//   fangDong: {},
//   // 房屋信息
//   house: {},
//   // 全局共享的录音管理器
//   recorder: null,
//   // 发送语音的函数（通过该函数将录制到语音信息传递给外界）
//   sendVoice: null
// })

// const actions = {
//   // 设置房东信息
//   setFangDong(fangdong) {
//     this.fangDong = {
//       ...this.fangDong,
//       ...fangdong
//     }
//   },
//   // 设置房屋信息
//   setHouse(house) {
//     this.house = {
//       ...this.house,
//       ...house
//     }
//   },
//   // 初始化录音管理器
//   initRecorder() {
//     // 创建录音管理器
//     this.recorder = uni.getRecorderManager()
//     // 监听录制开始: 每次调用 start 方法的时候，都会触发 onStart 事件
//     this.recorder.onStart(() => {
//       // 在开启一个新的延迟器之前，先将之前的延迟器关闭
//       if (recorderTimer) clearTimeout(recorderTimer)
//       // 开启一个 maxVoiceDuration 时长后的延迟执行函数，如果手指一直没有离开“按住说话”的盒子
//       recorderTimer = setTimeout(() => {
//         // 时间到了自动结束录制
//         this.recorder.stop()
//       }, maxVoiceDuration * 1000)
//     })
//     // 监听录制结束：每次调用 stop 方法的时候，都会触发 onStop 事件
//     this.recorder.onStop((res) => {
//       // 解构参数
//       // tempFilePath: 生成的临时语音路径
//       // duration: 录制语音的时长，单位是毫秒
//       const { tempFilePath, duration } = res
//       // 如果小于1000毫秒
//       if (duration < 1000) {
//         // 提示语
//         showNoneIconToast('录音时间太短')
//         // 关闭延迟器
//         clearTimeout(recorderTimer)
//       } else if (duration >= maxVoiceDuration * 1000) {
//         // 提示语
//         showNoneIconToast(`录音最长不超过${maxVoiceDuration}秒`)
//         // 调用结束录制的方法
//         this.recorder.stop()
//         // 通知聊天页录音结束了
//         uni.$emit(UniAppEvent.RecordAutoEnd)
//         // 发送语音
//         this.sendVoice({
//           tempFilePath,
//           duration: maxVoiceDuration
//         })
//       } else {
//         // 发送语音
//         this.sendVoice({
//           tempFilePath,
//           // 把毫秒换算成秒，需要除以1000，然后四舍五入取整
//           duration: Math.round(duration / 1000)
//         })
//         // 关闭定时器
//         clearTimeout(recorderTimer)
//       }
//     })
//   },
//   // 注册发送语音的函数
//   registerSendVoiceEvent(sendVoiceFn) {
//     this.sendVoice = sendVoiceFn
//   }
// }

// export const useChatStore = defineStore('chat', {
//   state,
//   actions,
//   // 开启数据持久化
//   persist: true
// })
