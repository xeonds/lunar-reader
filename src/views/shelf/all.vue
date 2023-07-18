<template>
  <div id="shelf-all">
    <template v-if="books.length > 0">
      <div class="book" v-for="book in bookList" @click="openBook(book)">
        {{ book }}
      </div>
    </template>
    <el-empty description="空" v-else />
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
    };
  },
  computed: {
    bookList() {
      return this.books.filter((book) => book.endsWith(".txt"));
    },
  },
  created: function () {
    window.api.openDir().then((res) => {
      console.log(this.books);
      this.books = res;
    });
  },
  methods: {
    openBook(book) {
      this.$router.push({
        path: "/reader",
        query: {
          book,
        },
      });
    },
  },
};
</script>

<style>
#shelf-all {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.book {
  height: 11rem;
  width: 8rem;
  background-color: #f5f7fa;
  margin: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
