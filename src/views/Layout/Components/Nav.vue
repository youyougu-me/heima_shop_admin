<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <el-row type="flex" align="middle">
        <el-col :span="6">
          <img src="@/assets/images/logo.png" alt />
        </el-col>
        <el-col :span="15">
          <div class="word">彩橙管理系统</div>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>
    </h1>
    <!-- 启用了路由跳转模式,以index属性进行跳转 -->
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
      background-color="#f3b262"
      text-color="#fff"
      active-text-color="#f26a3b"
    >
      
      <!-- template不会被渲染 -->
      <!-- key不能写在template这里 -->
      <template v-for="(item,index) in menus">
        <el-submenu :key="item.id" :index="index+''" v-if="!item.hidden">
          <!-- 一级菜单 -->
          <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <!-- 那边item里没有icon的,这边也不会报错 -->
            <svg-icon :iconClass="iconsObj[item.id]" :className="iconsObj[item.id]" />
            <span slot="title" style="padding-left:10px;">{{item.authName}}</span>
          </template>
          <!-- 子集菜单 -->
          <!-- index就是路径,组件内定的 -->
          <template v-for="subItem in item.children">
            <el-menu-item :key="subItem.id" :index="'/'+subItem.path">{{subItem.authName}}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
// import {GetMenus} from "@/api/login"
export default {
  name: "navMenu",
  data() {
    return {
      iconsObj: {
        "125": "user",
        "103": "right",
        "101": "goods",
        "102": "order",
        "145": "write"
      }
    };
  },
  methods: {
    // getMenus(){
    //   GetMenus({}).then(res=>{
    //     this.menus = res.data.data
    //   })
    // }
  },
  computed: {
    isCollapse: function() {
      return this.$store.state.login.isCollapse;
    },
    defaultActive: function() {
      const route = this.$route;
      return route.path;
    },
    menus: function() {
      return this.$store.getters["login/menus"];
    }
  },
  created() {
    // this.getMenus()
    // console.log(JSON.stringify(this.$store.getters["login/menus"]));
  }
};
</script>

<style lang="scss" scoped>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: $mainColor2;
  @include webkit(transition, all 0.3s ease 0s);
  //logo区域
  .logo {
    text-align: center;
    height: $layoutHeader;
    width: $navMenu;
    // padding-left: 25px;
    // border-bottom: 3px solid $mainColor;
    @include webkit(box-sizing, border-box);
    background-color: $mainColor2;
    img {
      height: 45px;
      @include webkit(transition, all 0.3s ease 0s);
      float: right;
    }
    .word {
      font-size: 20px;
      line-height: 60px;
      // padding-right: 50px;
      color: $mainColor;
      font-weight: bold;
    }
  }

  .el-menu {
    //去除边框,不然会有一些突兀的突出
    border-right: 0;
    //侧边栏里面的图标
    svg {
      font-size: 20px;
      margin-right: 10px;
    }
  }
}

//根据侧边栏收缩状态值 动态判断 并改变侧边栏的宽度
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
}
</style>