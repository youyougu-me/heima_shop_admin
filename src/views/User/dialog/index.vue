<template>
  <div>
    <el-dialog title="编辑" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" :disabled="byEdit"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" :disabled="byEdit"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
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
import { validateEmail } from "@/utils/validate";
import { AddUser, RequestCurrentEditData, SubmitEdittUser } from "@/api/user";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    //验证邮箱
    var validate_Email = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户邮箱"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback(); //true
      }
    };

    //验证密码
    let validatePass = (rule, value, callback) => {
      //如果是编辑,但是根本没动密码框
      //因为编辑初始化密码框就为空
      //没值不验证
      if (this.flagStatus == "edit" && !value) {
        callback();
      }
      //id存在并且填写了密码就需要校验
      //失去焦点的时候
      if (this.flagStatus == "edit" && value) {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      } else {
        //添加
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      }
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //标明是编辑还是添加
      flagStatus: "",
      //编辑状态下用户名禁用
      byEdit: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {
        email: [
          { required: true, trigger: "blur", message: "请输入用户邮箱" },
          { validator: validate_Email, trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: "blur" }
          //   { required: true, trigger: "blur", message: "请输入密码" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //用户所选的系统列表
      systemList: [],
      //所有可选的按钮
      btnList: []
    };
  },
  methods: {
    diaOpen() {
      //关于编辑
      if (this.flagStatus == "edit") {
        const currentEditData = JSON.parse(
          JSON.stringify(this.currentEditData)
        );
        //那id去发请求去拿当前项的数据
        RequestCurrentEditData(this.currentEditData.id).then(res => {
          const currentEdit = res.data.data;
          //编辑时用户名禁用
          this.byEdit = true;
          //给框赋值
          this.form.username = currentEdit.username;
          this.form.email = currentEdit.email;
          this.form.mobile = currentEdit.mobile;
          this.form.password = "******";
        });
      } else {
        //添加,只需要打开框,父组件已经做了，这里子组件不需要做什么
        this.byEdit = false;
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
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //因为这里需要改变双向绑定的类型,所以采用深拷贝
          let requestData = JSON.parse(JSON.stringify(this.form));
          if (this.flagStatus == "add") {
            AddUser(requestData).then(res => {
              this.$message2("", res.data.meta.msg);
              this.reload();
            });
          } else {
            SubmitEdittUser(this.currentEditData.id, {
              email: this.form.email,
              mobile: this.form.mobile
            }).then(res => {
              this.$message2("", res.data.meta.msg);
              //不能直接刷新,会回到第一页
              //调父组件的方法
              // this.reload()
              //调父亲的方法,依然可以用父亲的参数,只是在父亲那边执行
              this.$emit("getTableData");
            });
          }
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
  }
};
</script>
<style lang="scss" scoped>
//此组件使用说明
// 1.由父组件控制我的打开,我写一个方法,父组件自己来调用
</style>