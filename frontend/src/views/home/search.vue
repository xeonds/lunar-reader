<template>
  <div>search</div>
</template>

<script>
export default {
  props: {
    searchName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      search: "",
      result: [],
    };
  },
};
</script>
