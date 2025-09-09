import dayjs from 'dayjs'

/**
 * 格式化时间
 */
export const formatTime = (
  timestamp = Date.now(),
  formatStr = 'MM月DD日 HH:mm:ss'
) => {
  return dayjs(timestamp).format(formatStr)
}
