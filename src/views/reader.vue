<template>
  <div>{{ content }}</div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  created: function () {
    window.api.openBook(this.$route.query.book).then((res) => {
      this.content = res;
    });
  },
};
</script>
