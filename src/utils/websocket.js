import { WS_URL, UniAppEvent } from '@/constants/common'
import { useUserStore } from '@/stores'
import { websocketMsgType, msgType } from '@/constants/chat'

class WebSocket {
  constructor(options = {}) {
    this.options = options
    this.socketTask = null
    this.isOpenSocket = false
    this.heartbeatInterval = options.heartbeatInterval || 10000
    this.reconnectInterval = options.reconnectInterval || 5000
    this.reconnectAttempts = options.reconnectAttempts || 5 // 限制重连次数
    this.needbeat = options.needbeat || true
    this.reconnectCount = 0
    this.isNormalClosed = false
    this.isReconnecting = false // 防止重复重连
    
    // 消息队列相关
    this.messageQueue = []
    this.isProcessingQueue = false
    this.maxRetries = 3
    this.sendInterval = 300 // 增加发送间隔
    
    // 新增：连接管理相关
    this.connectionId = null // 连接ID
    this.lastActivityTime = Date.now() // 最后活动时间
    this.maxInactiveTime = 300000 // 最大空闲时间（5分钟）
  }

  // 创建 websocket 连接
  initSocketConnect() {
    // 如果已有活跃连接，直接返回
    if (this.socketTask && this.isOpenSocket) {
      console.log('WebSocket连接已存在，复用现有连接');
      return;
    }
    
    // 如果正在重连，直接返回
    if (this.isReconnecting) {
      return
    }
    
    const userStore = useUserStore()
    if (!userStore.token) return
    
    // 如果已有连接，先关闭
    if (this.socketTask) {
      this.close()
    }
    
    this.isReconnecting = true
    
    // 生成连接ID
    this.connectionId = Date.now() + Math.random();
    
    this.socketTask = uni.connectSocket({
      url: WS_URL,
      header: {
        Authorization: userStore.token
      },
      success: () => {
        console.log('============WebSocket正在连接中...===============')
      },
      fail: (err) => {
        console.error('WebSocket连接失败', err)
        this.isReconnecting = false
        this.reconnect()
      }
    })
    
    // 监听WebSocket打开事件
    this.socketTask.onOpen(() => {
      console.log('==============WebSocket连接成功===================')
      this.isOpenSocket = true
      this.isReconnecting = false
      this.reconnectCount = 0 // 连接成功后重置重连计数
      this.lastActivityTime = Date.now() // 更新活动时间
      
      // 连接成功后，开始处理消息队列
      this.processMessageQueue()
      
      // 启动心跳检测
      this.startHeartbeat()
      
      // 监听接收消息
      this.socketTask.onMessage((res) => {
        this.lastActivityTime = Date.now() // 更新活动时间
        
        const resData = JSON.parse(res.data)
        if (resData.type === websocketMsgType.heart_beat) {
          console.log('收到了心跳消息，代表服务器正常运作')
        } else {
          const message = JSON.parse(resData.data)
          if ([msgType.voice, msgType.card].includes(message.type)) {
            message.content = JSON.parse(message.content)
          }
          uni.$emit(UniAppEvent.ReceiveMsg, {
            ...message,
            createTime: +message.createTime
          })
        }
        if (this.needbeat) {
          this.resetHeartbeat()
        }
      })
    })
    
    // 监听WebSocket关闭事件
    this.socketTask.onClose((res) => {
      this.isOpenSocket = false
      console.log('==============WebSocket连接已关闭=================', res)
      if (!this.isNormalClosed && !this.isReconnecting) {
        this.reconnect()
      }
    })

    // 监听WebSocket错误事件
    this.socketTask.onError((err) => {
      console.error('===============WebSocket发生错误====================', err)
      this.isReconnecting = false
      
      // 如果是连接数量超限，等待更长时间再重连
      if (err.errMsg.includes('exceed max task count')) {
        console.log('连接数量超限，等待30秒后重连')
        setTimeout(() => {
          this.reconnect()
        }, 30000) // 等待30秒
        return
      }
      
      if (this.reconnectCount < this.reconnectAttempts) {
        this.reconnect()
      } else {
        console.error('重连次数已达上限，停止重连')
        // 清空消息队列
        this.clearMessageQueue()
      }
    })
  }

  // 发送消息（带队列）
  send({ type, data }) {
    return new Promise((resolve, reject) => {
      // 将消息加入队列
      this.messageQueue.push({
        type,
        data,
        resolve,
        reject,
        retries: 0,
        timestamp: Date.now()
      })

      // 如果当前没有在处理队列，开始处理
      if (!this.isProcessingQueue) {
        this.processMessageQueue()
      }
    })
  }

