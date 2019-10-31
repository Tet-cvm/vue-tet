<template>
    <div class="aside">
        <div class="logo">
            <img src="@/assets/image/logo.png" alt="">
        </div>
        <el-menu
            :default-active="path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :router="true"
            active-text-color="#ffd04b"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            >
            <el-menu-item index="/main">
                <i class="fa fa-home fa-lg"></i>
                <span slot="title">Home</span>
            </el-menu-item>
            <el-menu-item index="/movie">
                <i class="fa fa-video-camera fa-lg"></i>
                <span slot="title">Movie</span>
            </el-menu-item>
            <el-menu-item index="/manage">
                <i class="fa fa-sitemap fa-lg"></i>
                <span slot="title">Manage</span>
            </el-menu-item>
            <el-menu-item index="/member">
                <i class="fa fa-users fa-lg"></i>
                <span slot="title">Member</span>
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
            path: '/main'
        }
    },
    created() {
        this.path = location.pathname;
    },
    methods: {
        handleOpen() {
            console.log('open');
        },
        handleClose() {
            console.log('close');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 106px;
    font-size: 28px;
    color: #ffffff;
    border-bottom: 1px solid #909399;
}
.logo img {
    width: 58px;
    height: 58px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 160px;
    min-height: 400px;
}
.el-menu {
    border: 0;
}
.el-menu li span {
    margin: 0 0 0 12px;
}
</style>