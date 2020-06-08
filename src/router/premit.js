import router from "./index"
import store from "../store/index"


//添加白名单
const whiteRouter = ['/login', '/register']

//路由守卫
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("token")) {
    if (store.getters["login/menus"] == undefined || store.getters["login/menus"].length == 0) {
      //去拿菜单
      store.dispatch("menus/getMenus").then(res => {
        const menus = res.data.data
        store.commit("login/SET_MENUS",menus)
      })
      next()
    } else {
      if (to.path === '/login') {
        //清除本地存储
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        //清除仓库储存
        //上面已经引入 把状态里面token值设置为空
        store.commit("login/SET_TOKEN", '')
        store.commit("login/SET_USERNAME", '')
        next()
      } else {
        next()
      }
    }


  } else {

    if (whiteRouter.indexOf(to.path) !== -1) {
      //有放行就会结束
      next()
    } else {
      next('/login')
    }
  }
})


