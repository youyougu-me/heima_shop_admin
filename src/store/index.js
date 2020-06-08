import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import login from './modules/login'
import menus from './modules/menus'

export default new Vuex.Store({
  modules: {
    login,
    menus
  }
});