  // 处理消息队列
  async processMessageQueue() {
    if (this.messageQueue.length === 0 || this.isProcessingQueue) {
      return
    }

    this.isProcessingQueue = true

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue[0]

      try {
        // 检查连接状态
        if (!this.socketTask || !this.isOpenSocket) {
          console.warn('WebSocket未连接，等待重连...')
          await this.waitForConnection()
          continue
        }

        // 发送消息
        await this.sendSingleMessage(message)
        
        // 移除已发送的消息
        this.messageQueue.shift()
        
        // 添加发送间隔，避免触发频率限制
        if (this.messageQueue.length > 0) {
          await this.delay(this.sendInterval)
        }

      } catch (error) {
        console.error('处理消息队列时发生错误:', error)
        
        // 重试逻辑
        if (message.retries < this.maxRetries) {
          message.retries++
          console.log(`消息发送失败，第${message.retries}次重试`)
          await this.delay(1000 * message.retries) // 递增延迟
        } else {
          console.error('消息发送失败，已达到最大重试次数')
          this.messageQueue.shift()
          message.reject(new Error('消息发送失败，已达到最大重试次数'))
        }
      }
    }

    this.isProcessingQueue = false
  }

  // 发送单条消息
  sendSingleMessage(message) {
    return new Promise((resolve, reject) => {
      this.socketTask.send({
        data: JSON.stringify({
          type: message.type,
          data: message.data
        }),
        success: () => {
          console.log('消息发送成功')
          this.lastActivityTime = Date.now() // 更新活动时间
          message.resolve()
          resolve()
        },
        fail: (err) => {
          console.error(message.data, ' 消息发送失败', err)
          reject(err)
        }
      })
    })
  }

  // 等待连接建立
  waitForConnection() {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.socketTask && this.isOpenSocket) {
          resolve()
        } else {
          setTimeout(checkConnection, 500) // 增加检查间隔
        }
      }
      checkConnection()
    })
  }

  // 清空消息队列
  clearMessageQueue() {
    this.messageQueue.forEach(message => {
      message.reject(new Error('WebSocket连接失败，无法发送消息'))
    })
    this.messageQueue = []
  }

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 心跳检测
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat()
    }, this.heartbeatInterval)
  }
  
  resetHeartbeat() {
    clearInterval(this.heartbeatTimer)
    this.startHeartbeat()
  }
  
  sendHeartbeat() {
    this.send({
      type: websocketMsgType.heart_beat,
      data: 'ping'
    })
  }
  
  // 重连逻辑（优化版）
  reconnect() {
    // 如果连接已经健康，不需要重连
    if (this.isConnectionHealthy()) {
      console.log('连接已健康，无需重连');
      return;
    }
    
    if (this.reconnectCount < this.reconnectAttempts && !this.isReconnecting) {
      this.reconnectCount++
      console.log(`第${this.reconnectCount}次重连尝试`)
      
      // 指数退避算法，避免频繁重连
      const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectCount - 1), 30000);
      
      setTimeout(() => {
        this.initSocketConnect()
      }, delay)
    }
  }
  
  // 新增：检查连接是否健康
  isConnectionHealthy() {
    return this.socketTask && this.isOpenSocket && !this.isReconnecting;
  }

  // 新增：获取连接状态信息
  getConnectionInfo() {
    return {
      isConnected: this.isOpenSocket,
      isReconnecting: this.isReconnecting,
      connectionId: this.connectionId,
      reconnectCount: this.reconnectCount,
      queueLength: this.messageQueue.length,
      lastActivity: this.lastActivityTime,
      isHealthy: this.isConnectionHealthy()
    };
  }

  // 新增：检查连接是否空闲过久
  isConnectionIdle() {
    return Date.now() - this.lastActivityTime > this.maxInactiveTime;
  }

  // 新增：强制重连（用于特殊情况）
  forceReconnect() {
    console.log('强制重连WebSocket连接');
    this.reconnectCount = 0;
    this.close();
    setTimeout(() => {
      this.initSocketConnect();
    }, 1000);
  }
  
  // 关闭连接
  close() {
    this.isOpenSocket = false
    this.isNormalClosed = true
    this.isReconnecting = false
    
    // 清空消息队列
    this.clearMessageQueue()
    
    if (this.socketTask) {
      this.socketTask.close({
        success: () => {
          console.log('WebSocket连接已关闭/已断开')
        },
        fail: (err) => {
          console.error('WS关闭失败->', err)
        }
      })
      this.socketTask = null
      clearInterval(this.heartbeatTimer)
    }
  }
}

export default new WebSocket()