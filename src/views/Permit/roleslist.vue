<template>
  <div id="rolelist_container">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <el-row type="flex" align="middle" :gutter="20">
      <el-col :span="2">
        <el-button type="primary" disabled>添加角色</el-button>
      </el-col>
      <el-col :span="15">
        <span style="color:#ccc;"></span>
      </el-col>
    </el-row>
    <div style="height:20px;"></div>
    <!-- 表格 -->
    <el-table :data="rolelist" border stripe v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="(item1,index1) in scope.row.children"
            :key="item1.id"
            :class="['border_bottom',index1==0?'border_top':'']"
            type="flex"
            align="middle"
          >
            <el-col :span="5">
              <el-tag
                @close="deleteTag({roleId:scope.row.id,rightsId:item1.id},scope.row)"
                closable
              >{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- 二级和三级是在同一行的 -->
              <el-row
                v-for="(item2,index2) in item1.children"
                :key="item2.id"
                :class="[index2==0?'':'border_top']"
                type="flex"
                align="middle"
              >
                <el-col :span="8">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteTag({roleId:scope.row.id,rightsId:item2.id},scope.row)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag
                    closable
                    @close="deleteTag({roleId:scope.row.id,rightsId:item3.id},scope.row)"
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" disabled>编辑</el-button>
          <el-button icon="el-icon-delete" type="success" size="mini" disabled>删除</el-button>
          <el-button
            icon="el-icon-setting"
            type="warning"
            size="mini"
            @click="editRights(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog框 -->
    <Dialog
      ref="dialog"
      :currentId="currentId"
      :currentEditData="currentEditData"
      :defaultSelect="defaultSelect"
      @getRoleList="getRoleList"
    ></Dialog>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import { GetRoleList, DeleteRoleRight, GetRightsTree } from "@/api/rights";
import { confirm } from "@/utils/elefunc";
import Dialog from "./dialog/index";
export default {
  data() {
    return {
      //面包屑
      breadList: ["权限管理", "角色列表"],
      //表格角色列表数据
      rolelist: [],
      loading: false,
      //传给dialog框的数据,每个设置打开的都相同
      currentEditData: [],
      //当前角色默认选中项
      defaultSelect: [],
      //获取当前编辑dia框对应的角色id
      currentId: 0
    };
  },
  methods: {
    //获取角色列表
    getRoleList() {
      this.loading = true;
      GetRoleList().then(res => {
        this.rolelist = res.data.data;
        this.loading = false;
      });
    },
    //删除角色下的某个权限
    deleteTag(obj, thisRowData) {
      // console.log(obj);
      confirm({
        content: "确认删除此条权限?",
        fn: () => {
          DeleteRoleRight(obj).then(res => {
            //更新列表
            //返回的数据里有最新的用来渲染的值
            //反向修改当前渲染的表格
            thisRowData.children = res.data.data;
          });
        }
      });
    },
    //点击分配权限
    //将当前点击项的选中传过来
    //row的数据是从表格数据里面来的
    editRights(row) {
      //需要获取所有权限数据用于传给dialog组件
      //获取当前点击项的角色id
      this.currentId = row.id;
      GetRightsTree().then(res => {
        //获取到了可选的那些权限(每个角色都相同)
        //除了这个,还得让每个角色特有的权限被选中
        this.currentEditData = res.data.data;
        //row是一个对象,包含了此角色下一二三级权限
        //我们需要抽离出三级权限用于默认选中
        const arr = [];
        this.getLastNodes(row, arr);
        //点击不同的项这个值会变,传给子组件的也会变
        this.defaultSelect = arr;
      });

      this.$refs.dialog.faControlOpen();
      this.$refs.dialog.faControlStatus("add");
    },
    //定义一个递归函数
    getLastNodes(obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id);
      }
      obj.children.forEach(element => {
        this.getLastNodes(element, arr);
      });
    }
  },
  created() {
    this.getRoleList();
  },
  mounted() {},
  components: {
    Breadcrumb,
    Dialog
  }
};
</script>
<style lang="scss">
#rolelist_container {
  .el-tag {
    margin: 7px;
  }
  .border_top {
    border-top: 1px solid #eee;
  }
  .border_bottom {
    border-bottom: 1px solid #eee;
  }
}
</style>