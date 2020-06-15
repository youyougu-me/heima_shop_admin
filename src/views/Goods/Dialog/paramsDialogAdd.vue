<template>
  <div>
    <el-dialog :title="flagStatus=='many'?'添加动态参数':'添加静态属性'" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          :label="flagStatus=='many'?'动态参数':'静态属性'"
          prop="attr_name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AddcategoryParams } from "@/api/goods";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      //标明是添加动态参数还是静态属性
      flagStatus: "many",
      form: {
        attr_name: ""
      },
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        attr_name: [{ required: true, trigger: "blur", message: "请输入名称" }]
      },
      //当前项的三级分类id
      currentCategoryToparamsId: ""
    };
  },
  methods: {
    diaOpen() {},
    //打开dialog框
    faControlOpen() {
      this.isVisible = true;
    },
    //父组件改变我的状态
    faControlStatus(status, id) {
      this.flagStatus = status;
      this.currentCategoryToparamsId = id;
    },
    //关闭dialog框
    close() {
      this.isVisible = false;
      this.$refs["form"].resetFields();
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const requestData = {
            attr_name: this.form.attr_name,
            attr_sel: this.flagStatus
          };
          AddcategoryParams(this.currentCategoryToparamsId, requestData).then(
            res => {
              this.$message2("", res.data.meta.msg);
              this.$emit("getParamsByCategory");
              this.close();
            }
          );
        }
      });
    }
  },
  created() {},
  mounted() {},
  props: {
    currentEditData: {
      type: Object,
      default: () => {
        return {};
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