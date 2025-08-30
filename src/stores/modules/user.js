import { defineStore } from 'pinia';

const state = () => ({
  // token: 用户登录凭证
  token: '',
  // 用户信息
  userInfo: {}
});

const actions = {
  setToken(token) {
    this.token = token;
  }
};

export const useUserStore = defineStore('user', {
  state,
  actions,
  // 开启数据持久化
  persist: true
});
