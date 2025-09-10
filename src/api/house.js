import request from '@/utils/request';

/**
 * 获取房源详情
 */
export const getHouseDetailApi = (houseId) => {
  return request({
    method: 'GET',
    url: '/portal/housepage/get/nologin',
    data: {
      houseId
    }
  });
};
