<template>
  <div>
    <el-upload
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      :action="myPicUploadSetting.action"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :list-type="myPicUploadSetting.listType"
      :headers="{Authorization:myPicUploadSetting.token}"
      :on-success="handleAvatarSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" style="margin:20px 0;">只能上传jpg/png文件，且不超过2Mb(点击图片名字可预览)</div>
    </el-upload>
    <PictureUpload ref="picDialog" :currentEditData="currentPreviewUrl"></PictureUpload>
  </div>
</template>

<script>
import PictureUpload from "./PicDialog/index";
export default {
  data() {
    return {
      myPicUploadSetting: {
        action: "",
        listType: "picture",
        token: ""
      },
      //存放向父组件传递的上传图片后,各自图片返回的路径
      //秘诀就是传了一张后,立马把当前这张push到父组件的总数组中
      tempArr: [],
      //当前需要预览的图片路径,这个和父组件无关了
      currentPreviewUrl: ""
    };
  },
  methods: {
    //图片上传成功的函数
    handleAvatarSuccess(res, file) {
      //   this.imageUrl = URL.createObjectURL(file.raw);
      const _tmp_path = res.data.tmp_path;
      const _url = res.data.url;
      this.$message2("", res.meta.msg);
      const tempObj = { pic: _tmp_path };
      //这个值和父组件的值肯定是同步的,因为一刷新大家都没有了
      this.tempArr.push(tempObj);
      //传给父亲
      this.$emit("getUploadReturnData", this.tempArr);
    },
    //beforeAvatarUpload限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    handleRemove(file, fileList) {
      const deleteObj = file.response.data.tmp_path;
      //这个值不会自动变
      //   console.log(this.tempArr);
      const objIndex = this.tempArr.findIndex(x => x.pic === deleteObj);
      this.tempArr.splice(objIndex, 1);
      //传给父亲
      this.$emit("getUploadReturnData", this.tempArr);
    },
    handlePreview(file) {
      this.currentPreviewUrl = file.response.data.url;
      //这个时候打开dialog框
      this.$refs.picDialog.faControlOpen();
    },
    //父亲穿过来配置,给此组件重新赋值
    resetSetting() {
      for (let key in this.picUploadSetting) {
        //传过来哪些就更新哪些
        this.myPicUploadSetting[key] = this.picUploadSetting[key];
      }
    }
  },
  created() {
    this.resetSetting();
  },
  mounted() {},
  props: {
    picUploadSetting: {
      type: Object,
      default: () => {
        return {
          action: "",
          listType: "picture",
          token: ""
        };
      }
    }
  },
  components: {
    PictureUpload
  }
};
</script>
<style lang="scss" scoped>
// 目的：做一个上传图片通用的组件
//此组件的主要目的是向父组件提供上传图片的 暂时路径

/**
一、父组价向子组件提供
1.配置选项
picUploadSetting:{
   action:"",
   list-type:"picture"
}
2.接收暂存路径的一个函数
getUploadReturnData{

}




 */
</style>