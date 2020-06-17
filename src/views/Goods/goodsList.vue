<template>
  <div id="goodslist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
        <el-button type="primary" @click="add">添加商品</el-button>
      </el-col>
      <el-col :span="14"></el-col>
    </el-row>
    <!-- 表格 -->
    <div style="height:10px;"></div>
    <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
      >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" :formatter="returnDate"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" disabled></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.goods_id)"
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
  </div>
</template>

<script>
//===============================================
import { confirm } from "@/utils/elefunc";
import Pagination from "@c/Pagination/pagination";
import Dialog from "./Dialog/goodsListDialog";
import { GetGoodsList, DeleteGoodsById } from "@/api/goods";
import { timestampToTime } from "@/utils/toolFunc";
export default {
  inject: ["reload"],
  data() {
    return {
      //表格数据
      tableData: [],
      tableLoading: false,
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
      this.tableLoading = true;
      const requestData = this.searchAllContent;
      GetGoodsList(requestData).then(res => {
        this.tableData = res.data.data.goods;
        this.total = res.data.data.total;
        this.tableLoading = false;
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
    //清空搜索文本框
    clear() {
      this.getTableData();
    },
    //搜索
    search() {
      this.getTableData();
    },
    //需跳转处理
    add() {
      this.$router.push("/goods/add");
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
          DeleteGoodsById(id).then(res => {
            this.$message2("", res.data.meta.msg);
          });
          this.reload();
        }
      });
    },
    //格式化时间列
    returnDate(row) {
      return timestampToTime(row.add_time);
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
    Dialog
  }
};
</script>
<style lang="scss" scoped>
#userlist {
}
</style>