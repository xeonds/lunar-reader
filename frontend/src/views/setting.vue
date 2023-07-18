<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="1" route="/home">Home</el-menu-item>
        <div class="flex-grow"></div>
        <el-menu-item index="2" route="/setting/upload"
          >Upload Book</el-menu-item
        >
        <el-menu-item index="3" route="/setting/delete"
          >Delete Book</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-main>
      <router-view> </router-view>
    </el-main>
  </el-container>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
