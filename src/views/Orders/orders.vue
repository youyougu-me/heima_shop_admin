<template>
  <div id="orderlist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="height:20px;"></div>
    <el-row :gutter="20" align="middle">
      <el-col :span="9">
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
      <el-col :span="5"></el-col>
      <el-col :span="10"></el-col>
    </el-row>
    <!-- 表格 -->
    <div style="height:10px;"></div>
    <el-table :data="tableData" border style="width: 100%">
      >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status=='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" :formatter="returnDate"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑收货地址"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row.order_id)"
            ></el-button>
          </el-tooltip>
          <!-- 这个才是查看物流的============== -->
          <el-tooltip
            class="item"
            effect="dark"
            content="查看物流进度"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-location"
              size="mini"
              @click="checkLogisticsInfo(scope.row.order_id)"
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
    <LocationDialog ref="locationDialog"></LocationDialog>
    <!-- 物流进度的dialog框 -->
    <LocationProgressDialog ref="progress" :logisticsId="logisticsId"></LocationProgressDialog>
  </div>
</template>

<script>
import { timestampToTime } from "@/utils/toolFunc";
import { GetOrderList } from "@/api/order";
import { confirm } from "@/utils/elefunc";
import Pagination from "@c/Pagination/pagination";
import LocationDialog from "./dialog/editLocation";
import LocationProgressDialog from "./dialog/locationProgressDialog";
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
      userRolesListS2: [],
      //用来存储每个单号的物流id
      logisticsId: ""
    };
  },
  methods: {
    //获取表格数据
    getTableData() {
      const requestData = this.searchAllContent;
      GetOrderList(requestData).then(res => {
        this.tableData = res.data.data.goods;
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
    //清空搜索文本框
    clear() {
      this.getTableData();
    },
    //搜索
    search() {
      this.getTableData();
    },
    // 点击编辑对dialog框的处理
    edit(id) {
      //调子组件的方法
      this.$refs.locationDialog.faControlOpen();
      //告诉子组件我是编辑
      this.$refs.locationDialog.faControlStatus("edit");
      //把当前编辑id传给子组件
      this.currentEditData.id = id;
    },
    //查看物流信息=======================
    //其实传过来的是订单id
    //查询物流信息是需要物流id
    //这里我们弄一个假数据传过去
    checkLogisticsInfo(id) {
      this.logisticsId = "804909574412544580";
      //调子组件的方法
      this.$refs.progress.faControlOpen();
      //告诉子组件我是新增
      this.$refs.progress.faControlStatus("add");
    },
    //格式化时间列
    returnDate(row) {
      return timestampToTime(row.create_time);
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
    LocationDialog,
    LocationProgressDialog
  }
};
</script>
<style lang="scss" scoped>
#orderlist {
}
</style>