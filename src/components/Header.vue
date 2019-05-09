<template>
  <div class="header flex">
    <div class="collapse flexLeft" @click="onCollapse(isCollapse)">
      <img src="@/assets/image/isCollapse.jpg" alt="">
    </div>
    <div class="tetUser flexRight">
      <img @click="onNotice(isNotice)" src="@/assets/image/tetUser.jpg" alt="">
      <span @click="onNotice(isNotice)">
        <el-badge is-dot class="item">lxm</el-badge>
      </span>
      <i @click="onNotice(isNotice)" class="el-icon-arrow-down"></i>
    </div>
    <div class="quit" @click="onQuit()">退出</div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['onCollapse', 'onNotice', 'isCollapse', 'isNotice', 'onQuit'],
  name: 'Header',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header {
  padding: 13px 0;
}
.collapse {
  flex: 1;
  cursor: pointer;
}
.collapse img {
  width: 32px;
  height: 32px;
  opacity: 0.88;
}
.tetUser {
  flex: 10;
}
.tetUser img {
  width: 32px;
  height: 32px;
  border-radius: 25px;
  cursor: pointer;
}
.tetUser span {
  margin: 0 0 0 12px;
  font-size: 17px;
  line-height: 30px;
  cursor: pointer;
}
.tetUser i {
  margin: 0 26px 0 8px;
  line-height: 30px;
  cursor: pointer;
}
.quit {
  line-height: 30px;
}
</style>
