/**
 * 数据统一处理
 * 目的：在后端返回的数组对前面，添加 "不限的对象"
 */
export const normalize = (arr, isAddKey = true) => {
  return isAddKey
    ? [
        {
          id: -1, // id 是 -1，只是为了与后端返回的数据id做区分
          key: null, // 空
          name: '不限',
          selected: true // 不限默认是选中的
        },
        ...arr.map((item) => ({
          ...item,
          selected: false // 记录单元格是否选中
        }))
      ]
    : [
        {
          id: -1,
          key: null,
          name: '不限'
        },
        ...arr
      ]
}
