<template>
  <div class="aside">
    <el-menu default-active="/" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" :router="true" active-text-color="#ffd04b" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="/main">
        <i class="fa fa-home fa-lg"></i>
        <span slot="title"> Home</span>
      </el-menu-item>
      <el-menu-item index="/project">
        <i class="fa fa-sitemap fa-lg"></i>
        <span slot="title"> Project</span>
      </el-menu-item>
      <el-menu-item index="/group">
        <i class="fa fa-users fa-lg"></i>
        <span slot="title"> Group</span>
      </el-menu-item>
      <el-menu-item index="/site">
        <i class="el-icon-news"></i>
        <span slot="title"> Site</span>
      </el-menu-item>
      <el-menu-item index="/version">
        <i class="el-icon-news"></i>
        <span slot="title"> Version</span>
      </el-menu-item>
      <el-menu-item index="/online">
        <i class="el-icon-news"></i>
        <span slot="title"> Online</span>
      </el-menu-item>
      <el-menu-item index="/setting">
        <i class="fa fa-cog fa-lg"></i>
        <span slot="title"> Setting</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
export default {
  props: ['isCollapse'],
  name: 'Aside',
    data() {
      return {

      };
    },
    methods: {
      handleOpen() {
        console.log();
      },
      handleClose() {
        console.log();
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 160px;
    min-height: 400px;
  }
  .el-menu{
    border: 0;
  }
</style>