/**
 * 获取手机底部安全距离
 */
export const safeBottomDistance = () => {
  // 注意：返回的底部距离，默认单位是 px
  return uni.getWindowInfo().safeAreaInsets.bottom
}

/**
 * 获取(手机)操作系统名称
 */
export const getOsName = () => {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success: (res) => {
        resolve(res.osName)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}
