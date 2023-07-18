<template>
  <el-container>
    <el-aside width="20rem" class="aside">
      <el-row class="title">
        <el-text class="title-main">阅读</el-text>
        <el-text class="title-sub">清风不识字，何故乱翻书</el-text>
      </el-row>
      <el-row class="search">
        <el-input
          placeholder="搜索书籍"
          v-model="search"
          class="search-input"
        ></el-input>
      </el-row>
      <el-row class="recent">
        <el-divider class="recent-title">最近阅读</el-divider>
        <el-text class="reading-recent">
          <el-tag
            type="warning"
            class="recent-book"
            @click="
              toDetail(
                readingRecent.url,
                readingRecent.name,
                readingRecent.chapterIndex
              )
            "
            :class="{ 'no-point': readingRecent.url == '' }"
          >
            {{ readingRecent.name }}
          </el-tag>
        </el-text>
      </el-row>
      <el-row class="setting">
        <el-divider class="setting-title">设定</el-divider>
        <div class="setting-items">
          <el-button
            type="primary"
            plain
            @click="$router.push('/setting/upload')"
            >Upload</el-button
          >
          <el-button
            type="primary"
            plain
            @click="$router.push('/setting/delete')"
            >Delete</el-button
          >
        </div>
      </el-row>
    </el-aside>
    <el-container>
      <el-header class="header">
        <nav-bar @handle="handleNavClick" />
      </el-header>
      <el-main>
        <book-shelf :filter="categoryFilter" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navBar from "@/components/nav-bar.vue";
import bookShelf from "@/views/home/bookshelf.vue";

export default {
  components: {
    navBar,
    bookShelf,
  },
  data() {
    return {
      search: "",
      readingRecent: {
        name: "尚无阅读记录",
        url: "",
        chapterIndex: 0,
      },
      categoryFilter: () => true,
    };
  },
  mounted() {
    let readingRecentStr = localStorage.getItem("readingRecent");
    if (readingRecentStr != null) {
      this.readingRecent = JSON.parse(readingRecentStr);
      if (typeof this.readingRecent.chapterIndex == "undefined") {
        this.readingRecent.chapterIndex = 0;
      }
    }
  },
  methods: {
    handleNavClick(item) {
      this.categoryFilter = item.filter;
      this.$router.push(`/home/${item.id}`);
    },
    toDetail(bookUrl, bookName, chapterIndex) {
      sessionStorage.setItem("bookUrl", bookUrl);
      sessionStorage.setItem("bookName", bookName);
      sessionStorage.setItem("chapterIndex", chapterIndex);
      this.readingRecent = {
        name: bookName,
        url: bookUrl,
        chapterIndex: chapterIndex,
      };
      localStorage.setItem("readingRecent", JSON.stringify(this.readingRecent));
      this.$router.push({
        path: `/book/${bookUrl}`,
      });
    },
    dateFormat(t) {
      let time = new Date().getTime();
      let int = parseInt((time - t) / 1000);
      let str = "";
      Date.prototype.format = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      };
      if (int <= 30) {
        str = "刚刚";
      } else if (int < 60) {
        str = int + "秒前";
      } else if (int < 3600) {
        str = parseInt(int / 60) + "分钟前";
      } else if (int < 86400) {
        str = parseInt(int / 3600) + "小时前";
      } else if (int < 2592000) {
        str = parseInt(int / 86400) + "天前";
      } else {
        str = new Date(t).format("yyyy-MM-dd");
      }
      return str;
    },
  },
};
</script>

<style lang="less" scoped>
.aside {
  background-color: #f7f7f7;
  padding: 1rem;
  height: 100vh;
  .title {
    display: flex;
    flex-flow: row;
    justify-content: space-evenly;
    align-items: center;
    .title-main {
      font-size: 24px;
      font-weight: 500;
      font-family: FZZCYSK;
    }
    .title-sub {
      font-size: 16px;
      font-weight: 300;
      font-family: FZZCYSK;
      color: #b1b1b1;
      border-left: 1px solid #b1b1b1;
      padding-left: 1rem;
    }
  }
  .search {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    .search-input {
      border-radius: 50%;
      margin-top: 24px;
    }
  }

  .recent {
    margin-top: 36px;
    .recent-title {
      font-size: 14px;
      color: #b1b1b1;
      font-family: FZZCYSK;
    }

    .reading-recent {
      margin: 18px 0;
      .recent-book {
        font-size: 10px;
        cursor: pointer;
      }
    }
  }
  .setting {
    margin-top: 36px;
    .setting-title {
      font-size: 14px;
      color: #b1b1b1;
      font-family: FZZCYSK;
    }
    .setting-items {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      align-items: center;
    }
  }
}
</style>

<style lang="less" scoped>
.header {
  padding: 0;
}
</style>
