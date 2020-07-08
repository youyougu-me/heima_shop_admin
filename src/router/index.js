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
    // component: () => import("../views/Login/index.vue")
    component: () => import(/* webpackChunkName: "group-1" */ "../views/Login/index.vue")

  },
  {
    path: "/console",
    name: "Console",
    component: Layout,
    redirect: "index",
    children: [{
      path: "/index",
      component: () => import(/* webpackChunkName: "group-1" */ "../views/Console/index.vue")
    }]
  },
  {
    path: "/user",
    name: "User",
    component: Layout,
    redirect: "users",
    children: [{
      path: "/users",
      component: () => import(/* webpackChunkName: "group-2" */ "../views/User/users.vue"),
      meta: {
        keepAlive: true
      }
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
      component: () => import(/* webpackChunkName: "group-3" */ "../views/Permit/rightslist.vue"),
      meta: {
        keepAlive: true
      }
    }, {
      path: "/roles",
      component: () => import(/* webpackChunkName: "group-3" */ "../views/Permit/roleslist.vue"),
      meta: {
        keepAlive: true
      }
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
        component: () => import(/* webpackChunkName: "group-4" */ "../views/Goods/cate.vue"),
        meta: {
          keepAlive: true
        }

      },
      {
        path: "/params",
        component: () => import(/* webpackChunkName: "group-4" */ "../views/Goods/params.vue")
      },
      {
        path: "/goods",
        component: () => import(/* webpackChunkName: "group-4" */ "../views/Goods/goodsList.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/goods/add",
        component: () => import(/* webpackChunkName: "group-4" */ "../views/Goods/Add/index.vue")
      }
    ]
  },
  //订单管理
  {
    path: "/ordersmanager",
    name: "Orders",
    component: Layout,
    redirect: "orders",
    children: [
      {
        path: "/orders",
        component: () => import(/* webpackChunkName: "group-4" */ "../views/Orders/orders.vue"),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  //数据报表 
  {
    path: "/datareport",
    name: "Datareport",
    component: Layout,
    redirect: "reports",
    children: [
      {
        path: "/reports",
        component: () => import(/* webpackChunkName: "group-5" */ "../views/DataReport/index.vue"),
        meta: {
          keepAlive: true
        }
      }
    ]
  },

  //404页面
  {
    path: "/page404",
    name: "Page404",
    hidden: true,
    component: () => import(/* webpackChunkName: "group-5" */ "../views/Page404/index.vue")
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
