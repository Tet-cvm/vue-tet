<template>
    <div class="Crumb">
        <div class="Breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>TeT</el-breadcrumb-item>
                <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: ['title'],
    name: 'Crumb',
    data() {
        return {

        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Crumb {

}
</style>