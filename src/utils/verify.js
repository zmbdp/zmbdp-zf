// 校验模块
import { showNoneIconToast } from './toast'
// 是否为空
export const isEmpty = (value) => {
  return value === '' || value === null || value === undefined
}

// 公共的校验函数（高阶函数）
export const verify = (reg) => {
  return (value) => {
    return reg.test(value)
  }
}

// 是否合法（否则当前数据格式要求）
const isValidPhone = verify(/^1[3-9]\d{9}$/)
const isValidCode = verify(/^\d{6}$/)

// 校验手机号
export const verifyPhone = (phone) => {
  if (isEmpty(phone)) {
    showNoneIconToast('手机号不能为空')
    return false
  } else if (!isValidPhone(phone)) {
    showNoneIconToast('手机号格式不对')
    return false
  }
  return true
}

// 校验验证码
export const verifyCode = (code) => {
  if (isEmpty(code)) {
    showNoneIconToast('验证码不能为空')
    return false
  } else if (!isValidCode(code)) {
    showNoneIconToast('验证码格式不对')
    return false
  }
  return true
}
