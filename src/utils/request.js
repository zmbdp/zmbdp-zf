/** 公共的请求模块 */

import { useUserStore } from '@/stores'
import { showNoneIconToast } from './toast'

// 线上环境
// const BASE_URL = 'http://云服务器外网ip:80'

// 开发环境
const BASE_URL = 'http://127.0.0.1:10030'
// 添加请求拦截器
const requestInterceptor = {
  // 请求拦截器，任何请求在请求发出去之后，到达服务器之前，必须经过 invoke 函数的处理
  // 因此可以再 invoke 函数中对请求做统一处理，比如在添加基地址，请求头中统一携带token
  invoke: (options) => {
    // options： uni.request({}) 的参数对象
    uni.showLoading({
      title: '加载中...'
    })
    // 判断 url 地址是否是完整的路径，如果不是
    if (!options.url.startsWith('http')) {
      // 则需要再前面拼接基地址，构成一个完整地址
      options.url = BASE_URL + options.url
    }
    options.header = {
      ...options.header,
      // 当前传给服务器的参数列表是json格式字符串，因此可以把原有的header展示，
      // 然后再追加新属性 content-type 字段
      'content-type': 'application/json'
    }
    // 在请求头中统一携带token
    const userStore = useUserStore()
    const { token } = userStore
    if (token) {
      options.header.Authorization = token
    }
  }
}

// 添加响应拦截器
// 自定义请求函数，然后单独处理 uni.request() 的成功和失败回调
const request = ({ method = 'GET', url, header = {}, data = {} }) => {
  return new Promise((resolve, reject) => {
    uni.request({
      method,
      url,
      header,
      data,
      // 成功回调
      success: async (response) => {
        // response: 成功回调的参数对象，包含4个属性，data,statusCode,header,cookies
        //而我们关心的数据在 data 字段里面，而 data 才是本次请求后端成功响应的数据对象，
        // 具体结构是: { code, errMsg, data }
        const { code, errMsg, data } = response.data

        // 状态码是 200000 才代表成功
        if (code === 200000) {
          // 关闭加载提示
          uni.hideLoading({
            fail: () => {}
          })
          // 成功了
          // 把纯粹的data数据给到接口函数
          // 调用resolve，更改当前Promise实例为成功态
          resolve(data)
        } else {
          // 关闭加载提示
          uni.hideLoading({
            fail: () => {},
            complete: () => {
              // 失败了，给出错误提示
              showNoneIconToast(errMsg)
            }
          })
          const userStore = useUserStore()
          if ([401000, 401001, 401002, 401003].includes(code)) {
            // token过期
            // 清空token和用户信息
            await userStore.logoutAction()
            const pages = getCurrentPages()
            // 获取当前页面路由路径
            const routePath = pages[pages.length - 1].route
            // 跳转至登录页，并且带上回跳地址
            uni.navigateTo({
              url: '/pages/login/login?redirectUrl=' + routePath
            })
          }
          // 将当前 Promise 状态更改为失败态反馈给外界
          reject(new Error(errMsg))
        }
      },
      // 失败回调
      fail: (error) => {
        // 请求失败了
        // 走到 fail 失败回调与 走到 success 回调中 if判断失败有啥区别呢？
        //  走到 fail 失败回调：可能代表请求超时了；或者服务器出故障了；简单理解就是服务器压根没理你（情书妹子没收到）
        //  走到 success 回调中 if判断失败：服务器收到请求了，会的数据不是我们想要的（代表妹子收到情书了，也给你回信了，信的内容是一个“滚”字），是业务失败
        uni.hideLoading({
          fail: () => {}
        })
        // 统一处理错误
        // 错误提示
        showNoneIconToast(error.errMsg || '请求超时,请稍后重试')
        reject(new Error(error.errMsg))
      }
    })
  })
}

uni.addInterceptor('request', requestInterceptor)
uni.addInterceptor('uploadFile', requestInterceptor)

export default request
