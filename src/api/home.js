import request from '@/utils/request'

/**
 * 基于经纬度获取城市信息
 */
export const getCityInfoApi = ({ lng, lat }) => {
  return request({
    method: 'GET',
    url: '/portal/homepage/city_desc/get/nologin',
    data: {
      lng,
      lat
    }
  })
}

/**
 * 批量获取筛选下拉列表
 */
export const getFilterPullListApi = ({ cityId, dirtTypes }) => {
  return request({
    method: 'POST',
    url: '/portal/homepage/pull_list/get/nologin',
    data: {
      cityId,
      dirtTypes
    }
  })
}

/**
 * 获取房源列表
 */
export const getHouseListApi = ({
  cityId,
  regionId,
  rentalRanges,
  rentTypes,
  rooms,
  sort,
  pageNo,
  pageSize,
  longitude,
  latitude
}) => {
  return request({
    method: 'POST',
    url: '/portal/homepage/house_list/search/nologin',
    data: {
      cityId,
      regionId,
      rentalRanges,
      rentTypes,
      rooms,
      sort,
      pageNo,
      pageSize,
      longitude,
      latitude
    }
  })
}
