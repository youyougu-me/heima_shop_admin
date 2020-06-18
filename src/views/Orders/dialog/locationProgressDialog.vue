<template>
  <div>
    <el-dialog title="查询物流进度" width="650px" @opened="diaOpen" :visible="isVisible" @close="close">
      <el-timeline :reverse="false" style="margin-left:30px;">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
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
import { CheckLogisticsInfo } from "@/api/order";
import { logisticsInfo } from "@/api/order";
export default {
  inject: ["reload"],
  name: "Dialog",
  data() {
    return {
      formLabelWidth: "120px",
      //隐藏与显示
      isVisible: false,
      //表单验证
      rules: {},
      flagStatus: "",
      // 物流信息
      activities: []
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
        // 发请求查询物流
        this.activities = logisticsInfo;
        // console.log(logisticsInfo);
        // CheckLogisticsInfo(this.logisticsId).then(res => {
        //   console.log(res);
        // });
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
    submit() {}
  },
  created() {},
  mounted() {},
  props: {
    logisticsId: {
      type: String,
      default: () => {
        return "";
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