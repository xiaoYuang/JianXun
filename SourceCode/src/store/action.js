import * as types from './mutationType'
export default{
    // 获取用户信息
  getUserInfo: ({commit}, obj) => {
    commit(types.GETUSERINFO, obj)
  },
  // 用户登录
  login: ({commit}, obj) => {
    commit(types.LOGIN, obj)
  },
  // 获取公钥
  getPublicKey: ({commit}, obj) => {
    commit(types.GETPUBLICKEY, obj)
  },
  // 获取总数统计
  getTotalData: ({commit}, obj) => {
    commit(types.GETTOTALDATA, obj)
  },
  // 用户登出
  logout: ({commit}, obj) => {
    commit(types.LOGOUT, obj)
  },
  // 获取周期统计
  getWeekData: ({commit}, obj) => {
    commit(types.GETWEEKDATA, obj)
  },
  // 检查是否已经登录
  checkIsLogin: ({commit}, obj) => {
    commit(types.CHECKISLOGIN, obj)
  },
  // 轮询
  pollingTime: ({commit}, obj) => {
    commit(types.POLLINGTIME, obj)
  }
}