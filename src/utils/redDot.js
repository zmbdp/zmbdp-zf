import { useSessionStore } from '@/stores'

/**
 * 设置红点
 */
export const setRedDot = () => {
  const sessionStore = useSessionStore()
  const { notVisitedCount } = sessionStore
  // 未访问的消息数量大于 0
  if (notVisitedCount > 0) {
    uni.setTabBarBadge({
      index: 1,
      text: String(notVisitedCount),
      fail: () => {}
    })
  } else {
    removeRedDot()
  }
}

/**
 * 移除红点
 */
export const removeRedDot = () => {
  uni.removeTabBarBadge({
    index: 1,
    fail: () => {}
  })
}
