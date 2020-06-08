<template>
  <div id="login_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/images/loginav.png" alt />
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
        <!-- 验证码 -->
        <!-- <el-form-item prop="code" class="item-from">
          <el-row align="middle">
            <el-col :span="15" style="width:190px;margin-right:10px;">
              <el-input v-model="loginForm.code" size="medium" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="9" style="width:128px;">
              <el-button
                style="width:100%;"
                type="default"
                :disabled="smsButton.stopStatus"
                size="medium"
                class="pull-right"
                @click="getLoginSms"
                :loading="smsButton.loadingStatus"
              >{{smsButton.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>-->

        <!-- 按钮区域 -->
        <el-form-item class="btns item-from">
          <el-button type="danger" size="medium" @click="login">登录</el-button>
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
      }
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
        .catch(error => {});
    },
    register() {
      this.$router.push({
        name: "Register"
      });
    }
  }
};
</script>

<style lang="scss">
#login_container {
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
    background-color: $mainCcolor;
    //头像盒子
    .avatar_box {
      height: 40px;
      width: 40px;
      position: absolute;
      left: 40%;
      transform: translate(-50%, -50%);
      img {
        background-color: #fff;
        border-radius: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 2px #ddd;
        width: 100%;
        height: 100%;
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
