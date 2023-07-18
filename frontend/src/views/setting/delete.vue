<template>
  <el-card>
    <template #header>
      <h2>Delete Book</h2>
    </template>
    <el-table :data="bookList">
      <el-table-column prop="title" label="Title"></el-table-column>
      <el-table-column prop="author" label="Author"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="options">
        <template #default="{ row }">
          <el-button type="primary" @click="deleteBook(row.id)" plain
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import http from "@/utils/http.js";

export default {
  data() {
    return {
      bookList: [],
    };
  },
  methods: {
    getBookList() {
      http.get("/bookshelf").then((res) => {
        this.bookList = res.data;
      });
    },
    deleteBook(id) {
      http.delete(`/book/${id}`).then((res) => {
        this.getBookList();
      });
    },
  },
  created() {
    this.getBookList();
  },
};
</script>
