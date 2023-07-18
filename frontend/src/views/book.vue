<template>
  <el-container class="container" :style="config">
    <el-empty v-if="ui.loading" />
    <el-main class="main" v-else>
      <el-row class="top">
        <el-col>
          <el-button type="primary" plain link @click="toPrev">Prev</el-button>
          <el-button type="primary" plain link @click="toNext">Next</el-button>
          <el-button type="primary" plain link @click="toTop">Top</el-button>
          <el-button type="primary" plain link @click="toBottom"
            >Bottom</el-button
          >
        </el-col>
        <el-col>
          <el-button type="primary" plain link @click="$router.push('/')"
            >Home</el-button
          >
        </el-col>
      </el-row>
      <el-scrollbar class="content">
        <el-row class="title">
          {{
            book.chapter[read.chapter] ? book.chapter[read.chapter].title : ""
          }}
        </el-row>
        <el-row :style="config">
          {{
            book.chapter[read.chapter] ? book.chapter[read.chapter].content : ""
          }}
        </el-row>
      </el-scrollbar>
      <el-row class="bottom">
        <el-col :span="6">
          <el-button type="primary" plain link @click="ui.indexVisible = true"
            >Index</el-button
          >
        </el-col>
        <el-col :span="12">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="Math.round(read.percent * 10000) / 100"
          />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain link @click="ui.configVisible = true"
            >Config</el-button
          >
        </el-col>
      </el-row>
    </el-main>
    <!-- chapter -->
    <el-drawer
      v-model="ui.indexVisible"
      title="Index"
      direction="ltr"
      size="320"
    >
      <el-table
        :data="book.chapter"
        style="width: 100%"
        @row-click="
          (row, _a, _b) => {
            toChapter(row.index);
            ui.indexVisible = false;
          }
        "
      >
        <el-table-column prop="title" />
      </el-table>
    </el-drawer>
    <!-- setting -->
    <el-drawer
      v-model="ui.configVisible"
      title="Setting"
      direction="rtl"
      size="320"
    >
      <el-form-item label="Font Size">
        <el-slider
          v-model="config.fontSize"
          :min="12"
          :max="32"
          :step="2"
          show-input
        />
      </el-form-item>
      <el-form-item label="Font Color">
        <el-color-picker v-model="config.color" show-alpha />
      </el-form-item>
      <el-form-item label="Background Color">
        <el-color-picker v-model="config.background" show-alpha />
      </el-form-item>
    </el-drawer>
  </el-container>
</template>

<script>
import http from "@/utils/http.js";

export default {
  data() {
    return {
      book: {
        title: "",
        author: "",
        description: "",
        content: "",
        chapter: [
          {
            id: 0,
            title: "",
            content: "",
          },
        ],
      },
      read: {
        percent: 0,
        chapter: 0,
      },
      config: {
        fontSize: 16,
        color: "#fff",
        background: "#333",
      },
      ui: {
        loading: true,
        indexVisible: false,
        configVisible: false,
      },
    };
  },
  mounted() {
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.toPrev();
          break;
        case "ArrowRight":
          this.toNext();
          break;
        case "ArrowUp":
          if (document.documentElement.scrollTop === 0) {
            ElMessage("已到达页面顶部");
          } else {
            jump(0 - document.documentElement.clientHeight + 100);
          }
          break;
        case "ArrowDown":
          if (
            document.documentElement.clientHeight +
              document.documentElement.scrollTop ===
            document.documentElement.scrollHeight
          ) {
            ElMessage("已到达页面底部");
          } else {
            jump(document.documentElement.clientHeight - 100);
          }
          break;
      }
    });
  },
  created() {
    this.getContent();
    this.loadConfig();
    this.loadProgress();
    this.ui.loading = false;
  },
  methods: {
    splitChapter(str) {
      let result = [];
      let reg =
        /(正文){0,1}(第)([零〇一二三四五六七八九十百千万a-zA-Z0-9]{1,7})[章节卷集部篇回]((?! {4}).)((?! ).){0,30}/g;
      let chapterTitle = str.match(reg);
      if (chapterTitle == null) {
        result.push(str);
      } else {
        for (let i = 0; i < chapterTitle.length; i++) {
          let index = str.indexOf(chapterTitle[i]);
          let nextIndex = str.indexOf(chapterTitle[i + 1]);
          if (nextIndex === -1) {
            result.push({
              index: i,
              title: chapterTitle[i],
              content: str.substring(index).replace(chapterTitle[i], ""),
            });
          } else {
            result.push({
              index: i,
              title: chapterTitle[i],
              content: str
                .substring(index, nextIndex)
                .replace(chapterTitle[i], ""),
            });
          }
        }
      }
      return result;
    },
    getContent() {
      return http.get(`/book/${this.$route.params.id}`).then((res) => {
        this.book = res.data;
        this.book.chapter = this.splitChapter(this.book.content);
      });
    },
    loadConfig() {
      let config = JSON.parse(localStorage.getItem("config"));
      if (config != null) this.config = config;
    },
    loadProgress() {
      let progress = JSON.parse(
        localStorage.getItem(
          `lunar-reader.book${this.$route.params.id}.progress`
        )
      );
      if (progress != null) this.read = progress;
    },
    saveProgress() {
      localStorage.setItem(
        `lunar-reader.book${this.$route.params.id}.progress`,
        JSON.stringify(this.read)
      );
    },
    toTop() {
      jump(this.$refs.top);
    },
    toBottom() {
      jump(this.$refs.bottom);
    },
    toNext() {
      if (typeof this.book.chapter[this.read.chapter + 1] !== "undefined") {
        this.read.chapter++;
        this.read.percent = this.read.chapter / this.book.chapter.length;
      } else {
        ElMessage("本章是最后一章");
      }
      this.saveProgress();
    },
    toPrev() {
      if (this.read.chapter > 0) {
        this.read.chapter--;
        this.read.percent = this.read.chapter / this.book.chapter.length;
      } else {
        ElMessage("本章是第一章");
      }
      this.saveProgress();
    },
    toChapter(index) {
      this.read.chapter = index;
      this.read.percent = this.read.chapter / this.book.chapter.length;
      this.saveProgress();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  width: 100vw;
  max-width: 1000px;
  margin: 0px auto;
  padding: 0px;
  .top {
    display: flex;
    align-items: center;
    height: 4rem;
  }
  .content {
    height: calc(100vh - 8rem);
    word-break: break-all;
    .title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    height: 4rem;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
}
p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.5;
  text-indent: 2em;
}
</style>
