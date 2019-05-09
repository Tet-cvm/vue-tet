<template>
  <div class="main">
    <el-container>
      <el-aside>
        <Aside :isCollapse="isCollapse"/>
      </el-aside>
      <el-container>
        <el-header>
          <Header :isCollapse="isCollapse" :onCollapse="onCollapse" :isNotice="isNotice" :onNotice="onNotice" :onQuit="onQuit"/>
        </el-header>
        <el-main>
          <el-container class="tetContain">
            <el-main>
              <router-view :isNotice="isNotice"/>
            </el-main>
            <el-aside>
              <Notice :Width="Width"/>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {getCookie, delCookie} from '@/assets/js/cookie.js'
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
import Notice from '@/components/Notice.vue'
export default {
    name: 'Main',
    data() {
        return {
            isCollapse: true,
            isNotice: false,
            Width: 0
        };
    },
    components: {
        Aside,
        Header,
        Notice
    },
    mounted() {
        if (getCookie('username') == '') {
            this.$router.push('/');
        }
    },
    methods: {
        onCollapse: function(status) {
            this.isCollapse = !status;
        },
        onNotice: function(status) {
            this.onToggle(status);
            this.isNotice = !status;
        },
        onQuit: function() {
            delCookie('username');
            this.$router.push('/');
        },
        onToggle: function(status) {
            let that = this;
            let toggle = setInterval(function() {
            status ? (that.Width -= 3) : (that.Width += 3);
            if (that.Width >= 300 || that.Width <= 0) {
                clearInterval(toggle);
            }
            }, 2);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main {
  border-top: 1px solid #f0f2f5;
}
.el-menu {
  border: 0;
}
.el-aside {
  width: auto !important;
  max-height: 100vh;
  background-color: #545c64;
  overflow: hidden;
}
.el-main {
  height: 90vh !important;
  padding: 0;
  background-color: #f0f2f5;
}
.tetContain .el-aside {
  height: 90vh !important;
  background-color: #ffffff;
}
.tetContain .el-main {
  margin: 1vh;
  height: 88vh !important;
  background-color: #ffffff;
  overflow: hidden;
}
</style>