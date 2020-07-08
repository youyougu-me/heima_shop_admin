<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <el-button type="primary" @click="add">添加分类</el-button>
    <div style="height:20px;"></div>
    <!-- 嵌套表格 -->
    <ZkTable
      :data="cateGoryData"
      :columns="columns"
      :border="true"
      :selection-type="false"
      :expand-type="false"
      index-text="#"
      :show-index="true"
      v-loading="tree_table_loading"
      :show-row-hover="false"
    >
      <!-- 是否有效 -->
      <template slot="isOk" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green;"></i>
        <i class="el-icon-error" v-else style="color:red;"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag type="primary" v-if="scope.row.cat_level == 0">一级</el-tag>
        <el-tag type="success" v-if="scope.row.cat_level == 1">二级</el-tag>
        <el-tag type="warning" v-if="scope.row.cat_level == 2">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="operation">
        <el-button icon="el-icon-edit" type="primary" size="mini" disabled>编辑</el-button>
        <el-button icon="el-icon-delete" type="danger" size="mini" disabled>删除</el-button>
      </template>
    </ZkTable>

    <!-- 分页 -->
    <div style="height:20px;"></div>
    <Pagination
      class="pull-right"
      :total="paginationTotal"
      @currentPageChange="currentPageChange"
      @pageSizeChange="pageSizeChange"
    ></Pagination>

    <!-- dialog框 -->
    <Dialog ref="dialog" @requestDataFunc="requestDataFunc"></Dialog>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import { GetGoodsCategory } from "@/api/goods";
import Pagination from "@c/Pagination/pagination";
import Dialog from "./Dialog/index";
//导入树形嵌套表格
import ZkTable from "vue-table-with-tree-grid";
export default {
  inject: ["reload"],
  data() {
    return {
      breadList: ["商品管理", "商品分类"],
      //表格的数据请求
      requestData: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //渲染表格所用的表格数据
      cateGoryData: [],
      //总条数
      paginationTotal: 0,
      //嵌套表格
      tree_table_loading: false,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operation"
        }
      ],
      logintimes: 0
    };
  },
  methods: {
    requestDataFunc() {
      this.tree_table_loading = true;
      GetGoodsCategory(this.requestData)
        .then(res => {
          this.cateGoryData = res.data.data.result;
          this.paginationTotal = res.data.data.total;
          this.tree_table_loading = false;
        })
        .catch(error => {
          this.tree_table_loading = false;
          // if (
          //   error.code === "ECONNABORTED" &&
          //   error.message.indexOf("timeout") !== -1
          // ) {
          //   this.$message2("error", "请求分类超时,正在重新尝试...", 2000);
          //   if (this.logintimes > 1) {
          //     this.$message2(
          //       "error",
          //       "尝试多次,请求分类失败,请联系管理员",
          //       10000
          //     );
          //     this.$router.push({
          //       name: "Console"
          //     });
          //   }
          //   this.logintimes = this.logintimes + 1;
          //   console.log(this.logintimes);
          //   this.requestDataFunc();
          // }
        });
    },
    //底部分页操作
    currentPageChange(currentPage) {
      this.requestData.pagenum = currentPage;
      this.requestDataFunc();
    },
    pageSizeChange(pageSize) {
      this.requestData.pagesize = pageSize;
      this.requestDataFunc();
    },
    //点击新增对dialog框的处理
    add() {
      //调子组件的方法
      this.$refs.dialog.faControlOpen();
      //告诉子组件我是新增
      this.$refs.dialog.faControlStatus("add");
    }
  },
  created() {
    this.requestDataFunc();
  },
  mounted() {},
  components: {
    Breadcrumb,
    ZkTable,
    Pagination,
    Dialog
  }
};
</script>
<style lang="scss" scoped>
.zk-table {
  font-size: 14px;
}
</style>