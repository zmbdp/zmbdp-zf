// import { defineStore } from 'pinia'
// import { getSessionListApi } from '@/api/session'
// import { msgType } from '@/constants/chat'
// import { updateSessionTime } from '@/constants/common'

// const state = () => ({
//   // 全局会话列表
//   sessionList: []
// })

// const actions = {
//   // 获取会话列表的 action 函数
//   getSessionListAction() {
//     return new Promise((resolve, reject) => {
//       // 调用接口
//       getSessionListApi()
//         .then((sessionList) => {
//           // 数据处理 + 保存会话列表
//           this.sessionList = sessionList.map((session) => {
//             const { lastMessageVO } = session
//             if (
//               [msgType.card, msgType.voice].includes(
//                 lastMessageVO.type
//               )
//             ) {
//               lastMessageVO.content = JSON.parse(
//                 lastMessageVO.content
//               )
//             }
//             return session
//           })
//           resolve()
//         })
//         .catch((error) => {
//           reject(error)
//         })
//     })
//   },
//   // 清空会话列表
//   clearSessionList() {
//     this.sessionList = []
//   },
//   /**
//    * 更新会话列表(主要更新未访问消息数量)
//    * @param {*} updateTime 更新时机
//    * @param {*} message (最后一条)消息对象
//    */
//   updateSessionList(updateTime, message) {
//     // 基于 sessionId 查询要更新的会话对象的下标
//     const i = this.sessionList.findIndex(
//       (item) => item.sessionId === message.sessionId
//     )
//     // 在收到消息的时候，sessionId 在 sessionList 数组中可能不存在(新用户第一次聊天)
//     // 如果在收到消息的时候，sessionId 在 sessionList 中不存在的话，需要在 sessionList 的末尾添加一个新的会话对象，
//     // 并且还要更新未访问的消息数量
//     if (i !== -1) {
//       switch (updateTime) {
//         case updateSessionTime.receiveMsg:
//           // 收到消息
//           this.sessionList[i] = {
//             ...this.sessionList[i],
//             lastMessageVO: message,
//             lastSessionTime: message.createTime,
//             notVisitedCount: this.sessionList[i].notVisitedCount + 1
//           }
//           break
//         case updateSessionTime.exitChatPage:
//           // 退出聊天页
//           this.sessionList[i] = {
//             ...this.sessionList[i],
//             lastMessageVO: message,
//             lastSessionTime: message.createTime,
//             notVisitedCount: 0
//           }
//           break
//       }
//     } else {
//       // 肯定是收到了新用户的消息(sessionId 不存在的情况)
//       // 在数组中添加一个新会话对象，必须包含 sessionId 和 notVisitedCount 属性
//       this.sessionList.push({
//         lastMessageVO: message,
//         lastSessionTime: message.createTime,
//         notVisitedCount: 1,
//         otherUser: message.otherUser,
//         sessionId
//       })
//     }
//   }
// }

// const getters = {
//   // 统计所有未访问的消息数量
//   notVisitedCount() {
//     return this.sessionList.reduce(
//       (prev, item) => prev + item.notVisitedCount,
//       0
//     )
//   }
// }

// export const useSessionStore = defineStore('session', {
//   state,
//   actions,
//   getters
// })
