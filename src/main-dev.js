import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./icons";
import echarts from 'echarts';
//这里挂载的是方法 所以需要use
import eleglobal from "@/utils/eleglobal"
//引入editor全局组件
import "@c/globalComponents/editor.js"
//导入 NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import "./router/premit"
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


