<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <el-menu-item v-for="item in cateList" @click="$emit('handle', item)">{{
      item.name
    }}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      cateList: [
        {
          id: "",
          name: "全部",
          filter: (book) => true,
        },
        {
          id: "latest",
          name: "1月内添加",
          filter: (book) =>
            book.CreatedAt > new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
        },
      ],
    };
  },
  methods: {
    search_title(title) {
      if (title.length == 0) return this.$message.error("未填写搜索内容");
      this.$router.push(`/search/${title}`);
    },
  },
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
