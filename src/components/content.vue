<script>
import config from "../plugins/config";
export default {
  name: "pcontent",
  data() {
    return {};
  },
  props: ["carray"],
  render() {
    const { fontFamily, fontSize } = this;
    let style = fontFamily;
    style.fontSize = fontSize;
    if (this.show) {
      return `
        <div>
          {this.carray.map((a) => {
            return <p style={style} domPropsInnerHTML={a} />;
          })}
        </div>
      `;
    } else {
      return `<div />`;
    }
  },
  computed: {
    show() {
      return true;
    },
    fontFamily() {
      return config.fonts[0];
    },
    fontSize() {
      return 17 + "px";
    },
  },
  watch: {
    fontSize() {
      let that = this;
      that.$store.commit("setShowContent", false);
      this.$nextTick(() => {
        that.$store.commit("setShowContent", true);
      });
    },
  },
};
</script>

<style scoped>
p {
  display: block;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
