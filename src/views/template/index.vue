<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
export default {
  data() {
    return {
      breadList: ["权限管理", "权限列表"]
    };
  },
  methods: {},
  created() {},
  mounted() {},
  components: {
    Breadcrumb
  }
};
</script>
<style lang="scss" scoped>
</style>