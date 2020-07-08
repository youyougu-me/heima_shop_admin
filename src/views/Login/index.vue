<template>
  <div id="login_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/images/logo.png" alt />
        <h1>彩橙电商后台管理系统</h1>
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" class="item-from">
          <el-input v-model="loginForm.username" size="medium" placeholder="请输入用户名">
            <i slot="suffix">
              <svg-icon iconClass="user" />
            </i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" class="item-from">
          <el-input v-model="loginForm.password" type="password" size="medium" placeholder="请输入密码">
            <i slot="suffix">
              <svg-icon iconClass="password" />
            </i>
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns item-from">
          <el-button size="medium" @click="login">登录</el-button>
          <span
            @click="register"
            style="margin-left:13px;cursor:pointer;color:#3d3d3d;text-decoration:underline;"
          >没有账号?去注册</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 0, max: 16, message: "长度在 0 到 16 个字符", trigger: "blur" }
        ]
      },
      logintimes: 0
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return;
        this.goLogin();
      });
    },

    //方法封装*************************
    goLogin() {
      let requestData = {
        username: this.loginForm.username,
        password: this.loginForm.password
      };
      this.$store
        .dispatch("login/login", requestData)
        .then(response => {
          this.$router.push({
            name: "Console"
          });
        })
        .catch(error => {
          if (
            error.code === "ECONNABORTED" &&
            error.message.indexOf("timeout") !== -1
          ) {
            this.$message2("error", "登录超时,正在重新尝试...", 2000);
            if (this.logintimes > 2) {
              this.$message2("error", "尝试多次,登录失败,请联系管理员", 10000);
              return false;
            }
            this.logintimes = this.logintimes + 1;
            this.goLogin();
          }
        });
    },
    register() {
      this.$message2("warning", "若要注册,请联系管理员!");
    }
  }
};
</script>

<style lang="scss">
#login_container {
  background: url("../../assets/images/bgc.jpg") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  height: 100vh;
  .register_box {
    width: 450px;
    height: 280px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: $mainColor;
    //头像盒子
    .avatar_box {
      height: 40px;
      width: 450px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        background-color: #f28a31;
        border-radius: 30px;
        // border: 1px solid #eee;
        box-shadow: 0 0 2px #ddd;
        width: 40px;
        margin-left: 80px;
      }
      h1 {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -30px;
        font-size: 22px;
        font-weight: bold;
        color: #2d2d2d;
      }
    }
    //表单区域
    .login_form {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .item-from {
        margin: 0 auto;
        margin-bottom: 25px;
        width: 328px;
      }
      .btns {
        display: flex;
        justify-content: flex-end;
      }
      //图标
      .el-input {
        span.el-input__suffix {
          span.el-input__suffix-inner {
            line-height: 45px;
            margin-right: 5px;
            .svg-icon {
              font-size: 18px !important;
              color: #c0cfe2 !important;
            }
          }
        }
      }
    }
  }
}
</style>
