<template>
  <div>
    <el-dialog title="编辑" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-cascader
            v-model="cascaderValue"
            :options="cascaderOptions"
            @change="cascaderChange"
            :props="cascaderProps"
            clearable
            style="width:100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="注:" :label-width="formLabelWidth">若未选择父级分类则证明你需要添加一级分类,级联框也支持只选择其中一级</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateEmail } from "@/utils/validate";
import { GetGoodsCategory, AddGoodsCategory } from "@/api/goods";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      //标明是编辑还是添加
      flagStatus: "",
      form: {
        cat_name: "",
        // 如果添加的是一级分类,则父级id应该设置为0
        cat_pid: 0,
        cat_level: 0
      },
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        cat_name: [
          { required: true, trigger: "blur", message: "请输入分类名称" }
        ]
      },
      //级联器选项
      cascaderOptions: [],
      cascaderValue: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      }
    };
  },
  methods: {
    diaOpen() {
      //不管是编辑还是添加,级联框打开的时候都应该去获取选项数据
      // 这里只获取一二级,因为级联选择框是作为父级
      GetGoodsCategory({ type: 2 }).then(res => {
        this.cascaderOptions = res.data.data;
      });

      //关于编辑
      if (this.flagStatus == "edit") {
        const currentEditData = JSON.parse(
          JSON.stringify(this.currentEditData)
        );
        // for (let key in currentEditData) {
        //   this.form[key] = currentEditData[key];
        // }
      }
    },
    close() {},
    //打开dialog框
    faControlOpen() {
      this.isVisible = true;
      //清空级联框
      this.cascaderValue = [];
    },
    //父组件改变我的状态
    faControlStatus(status) {
      this.flagStatus = status;
    },
    //关闭dialog框
    close() {
      this.isVisible = false;
      this.$refs["form"].resetFields();
      //重置不掉这两个
      this.form.cat_pid = 0;
      this.form.cat_level = 0;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //因为这里需要改变双向绑定的类型,所以采用深拷贝
          let requestData = JSON.parse(JSON.stringify(this.form));
          AddGoodsCategory(requestData).then(res => {
            this.$message2("", res.data.meta.msg);
            // this.reload()
            this.$emit("requestDataFunc");
            this.close();
          });
        }
      });
    },
    cascaderChange(val) {
      // val表示选中的id数组
      //根据id数组的长度来判断要提交的数据
      if (val.length == 0) {
        //没有选父级
        //父级id为0
        this.form.cat_pid = 0;
        //自己为一级
        this.form.cat_level = 0;
      } else {
        this.form.cat_pid = val[val.length - 1];
        this.form.cat_level = val.length;
      }
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
  }
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
</style>