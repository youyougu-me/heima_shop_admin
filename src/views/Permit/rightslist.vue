<template>
  <div id="bread">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <!-- 表格 -->
    <el-table :data="rightsList" border stripe  v-loading="loading">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.level==0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level==1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level==2">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import { GetRightsList } from "@/api/rights";
export default {
  data() {
    return {
      //面包屑数据
      breadList: ["权限管理", "权限列表"],
      //表格数据
      rightsList: [],
      loading:false
    };
  },
  methods: {
    getRightsList() {
      this.loading = true
      GetRightsList().then(res => {
        this.rightsList = res.data.data;
        this.loading = false
      });
    }
  },
  created() {
    this.getRightsList();
  },
  mounted() {},
  components: {
    Breadcrumb
  }
};
</script>
<style lang="scss">
#bread {
  .el-breadcrumb {
    font-size: 15px;
  }
}
</style>