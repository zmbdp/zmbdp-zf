// import { defineStore } from 'pinia'
// import { getFilterPullListApi } from '@/api/home'
// import { normalize } from '@/utils/normalize'

// const state = () => ({
//   filterInfo: {
//     regionList: [], // 区域列表
//     rentRangeList: [], // 租金列表
//     rentTypeList: [], // 出租类型列表
//     roomNumList: [] // 居室列表
//   }
// })

// const actions = {
//   // 获取筛选列表 action 函数
//   getFilterPullListAction({ cityId, dirtTypes }) {
//     return new Promise((resolve, reject) => {
//       getFilterPullListApi({
//         cityId,
//         dirtTypes
//       })
//         .then((res) => {
//           // 统一处理 regionList，然后赋值给 state 中的 regionList
//           this.filterInfo.regionList = normalize(
//             res.regionList,
//             false
//           )
//           // 统一处理 rent_range，然后赋值给 state 中的 rentRangeList
//           this.filterInfo.rentRangeList = normalize(
//             res.dictMap.rent_range
//           )
//           // 统一处理 rent_type_list，然后赋值给 state 中的 rentTypeList
//           this.filterInfo.rentTypeList = normalize(
//             res.dictMap.rent_type_list
//           )

//           // 统一处理 room_num，然后赋值给 state 中的 roomNumList
//           this.filterInfo.roomNumList = normalize(
//             res.dictMap.room_num
//           )
//           resolve()
//         })
//         .catch(reject)
//     })
//   },
//   // 设置出租方式高亮
//   setRentTypeActive(rentTypeKey) {
//     if (this.filterInfo.rentRangeList.length === 0) return
//     // 查找
//     const rentTypeItem = this.filterInfo.rentTypeList.find(
//       (item) => item.key === rentTypeKey
//     )
//     // 取消[不限]的高亮
//     this.filterInfo.rentTypeList[0].selected = false
//     // 当前点击的出租方式高亮
//     rentTypeItem.selected = true

//     // 返回找到的 rentTypeItem
//     return rentTypeItem
//   },
//   // 重置筛选信息
//   resetFilterInfo() {
//     // 租金范围
//     if (this.filterInfo.rentRangeList.length > 0) {
//       this.filterInfo.rentRangeList[0].selected = true
//       this.filterInfo.rentRangeList.slice(1).forEach((item) => {
//         if (item.selected) {
//           item.selected = false
//         }
//       })
//     }

//     // 出租类型
//     if (this.filterInfo.rentTypeList.length > 0) {
//       this.filterInfo.rentTypeList[0].selected = true
//       this.filterInfo.rentTypeList.slice(1).forEach((item) => {
//         if (item.selected) {
//           item.selected = false
//         }
//       })
//     }

//     // 居室
//     if (this.filterInfo.roomNumList.length > 0) {
//       this.filterInfo.roomNumList[0].selected = true
//       this.filterInfo.roomNumList.slice(1).forEach((item) => {
//         if (item.selected) {
//           item.selected = false
//         }
//       })
//     }
//   }
// }

// export const useFilterStore = defineStore('filter', {
//   state,
//   actions
// })
