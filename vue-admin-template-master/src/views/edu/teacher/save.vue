<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss/uploadOssFile'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>


      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

import teacherApi from "@/api/edu/teacher"

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },

      
      imagecropperShow:false,//上传组件弹框是否显示
      imagecropperKey:0,//上传组件key值
      BASE_API: process.env.BASE_API,//获取dev.env.js里的地址
      saveBtnDisabled: false, // 保存按钮是否禁用,
    };
  },
  watch: {
    $route(to, from) {
      console.log("watch $route");
      this.init();
    },
  },
  created() {
    this.init();
    // if (this.$route.params && this.$route.params.id) {
    //   const id = this.$route.params.id
    //   this.getInfo(id)
    // } else {
    //     //清空表单
    //     this.teacher = {}
    // }
  },

  methods: {
    close() {//关闭上传弹框的方法
      this.imagecropperShow=false
      this.imagecropperKey = this.imagecropperKey + 1

    },
    //上传成功后的方法
    cropSuccess(data) {
      this.imagecropperShow=false
      //上传之后接口返回图片地址
      this.teacher.avatar =  data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
      } else {
        // 使用对象拓展运算符，拷贝对象，而不是引用，
        // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
        this.teacher = { ...defaultForm };
      }
    },

    //根据讲师id查询方法
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.item;
      });
    },
    updateTeacher() {
      teacherApi
        .updateTeacherInfo(this.teacher.id, this.teacher)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .then((response) => {
          this.$router.push({ path: "/teacher/table" });
        });
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateTeacher();
      }
    },

    // 保存
    saveData() {
      teacherApi
        .save(this.teacher)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "保存成功!",
          });
        })
        .then((resposne) => {
          this.$router.push({ path: "/teacher/table" });
        })
        .catch((response) => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },
  },
};
</script>