<template>
  <div id="userlist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="height:20px;"></div>
    <el-row :gutter="20" align="middle">
      <el-col :span="5">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          clearable
          @clear="clear"
          v-model="query"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="add">添加用户</el-button>
      </el-col>
      <el-col :span="14"></el-col>
    </el-row>
    <!-- 表格 -->
    <div style="height:10px;"></div>
    <el-table :data="tableData" border style="width: 100%">
      >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.mg_state}}
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#409eff"
            inactive-color="#ccc"
            @change="userStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setUserRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="height:20px;"></div>
    <Pagination
      class="pull-right"
      :total="total"
      @currentPageChange="currentPageChange"
      @pageSizeChange="pageSizeChange"
    ></Pagination>
    <!-- dialog框 -->
    <Dialog ref="dialog" :currentEditData="currentEditData" @getTableData="getTableData"></Dialog>
    <!-- 设置权限的dialog框 -->
    <SetRoleDialog
      ref="dialogS2"
      :currentEditData="currentEditDataS2"
      :userRolesListS2="userRolesListS2"
      @getTableData="getTableData"
    ></SetRoleDialog>
  </div>
</template>

<script>
//引入删除确认框
import { confirm } from "@/utils/elefunc";
import {
  GetUserList,
  DeleteUser,
  GetRoleList,
  ChangeUserStatus
} from "@/api/user";
import Pagination from "@c/Pagination/pagination";
import Dialog from "./dialog/index";
import SetRoleDialog from "./dialog/setRoleDialog";
export default {
  inject: ["reload"],
  data() {
    return {
      //表格数据
      tableData: [],
      query: "",
      //分页数据
      total: 0,
      pagenum: 1,
      pagesize: 5,
      //当前点击编辑项数据
      currentEditData: {
        id: ""
      },
      // 后缀加S2的即为当前设置角色权限的数据
      currentEditDataS2: {},
      //此用户可分配的角色列表
      userRolesListS2: []
    };
  },
  methods: {
    //获取表格数据
    getTableData() {
      const requestData = this.searchAllContent;
      GetUserList(requestData).then(res => {
        this.tableData = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    //底部分页操作
    currentPageChange(currentPage) {
      this.pagenum = currentPage;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.pagesize = pageSize;
      this.getTableData();
    },
    //改变用户状态
    userStateChanged(userinfo) {
      ChangeUserStatus(userinfo).then(res => {
        this.$message({
          type: "success",
          message: "修改状态成功",
          duration: 600
        });
      });
    },
    //清空搜索文本框
    clear() {
      this.getTableData();
    },
    //搜索
    search() {
      this.getTableData();
    },
    //点击新增对dialog框的处理
    add() {
      //调子组件的方法
      this.$refs.dialog.faControlOpen();
      //告诉子组件我是新增
      this.$refs.dialog.faControlStatus("add");
    },
    // 点击编辑对dialog框的处理
    edit(id) {
      //调子组件的方法
      this.$refs.dialog.faControlOpen();
      //告诉子组件我是编辑
      this.$refs.dialog.faControlStatus("edit");
      //把当前编辑id传给子组件
      this.currentEditData.id = id;
    },
    //点击删除
    deleteUser(id) {
      confirm({
        content: "你确定要删除吗",
        fn: () => {
          DeleteUser(id).then(res => {
            this.$message2("", res.data.meta.msg);
          });
          this.reload();
        }
      });
    },
    // 点击设置分配权限=====================
    setUserRole(rowData) {
      // 在展示对话框之前，获取所有角色的列表(每种用户可分配的角色都一样多)
      // 因为都一样所以换一个用户时无需重复获取
      if (this.userRolesListS2.length == 0) {
        GetRoleList().then(res => {
          this.userRolesListS2 = res.data.data;
        });
      }
      // 调子组件的方法
      this.$refs.dialogS2.faControlOpen();
      // 告诉子组件我是编辑
      this.$refs.dialogS2.faControlStatus("edit");
      this.currentEditDataS2 = rowData;
    }
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  computed: {
    //搜索所有内容
    //因为在data里不能让某个值等于data.,所以只能这么写
    searchAllContent: function() {
      return {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
    }
  },
  components: {
    Pagination,
    Dialog,
    SetRoleDialog
  }
};
</script>
<style lang="scss" scoped>
#userlist {
}
</style>