<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <!-- 警告区域 -->
    <el-alert show-icon title="注意:只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
    <div style="height:20px;"></div>
    <!-- 选择商品分类 -->
    <el-row type="flex" align="middle">
      <el-col :span="2">请选择商品分类:</el-col>
      <el-col :span="8">
        <Cascader
          @cascaderChange="cascaderChange"
          ref="cascader"
          :cascaderShowData="allGoodsCategory"
          :cascaderSetting="cascaderSetting"
          myStyle="width:300px;"
        ></Cascader>
      </el-col>
    </el-row>
    <!-- tabs标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isSelectCategory" @click="addMany">添加参数</el-button>
        <!-- 动态参数表格================================== -->
        <div style="height:20px;"></div>
        <el-table :data="manyTableData" stripe border width="100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="tagClose(index,scope.row)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.taginputVisible"
                v-model="scope.row.taginputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tagHandleInputConfirm(scope.row)"
                @blur="tagHandleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" @click="editMany(scope.row.attr_id)">编辑</el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                @click="deleteParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isSelectCategory" @click="addOnly">添加属性</el-button>
        <!-- 静态参数表格================================== -->
        <div style="height:20px;"></div>
        <el-table :data="onlyTableData" stripe border width="100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="tagClose(index,scope.row)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.taginputVisible"
                v-model="scope.row.taginputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tagHandleInputConfirm(scope.row)"
                @blur="tagHandleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" @click="editOnly(scope.row.attr_id)">编辑</el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                @click="deleteParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- dia框 -->
    <ParamsDialogAdd ref="paramsDialogAdd" @getParamsByCategory="getParamsByCategory"></ParamsDialogAdd>
    <!-- 前面是添加的框,这个是修改的框 -->
    <ParamsDialogEdit ref="paramsDialogEdit" @getParamsByCategory="getParamsByCategory"></ParamsDialogEdit>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import Cascader from "@c/Cascader/index";
import { confirm } from "@/utils/elefunc.js";
import {
  GetGoodsCategory,
  GetParamsByCategoryId,
  GetcategoryParamsById,
  DeleteCategoryToParams,
  AddCategorytoExpandToTag
} from "@/api/goods";
import ParamsDialogAdd from "./Dialog/paramsDialogAdd";
import ParamsDialogEdit from "./Dialog/paramsDialogEdit";

export default {
  data() {
    return {
      breadList: ["商品管理", "分类参数"],
      allGoodsCategory: [],
      //级联框配置
      cascaderSetting: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false
      },
      cascaderValue: [],
      //标签页==============================
      //激活标志
      activeName: "many",
      //动态参数的表格数据
      manyTableData: [],
      onlyTableData: []
    };
  },
  methods: {
    getGoodsCategory() {
      GetGoodsCategory({}).then(res => {
        this.allGoodsCategory = res.data.data;
      });
    },
    //级联框选择的值改变
    cascaderChange(val) {
      //把子组件的选中值拿过来,勿动
      //好像只有在方法里面才可以取到子组件的值
      this.cascaderValue = this.$refs.cascader.selfCascaderValue;
      this.getParamsByCategory();

      //一但级联框无数据,便清空表格
      if (val.length == 0) {
        this.manyTableData = [];
        this.onlyTableData = [];
      }
    },
    // 切换tab页
    handleTabsClick() {
      this.getParamsByCategory();
    },
    //定义一个根据变化获取当前选中分类下对应的参数列表
    getParamsByCategory() {
      if (this.currentCategoryToparamsId == null) {
        return this.$message2("warning", "请选择分类后再查看参数");
      }
      GetParamsByCategoryId(
        this.currentCategoryToparamsId,
        this.activeName
      ).then(res => {
        // 要把里面每一个对象的attr属性做一个处理
        let tableData = res.data.data;
        tableData.forEach(element => {
          element.attr_vals =
            element.attr_vals == "" ? [] : element.attr_vals.split(" ");
          element.taginputVisible = false;
          element.taginputValue = "";
        });
        if (this.activeName == "many") {
          this.manyTableData = tableData;
        } else {
          this.onlyTableData = tableData;
        }
      });
    },
    //添加============================================
    addMany() {
      this.$refs.paramsDialogAdd.faControlOpen();
      //告诉子组件我是新增,再传一个当前添加项的三级分类id
      this.$refs.paramsDialogAdd.faControlStatus(
        "many",
        this.currentCategoryToparamsId
      );
    },
    addOnly() {
      this.$refs.paramsDialogAdd.faControlOpen();
      //告诉子组件我是新增
      this.$refs.paramsDialogAdd.faControlStatus(
        "only",
        this.currentCategoryToparamsId
      );
    },
    //编辑=============================================
    editMany(attr_id) {
      this.$refs.paramsDialogEdit.faControlOpen();
      //第二个参数是第三级分类id是一个计算属性
      this.$refs.paramsDialogEdit.faControlStatus(
        "many",
        this.currentCategoryToparamsId,
        attr_id
      );
    },
    editOnly(attr_id) {
      this.$refs.paramsDialogEdit.faControlOpen();
      //第二个参数是第三级分类id是一个计算属性
      this.$refs.paramsDialogEdit.faControlStatus(
        "only",
        this.currentCategoryToparamsId,
        attr_id
      );
    },
    // 删除==================================
    //两种都一样
    deleteParams(attr_id) {
      confirm({
        content: "你确定删除此参数?",
        fn: () => {
          DeleteCategoryToParams({
            categoryId: this.currentCategoryToparamsId,
            attrId: attr_id
          }).then(res => {
            this.$message2("", res.data.meta.msg);
            this.getParamsByCategory();
          });
        }
      });
    },
    //tag输入框失去焦点或者是键盘按下事件
    tagHandleInputConfirm(row) {
      if (row.taginputValue.trim().length == 0) {
        row.taginputValue = "";
        row.taginputVisible = false;
        return false;
      }
      //后续处理,这个是添加属性里面的标签哦
      row.attr_vals.push(row.taginputValue.trim());
      this.tagRequest(row);
    },
    // 新增tag按钮的点击事件
    showInput(row) {
      row.taginputVisible = true;
      //回调函数里面那句的意思是,从按钮切换到文本框让文本框自动获取焦点,固定写法
      //那为什么需要这个函数呢nextTick,这个函数时在页面元素重新被渲染之后才会执行里面的回调
      //因为如果不要,当现实文本框的标志变为true时,这时文本框并没有被渲染出来,根本获取不到这个对象
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除分类参数下属性下的标签
    tagClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.tagRequest(row);
    },
    //封装一个删除标签或者是添加标签发请求的函数
    tagRequest(row) {
      AddCategorytoExpandToTag(
        { categoryId: this.currentCategoryToparamsId, attrId: row.attr_id },
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" ")
        }
      ).then(res => {
        row.taginputValue = "";
        row.taginputVisible = false;
        this.$message2("", res.data.meta.msg);
      });
    }
  },
  created() {
    this.getGoodsCategory();
  },
  mounted() {},
  components: {
    Breadcrumb,
    Cascader,
    ParamsDialogAdd,
    ParamsDialogEdit
  },
  computed: {
    //是否选择分类的标志
    isSelectCategory() {
      if (this.cascaderValue.length != 0) {
        return false;
      } else {
        return true;
      }
    },
    //动态计算对此分类参数请求的id
    currentCategoryToparamsId() {
      if (this.cascaderValue.length != 0) {
        return this.cascaderValue[this.cascaderValue.length - 1];
      } else {
        return null;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.input-new-tag {
  width: 120px;
}
.el-table {
  .el-tag {
    margin: 10px;
  }
}
</style>