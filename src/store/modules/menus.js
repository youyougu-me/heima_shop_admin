
//引入登录接口
import { GetMenus } from "@/api/login"
const state = {
  menus: []
}

const getters = {
  menus: state => state.menus

}
const mutations = {}
const actions = {
  getMenus({ commit }, data) {
    return new Promise((resolve, reject) => {
      GetMenus(data).then(response => {
        resolve(response)
      }).catch(err => {
        //返回一个错误的函数
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}