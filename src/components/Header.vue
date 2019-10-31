<template>
    <div class="header flex">
        <div class="collapse flexLeft" @click="onCollapse(isCollapse)">
            <template v-if="isCollapse">
                <i class="fa fa-sign-in fa-lg"></i>
            </template>
            <template v-else>
                <i class="fa fa-sign-in fa-lg tetRotate"></i>
            </template>
        </div>
        <div class="tetUser flexRight">
            <img :src="$store.state.user_icon" alt="">
            <span>
                <el-badge class="item">{{ $store.state.user_name }}</el-badge>
            </span>
            <div class="quit" @click="onQuit()">退出</div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        props: ['onCollapse', 'isCollapse', 'onQuit'],
        name: 'Header',
        data() {
            return {

            }
        },
        created() {
        },
        mounted() {

        }
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
    justify-content: center;
    align-items: center;
}
.collapse i {
    color: #909399;
}
.tetUser {
    flex: 16;
}
.tetUser img {
    width: 32px;
    height: 32px;
    border-radius: 25px;
    cursor: pointer;
}
.tetUser span {
    display: inline-block;
    margin: 0 26px 0 12px;
    font-size: 17px;
    line-height: 30px;
    cursor: pointer;
}
.tetRotate {
    transform: rotate(180deg);
}
.quit {
    line-height: 30px;
}
</style>
