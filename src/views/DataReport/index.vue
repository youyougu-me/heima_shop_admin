<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <!-- echarts图表区域 -->
    <div id="main" style="width: 900px;height:400px;"></div>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import echarts from "echarts";
import { GetEchartDataReports } from "@/api/dataReport";
import _ from "lodash";
export default {
  data() {
    return {
      breadList: ["数据统计", "数据报表"]
    };
  },
  methods: {},
  created() {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 指定图表的配置项和数据
    GetEchartDataReports().then(res => {
      let obj1 = res.data.data;
      let obj2 = {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      };
      let options = _.merge(obj1, obj2);
      // const aa = options;
      // console.log(JSON.stringify(aa));
      myChart.setOption(options);
    });
  },
  components: {
    Breadcrumb
  }
};
</script>
<style lang="scss" scoped>
</style>