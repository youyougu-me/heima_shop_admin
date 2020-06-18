import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/index";
import "./router/premit"
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./icons";
import echarts from 'echarts';
//这里挂载的是方法 所以需要use
import eleglobal from "@/utils/eleglobal"
//引入editor全局组件
import "@c/globalComponents/editor.js"
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.use(eleglobal)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


