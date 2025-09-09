import { msgType } from './chat'

/**
 * 消息的简化显示
 */
export const msgSimplify = {
  [msgType.image]: '图片',
  [msgType.voice]: '语音',
  [msgType.video]: '视频',
  [msgType.card]: '卡片'
}
