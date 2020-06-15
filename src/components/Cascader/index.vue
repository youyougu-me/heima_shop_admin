<template>
  <div>
    <el-cascader
      v-model="selfCascaderValue"
      :options="cascaderShowData"
      @change="cascaderChange"
      :props="cascaderProps"
      clearable
      :style="myStyle"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //级联器选项值
      selfCascaderValue: [],
      //这是props配置选项,只对应那边传过来的setting
      cascaderProps: {
        value: "",
        label: "",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      }
    };
  },
  methods: {
    //定义一个清空级联框的方法让父亲调用
    clearCascader() {
      this.selfCascaderValue = [];
    },
    //自己的值改变事件,会调用父亲的方法
    cascaderChange(val) {
      this.$emit("cascaderChange", val);
    },
    //父亲传值,更新自己设置
    //传过来的配置比固有的配置少
    updateCascaderSetting() {
      for (let key in this.cascaderSetting) {
        this.cascaderProps[key] = this.cascaderSetting[key];
      }
    }
  },
  created() {
    //传值在update之前
    this.updateCascaderSetting();
  },
  mounted() {},
  props: {
    //展示数据
    cascaderShowData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    cascaderSetting: {
      type: Object,
      default: () => {
        return {};
      }
    },
    myStyle: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
// <Cascader
//   @cascaderChange="cascaderChange"
//   ref="cascader"
//   :cascaderShowData="cascaderOptions"
//   :cascaderSetting="cascaderSetting"
//   myStyle="width:100%;"
// ></Cascader>

//父组件
/**
1.给我传递一个函数,用于接收我的值的变化 cascaderChange

cascaderChange(val){
    
}

2.给我传递渲染数据以及配置项 cascaderShowData   cascaderSetting
cascaderShowData = []*
cascaderSetting={
        value: "cat_id",*
        label: "cat_name",*
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      }

 */

 //3. :myStyle="width:100%;"

//子组件
/**
 1.定义了一个清空级联框的方法让父组件调用
 this.$refs.cascader.clearCascader();
 
  */
</style>