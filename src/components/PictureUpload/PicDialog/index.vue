<template>
  <div>
    <el-dialog title="上传图片预览" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <img style="width:600px;margin-left:25px;"   :src="this.currentEditData" alt />
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      //标明是编辑还是添加
      flagStatus: "",
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false
    };
  },
  methods: {
    diaOpen() {},
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
      this.close();
    }
  },
  created() {},
  mounted() {},
  props: {
    currentEditData: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
</style>