<template>
  <el-container class="container">
    <el-card
      v-for="book in books"
      :key="book.id"
      class="book"
      @click="$router.push(`/book/${book.id}`)"
    >
      <template #header>
        {{ book.title }} <br />
        <el-text class="author">{{ book.author }}</el-text>
      </template>
      <el-row>{{ book.description }}</el-row>
    </el-card>
  </el-container>
</template>

<script>
import http from "@/utils/http";

export default {
  props: {
    filter: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      books: [],
    };
  },
  created() {
    this.getBooks();
  },
  methods: {
    getBooks() {
      this.books = [];
      http
        .get("bookshelf")
        .then((response) => {
          response.data.forEach((book) => {
            if (this.filter(book)) {
              this.books.push(book);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
  .book {
    width: 12rem;
    height: 16rem;
    margin: 1rem;
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px rgb(255, 255, 255);
    }
    .author {
      border-left: 1px solid #e33939;
      padding-left: 0.5rem;
    }
  }
}
</style>
