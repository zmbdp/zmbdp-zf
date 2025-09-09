import request from '@/utils/request'

/**
 * 获取聊天会话列表
 */
export const getSessionListApi = () => {
  return request({
    method: 'POST',
    url: '/chat/session/list'
  })
}

/**
 * 批量设置消息已访问
 */
export const putSessionBatchVisitedApi = (sessionId) => {
  return request({
    method: 'POST',
    url: '/chat/message/batch_visited',
    data: {
      sessionId
    }
  })
}

/**
 * 批量设置为已读(针对语音消息)
 */
export const putMessageBatchReadApi = ({ sessionId, messageIds }) => {
  return request({
    method: 'POST',
    url: '/chat/message/batch_read',
    data: {
      sessionId,
      messageIds
    }
  })
}
