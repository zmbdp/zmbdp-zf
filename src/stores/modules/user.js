import { defineStore } from 'pinia'
import {
  loginByCodeApi,
  loginByWxApi,
  getUserInfoApi
} from '@/api/user'

import socket from '@/utils/websocket'
import { UniAppEvent } from '@/constants/common'
import { useSessionStore } from './session'
import { removeRedDot } from '@/utils/redDot'

const state = () => ({
  // token: 用户登录凭证
  token: '',
  // 用户信息
  userInfo: {}
})

const actions = {
  // 验证码登录action函数
  loginByCodeAction({ phone, code }) {
    return new Promise(async (resolve, reject) => {
      try {
        // 发请求验证码登录请求（调接口）
        const resp = await loginByCodeApi({ phone, code })
        // 给state中的token赋值
        this.token = resp.accessToken
        // 把当前Promise实例设置为成功态
        resolve()
      } catch (e) {
        // 把当前Promise实例设置为失败态
        reject(e)
      }
    })
  },

  // 微信一键登录action函数
  loginByWxAction(openId) {
    return new Promise(async (resolve, reject) => {
      try {
        // 发请求（调接口）
        const resp = await loginByWxApi(openId)
        // 赋值token
        this.token = resp.accessToken
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // 获取用户信息action函数
  getUserInfoAction() {
    return new Promise(async (resolve, reject) => {
      try {
        // 调用接口（发请求），并完成赋值
        this.userInfo = await getUserInfoApi()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // 退出登录action函数
  logoutAction() {
    return new Promise((resolve, reject) => {
      try {
        this.token = ''
        this.userInfo = {}
        // 主动关闭(断开) websocket 连接（释放资源）
        socket.close()
        // 触发自定义事件，让其他页面知道用户有没有退出登录
        uni.$emit(UniAppEvent.LogoutSuccess)
        // 清空会话列表
        const sessionStore = useSessionStore()
        sessionStore.clearSessionList()
        // 移除红点
        removeRedDot()
        // 移除登录成功的自定义事件
        uni.$off(UniAppEvent.LoginSuccess)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  // 修改用户信息
  setUserInfoAction(userInfo) {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo
    }
  }
}

export const useUserStore = defineStore('user', {
  state,
  actions,
  // 开启数据持久化
  persist: true
})
