import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();

pinia.use(
  createPersistedState({
    // 重写持久化的存储规则：默认采用的是 localStorage 的存储方式，
    // 无论是 localStorage 还是 sessionStorage 都只适用于浏览器端,
    // 而小程序并不是运行在浏览器端的，所以需要用小程序本身的存储规则
    storage: {
      setItem: uni.setStorageSync,
      getItem: uni.getStorageSync
    }
  })
);

export default pinia;

// 统一导出 store 子模块
export * from './modules/user';
export * from './modules/location';
export * from './modules/filter';
export * from './modules/chat';
export * from './modules/session';

// 等同于下面两行代码的意思

// import { useUserStore } from './modules/user'
// export { useUserStore }
