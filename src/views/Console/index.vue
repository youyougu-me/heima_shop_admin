<template>
  <div id="index_container">
    <transition>
      <img src="@/assets/images/logo.png" alt class="img" v-show="showFlag" />
    </transition>
    <div class="word">
      彩橙,一个
      <span>橙色</span>的管理系统
    </div>
    <div class="word2">简易却不失精彩！</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFlag: true
    };
  },
  methods: {},
  created() {
    //定时器
    const timer = setInterval(() => {
      this.showFlag = !this.showFlag;
    }, 1000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#index_container {
  background-color: $mainColor2;
  width: 100%;
  height: 100%;
  position: relative;
  img {
    position: absolute;
    width: 70px;
    left: 400px;
    top: 300px;
  }
  .word {
    position: absolute;
    width: 400px;
    left: 490px;
    top: 325px;
    font-size: 20px;
    letter-spacing: 5px;
    span {
      color: $mainColor;
      font-size: 23px;
    }
  }
  .word2 {
    position: absolute;
    width: 400px;
    left: 588px;
    top: 360px;
    font-size: 20px;
    letter-spacing: 5px;
  }
  .v-enter,
  .v-leave-to {
    opacity: 1;
    // transform: translateY(5px) !important;
    top: 320px !important;
  }
  .v-leave-active {
    transition: all 1s ease;
  }

  .v-enter-active {
    transition: all 1s ease;
  }
}
</style>