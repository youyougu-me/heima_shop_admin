<template>
  <div>
    <el-dialog title="编辑地址" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="省市区/县" prop="address1" :label-width="formLabelWidth">
          <!-- 级联框子组件 -->
          <Cascader
            @cascaderChange="cascaderChange"
            ref="cascader"
            :cascaderShowData="cascaderOptions"
            :cascaderSetting="cascaderSetting"
            myStyle="width:100%;"
          ></Cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2" :label-width="formLabelWidth">
          <el-input v-model="form.address2" autocomplete="off"></el-input>
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
import Cascader from "@c/Cascader/index";
import addressInfo from "@/utils/citydata.js";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      form: {
        address1: [],
        address2: ""
      },
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        address1: [
          { required: true, trigger: "blur", message: "请选择省市区" }
        ],
        address2: [
          { required: true, trigger: "blur", message: "请输入详细地址" }
        ]
      },
      //级联框子组件的渲染数据
      cascaderOptions: addressInfo,
      //级联框配置
      cascaderSetting: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false
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
      //清空
      this.$refs["form"].resetFields();
      this.$refs.cascader.clearCascader();
      this.form.address1 = [];
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //因为这里需要改变双向绑定的类型,所以采用深拷贝
          let requestData = JSON.parse(JSON.stringify(this.form));
          this.$message2("", "收货地址提交成功");
        }
      });
    },
    //用于接收级框子组件的值
    cascaderChange(val) {
      this.form.address1 = val;
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
  components: {
    Cascader
  }
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
</style>