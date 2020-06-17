<template>
  <div id="goods_add_only">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList" />
    <!-- 警告区域 -->
    <el-alert show-icon title="添加商品" type="info" :closable="false" center></el-alert>
    <div style="height:20px;"></div>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="stepsActiveIndex-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div style="height:20px;"></div>
    <!-- 左边的标签页==================================== -->
    <!-- 由于这几部分组起来才是完整的商品提交表单,所以需要用一个大form来包裹 -->
    <el-form ref="addForm" :rules="addformRules" :model="addForm" label-position="top">
      <el-tabs
        tab-position="left"
        v-model="stepsActiveIndex"
        :before-leave="tabsChange"
        @tab-click="tabClick"
      >
        <!-- 第一个tabs页,每一页里面都是表单的一个item或者多个item ------------------- -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <Cascader
              @cascaderChange="cascaderChange"
              ref="cascader"
              :cascaderShowData="cascaderOptions"
              :cascaderSetting="cascaderSetting"
              myStyle="width:100%;"
            ></Cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 第二个tabs页------------------- -->
        <!-- 在打开第二个tab页的时候,这个动作会被监听到,这个时候会去获取次第三级分类下的所有参数 this.currentCategoryToAllParams -->
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="(item) in this.currentCategoryToAllParams" :key="item.attr_id">
            {{item.attr_name}}
            {{item.attr_vals}}
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="item2"
                v-for="(item2,index) in item.attr_vals2"
                :key="index"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 第三个tabs页------------------- -->
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            v-for="item in currentCategoryToAllStaticParams"
            :key="item.attr_id"
            :label="item.attr_name"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 第四个tabs页------------------- -->
        <el-tab-pane label="商品图片" name="3">
          <PictureUpload
            :picUploadSetting="picUploadSetting"
            @getUploadReturnData="getUploadReturnData"
          ></PictureUpload>
        </el-tab-pane>
        <!-- 第五个tabs页------------------- -->
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <div style="height:20px;"></div>
          <el-button type="primary" @click="completeAdd">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Breadcrumb from "@c/Breadcrumb/index";
import Cascader from "@c/Cascader/index";
import { GetGoodsCategory, GetParamsByCategoryId, addGoods } from "@/api/goods";
import PictureUpload from "@c/PictureUpload/index";
import { deepClone } from "@/utils/toolFunc";
export default {
  data() {
    return {
      breadList: ["商品管理", "添加商品"],
      //激活的步骤条
      stepsActiveIndex: "0",
      //tabs标签页中的form表单数据
      addformRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品内容", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        //得是以逗号分隔的列表
        //先就这么用到,在提交之前做一层处理
        goods_cat: [],
        //包括了动态参数以及静态参数
        attrs: [
          // {
          //   attr_id: 15,
          //   attr_value: "大大大"
          // },
          // {
          //   attr_id: 16,
          //   attr_value: "小小小"
          // }
        ],
        //上传的这些图片的暂时路径
        pics: [],
        goods_introduce: ""
      },
      //级联框的配置项
      cascaderSetting: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false
      },
      //级联框的数据
      cascaderOptions: [],
      //当前第三级分类下的所有参数数据
      //current意味着会随着某些参数变化
      currentCategoryToAllParams: [],
      currentCategoryToAllStaticParams: [],
      //关于上传图片的那个组件,我自己封装的
      picUploadSetting: {
        action: "http://127.0.0.1:8888/api/private/v1/upload",
        listType: "picture",
        token: localStorage.getItem("token")
      }
    };
  },
  methods: {
    //基本信息之商品信息的级联框选择改变
    cascaderChange(val) {
      this.addForm.goods_cat = val;
    },
    //获取所有的商品分类
    getAllcategory() {
      GetGoodsCategory().then(res => {
        this.cascaderOptions = res.data.data;
      });
    },
    //标签页的切换会存在限制
    tabsChange(newTab, oldTab) {
      // console.log(newTab, oldTab);
      if (oldTab == "0" && this.addForm.goods_cat.length == 0) {
        this.$message2("error", "请先选择分类");
        return false;
      }
    },
    //tabs页标签的点击事件(成功切换才会触发)
    //1.动态参数页的时候获取当前分类下的所有参数
    tabClick(obj) {
      // console.log(obj.active);
      // console.log(obj.index);
      if (obj.active == false) return;
      if (obj.index == "1") {
        //根据当前第三级分类的id获取      获取三级分类id对应的动态参数
        if (this.currentCategoryToAllParams.length !== 0) return;
        //这个就是一个三级分类下的所有参数,每个参数对应多个具体属性id(如版式),版式下会有属性
        //这个属性从数据库里面返回的值是以逗号分隔的字符串 而我们在checkbox里面展示的时候需要把它转化为数组
        GetParamsByCategoryId(this.currentCategoryId, "many").then(res => {
          //把每种传参数下的性质值做下处理
          res.data.data.forEach((element, index) => {
            element.attr_vals =
              element.attr_vals == "" ? [] : element.attr_vals.split(" ");
            element.attr_vals2 = element.attr_vals;
          });
          this.currentCategoryToAllParams = res.data.data;
        });
      }
      if (obj.index == "2") {
        if (this.currentCategoryToAllStaticParams.length !== 0) return;
        //根据当前第三级分类的id获取      获取三级分类id对应的静态参数
        GetParamsByCategoryId(this.currentCategoryId, "only").then(res => {
          this.currentCategoryToAllStaticParams = res.data.data;
        });
      }
    },
    //用于接收上传图片组件传回来的数据
    getUploadReturnData(val) {
      this.addForm.pics = val;
    },
    //完成几个步骤后的添加商品
    completeAdd() {
      //表单的预验证
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          this.$message2("error", "请填写完整之后再提交！");
          return false;
        }
        // 还有层验证, 有可能用户跳着点, 那么参数就可能为空;
        if (this.currentCategoryToAllParams.length == 0) {
          this.$message2("error", "请确认对商品的动态参数进行确认");
          return false;
        }
        if (this.currentCategoryToAllStaticParams.length == 0) {
          this.$message2("error", "请确认对商品的静态属性进行确认");
          return false;
        }

        //this上的数据被双向绑定了,所以这里需要深拷贝
        const requestData = deepClone(this.addForm);
        requestData.goods_cat = requestData.goods_cat.join(",");
        //处理动态参数
        this.currentCategoryToAllParams.forEach(element => {
          const item = {
            attr_id: element.attr_id,
            attr_value: element.attr_vals.join(" ")
          };
          this.addForm.attrs.push(item);
        });
        //处理静态属性
        //每一项就对应每一个属性id
        this.currentCategoryToAllStaticParams.forEach(element => {
          const item = {
            attr_id: element.attr_id,
            attr_value: element.attr_vals
          };
          this.addForm.attrs.push(item);
        });
        requestData.attr_vals = this.addForm.attrs;
        // console.log(requestData);
        addGoods(requestData).then(res => {
          this.$message2("", res.data.meta.msg);
          this.$router.push("/goods");
        });
      });
    }
  },
  created() {
    this.getAllcategory();
  },
  mounted() {},
  components: {
    Breadcrumb,
    Cascader,
    PictureUpload
  },
  computed: {
    currentCategoryId() {
      if (this.addForm.goods_cat.length == 0) {
        return null;
      } else {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
      }
    }
  },
  watch: {
    currentCategoryId(newVal, oldVal) {
      this.currentCategoryToAllParams = [];
      this.currentCategoryToAllStaticParams = [];
    }
  }
};
</script>
<style lang="scss">
#goods_add_only {
  .el-form-item__error {
    position: relative;
  }
}
</style>