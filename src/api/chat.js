import request from '@/utils/request'

/**
 * 获取会话信息
 */
export const getSessionInfoApi = ({ userId1, userId2 }) => {
  return request({
    method: 'POST',
    url: '/chat/session/get',
    data: {
      userId1,
      userId2
    }
  })
}

/**
 * 新建会话
 */
export const createSessionApi = ({ userId1, userId2 }) => {
  return request({
    method: 'POST',
    url: '/chat/session/add',
    data: {
      userId1,
      userId2
    }
  })
}

/**
 * 获取聊天历史列表
 */
export const getHistoryListApi = ({
  sessionId,
  lastMessageId,
  count = 10,
  needCurMessage
}) => {
  return request({
    method: 'POST',
    url: '/chat/message/list',
    data: {
      sessionId,
      lastMessageId,
      count,
      needCurMessage
    }
  })
}

/**
 * 判断会话中房子是否聊过
 */
export const getSessionHasHouseApi = ({ sessionId, houseId }) => {
  return request({
    method: 'POST',
    url: '/chat/session/has_house',
    data: {
      sessionId,
      houseId
    }
  })
}
