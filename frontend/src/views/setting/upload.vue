<template>
  <el-card>
    <template #header>
      <h2>Upload Book</h2>
    </template>
    <el-form @submit.prevent="uploadBook" label-width="80" style="width: 32rem">
      <el-form-item label="Book">
        <el-upload
          drag
          action="#"
          :limit="1"
          :on-change="handleChange"
          :auto-upload="false"
          style="width: 100%"
        >
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Title">
        <el-input type="text" v-model="book.title" placeholder="Title" />
      </el-form-item>
      <el-form-item label="Author">
        <el-input type="text" v-model="book.author" placeholder="Author" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          textarea
          v-model="book.description"
          placeholder="Description"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="uploadBook">Upload</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import http from "@/utils/http";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      book: {
        title: "",
        author: "",
        description: "",
        content: null,
      },
      file_list: [],
    };
  },
  methods: {
    handleChange(file) {
      console.log("uploading");
      const reader = new FileReader();
      reader.readAsText(file.raw, "utf-8");
      reader.onload = () => {
        this.book.content = reader.result.split("\r\n");
      };
    },
    uploadBook() {
      const formData = new FormData();
      formData.append("title", this.book.title);
      formData.append("author", this.book.author);
      formData.append("description", this.book.description);
      formData.append("content", this.book.content);
      http
        .post("book", formData)
        .then((response) => {
          ElMessage({
            message: response.data.message,
            type: "success",
          });
          this.book.title = "";
          this.book.author = "";
          this.book.description = "";
          this.book.content = null;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style>
.drop-zone {
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
}
</style>
