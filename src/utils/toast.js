/**
 * 成功提示
 */
export const showSuccessToast = (msg) => {
  uni.showToast({
    title: msg,
    icon: 'success'
  });
};

/**
 * 失败提示
 */
export const showErrorToast = (msg) => {
  uni.showToast({
    title: msg,
    icon: 'error'
  });
};

/**
 * 无图标提示
 */
export const showNoneIconToast = (msg) => {
  uni.showToast({
    title: msg,
    icon: 'none'
  });
};
