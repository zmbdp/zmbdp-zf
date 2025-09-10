// OSS云服务器的基础地址
export const OSS_BASE_URL =
  'https://framework-java-web.oss-cn-shanghai.aliyuncs.com/'

/**
 * 统一管理自定义 UniApp 事件
 */
export const UniAppEvent = {
  LoginSuccess: 'LoginSuccess', // 登录成功事件
  RecordAutoEnd: 'RecordAutoEnd', // 录音自动结束事件
  LogoutSuccess: 'LogoutSuccess', // 退出登录成功事件
  PlayVoice: 'PlayVoice', // 通知其他语音停止播放事件
  ReceiveMsg: 'ReceiveMsg', // 收到聊天消息事件
  ExitChatPage: 'ExitChatPage' // 退出聊天页
}

/**
 * 正则规则
 */
export const pattern = {
  num: /[0-9]/g, // 数字
  lett: /[a-z]/gi, // 字母(包含大小写)
  chin: /[\u4e00-\u9fa5]/g, // 汉字(中文)
  spec: /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’'，。、]/im // 特殊字符
}

/**
 * 手机上常见的图片扩展名
 */
export const imageExtName = ['png', 'jpeg', 'jpg', 'bmp', 'raw']
/**
 * 手机上常见的音频扩展名
 */
export const audioExtName = ['mp3', 'wav', 'aac', 'flac', 'ogg']
/**
 * 手机上常见的视频扩展名
 */
export const videoExtName = [
  'mp4',
  'avi',
  'flv',
  'mov',
  '3gp',
  'mkv',
  'rmvb'
]

/**
 * 小程序权限名称
 */
export const authName = {
  record: 'record'
}

/**
 * websocket服务器地址
 */
export const WS_URL = 'ws://111.231.13.141:10030/chat/websocket'

/**
 * 主流手机的操作系统
 */
export const os = {
  ios: 'ios',
  android: 'android',
  harmonyos: 'harmonyos'
}

/**
 * 更新会话列表的时机
 */
export const updateSessionTime = {
  receiveMsg: 'receiveMsg', // 收到消息
  exitChatPage: 'exitChatPage' // 退出聊天页
}
