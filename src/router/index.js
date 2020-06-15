import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '@/views/Layout'

Vue.use(VueRouter);
//默认路由
export const defaultRoutes = [
  {
    path: "/",
    redirect: "/console",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/register",
    name: "Register",
    hidden: true,
    component: () => import("../views/Register/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    component: Layout,
    redirect: "index",
    children: [{
      path: "/index",
      component: () => import("../views/Console/index.vue")
    }]
  },
  {
    path: "/user",
    name: "User",
    component: Layout,
    redirect: "users",
    children: [{
      path: "/users",
      component: () => import("../views/User/users.vue")
    }]
  },
  //权限角色
  {
    path: "/permit",
    name: "Permit",
    component: Layout,
    redirect: "rights",
    children: [{
      path: "/rights",
      component: () => import("../views/Permit/rightslist.vue")
    }, {
      path: "/roles",
      component: () => import("../views/Permit/roleslist.vue")
    }]
  },
  //商品
  {
    path: "/goodsmanager",
    name: "Goods",
    component: Layout,
    redirect: "categories",
    children: [
      {
        path: "/categories",
        component: () => import("../views/Goods/cate.vue")
      },
      {
        path: "/params",
        component: () => import("../views/Goods/params.vue")
      }
    ]
  },

  //404页面
  {
    path: "/page404",
    name: "Page404",
    hidden: true,
    component: () => import("../views/Page404/index.vue")
  },
  {
    path: "*",
    redirect: 'page404',
    hidden: true,
  }
]

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: defaultRoutes
});

export default router;
