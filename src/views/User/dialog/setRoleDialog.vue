<template>
  <div>
    <el-dialog title="给用户分配角色" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <p style="margin:10px 160px;font-size:16px">当前的用户:{{currentEditData.username}}</p>
      <p style="margin:10px 160px;font-size:16px">当前的角色为:{{currentEditData.role_name}}</p>
      <p style="margin:0px 160px;font-size:16px">修改角色为:</p>
      <!-- 下拉框 -->
      <el-select v-model="selectValue" placeholder="请选择" style="margin:10px 160px;font-size:16px">
        <el-option
          v-for="item in userRolesListS2"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SetUserRole } from "@/api/user";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      //标明是编辑还是添加
      flagStatus: "",
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      // 下拉框选中的值
      selectValue: ""
    };
  },
  methods: {
    diaOpen() {
      //关于编辑
      if (this.flagStatus == "edit") {
        const currentEditData = JSON.parse(
          JSON.stringify(this.currentEditData)
        );
      } else {
        //添加,只需要打开框,父组件已经做了，这里子组件不需要做什么
      }
    },
    //打开dialog框
    faControlOpen() {
      this.isVisible = true;
    },
    //父组件改变我的状态
    faControlStatus(status) {
      this.flagStatus = status;
    },
    //关闭dialog框
    close() {
      this.isVisible = false;
      //清空下拉框所选择的
      this.selectValue = "";
    },
    submit() {
      if (this.selectValue == "")
        return this.$message2("warning", "请选择角色");
      const urlParams = this.currentEditData.id;
      const requestData = { rid: this.selectValue };
      SetUserRole(urlParams, requestData).then(res => {
        this.$message2("", res.data.meta.msg);
        //关闭对话框
        this.close();
        //表格数据清新请求
        this.$emit("getTableData");
      });
    }
  },
  created() {},
  mounted() {},
  props: {
    //当前用户的信息
    currentEditData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    //所有的角色列表,用来渲染下拉框
    userRolesListS2: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
// 2.父组件需要告诉我是编辑状态还是添加状态
// 3.父组件需要传在里面渲染时我要用到的数据currentEditData
</style>