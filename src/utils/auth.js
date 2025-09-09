/**
 * 检测是否授权了指定名称的权限
 */
export const isAuthorized = (key) => {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        resolve(res.authSetting['scope.' + key])
      },
      fail: () => {
        reject()
      }
    })
  })
}

/**
 * 引导用户授权指定名称的权限
 */
export const authorize = (key) => {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope: 'scope.' + key,
      success: () => {
        resolve()
      },
      fail: () => {
        reject()
        // 调起客户端小程序设置界面
        uni.openSetting()
      }
    })
  })
}
