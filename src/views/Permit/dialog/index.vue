<template>
  <div>
    <el-dialog title="分配此角色权限" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-tree
        :data="currentEditData"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultSelect"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <!-- 树形展示权限 -->
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SubmitRightsTree } from "@/api/rights";
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
      //树形控件展示时的设置
      defaultProps: {
        //嵌套
        children: "children",
        // 展示的字段
        label: "authName"
      }
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
    },
    submit() {
      const objArr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      const objArr2 = objArr.join(",");
      SubmitRightsTree(this.currentId, { rids: objArr2 }).then(res => {
        this.$message2("", res.data.meta.msg);
        this.close();
        //只是关闭没用,表格数据还得重新请求,因为渲染的选中项从表格来的
        this.$emit("getRoleList")
      });
    }
  },
  created() {},
  mounted() {},
  props: {
    currentEditData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    defaultSelect: {
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