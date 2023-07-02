<template>
  <div id="root">
    <el-header id="header">
      <el-row>
        <el-col :span="6" style="-webkit-app-region: drag">
          <div id="left-group">
            <el-text
              ><el-icon><Reading /></el-icon
            ></el-text>
            <el-text>Lunar-Reader</el-text>
          </div>
        </el-col>
        <el-col :span="12">
          <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-col>
        <el-col :span="6">
          <div id="right-group">
            <el-button link
              ><el-icon><Setting /></el-icon
            ></el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container id="container">
      <el-aside id="aside">
        <el-menu default-active="1" router>
          <el-menu-item index="1" route="/shelf/all">
            <el-icon><Collection /></el-icon>
            <template #title>全部</template>
          </el-menu-item>
          <el-menu-item index="2" route="/shelf/recent">
            <el-icon><timer /></el-icon>
            <template #title>最近</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main id="main">
        <el-scrollbar>
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { Collection, Timer, Setting, Reading } from "@element-plus/icons-vue";
</script>

<style scoped lang="less">
#root {
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
  #header {
    height: 4rem;
    padding: 1rem;
    #left-group {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    #right-group {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      margin-right: 8rem;
    }
  }
  #container {
    height: calc(100vh - 4rem);
    #aside {
      padding-inline: 1rem;
      width: auto;
      .el-menu {
        margin-top: 0.5rem;
        background-color: transparent;
        border-right: none;
        .el-menu-item {
          margin: 0.5rem auto;
        }
      }
    }
    #main {
      width: 100%;
      background-color: #ffffff;
      box-shadow: 0 0 1rem 0 rgba(136, 152, 170, 0.15);
      border-top-left-radius: 0.4rem;
    }
  }
}
.el-menu-item {
  border-radius: 0.4rem;
  height: 2.4rem;
}
.is-active {
  background-color: #66ccff !important;
  color: #ffffff !important;
}
.flex-grow {
  flex-grow: 1;
}
</style>
