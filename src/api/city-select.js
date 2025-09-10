import request from '@/utils/request'

/**
 * 获取热门城市及全城市列表
 */
export const getCityListApi = () => {
  return request({
    method: 'GET',
    url: '/portal/citypage/get/nologin'
  })
}
