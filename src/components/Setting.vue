<template>
    <div class="setting">
        <Crumb title="Setting"/>
        <div class="tetSet">
            <div class="tetSite">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-card shadow="hover">
                            <div class="siteTitle">
                                <span>site: </span>
                                <span>
                                    <el-button>超小按钮</el-button>
                                    <el-button size="mini">超小按钮</el-button>
                                    <el-button size="mini">超小按钮</el-button>
                                </span>
                            </div>
                            <div class="sitePanel">
                                asdgasdfgasdfasdf
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover">
                        总是显示
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div class="tetSite">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-card shadow="hover">
                        总是显示
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover">
                        总是显示
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div class="tetSite">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-card shadow="hover">
                        总是显示
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover">
                        总是显示
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import '@/assets/css/setting.css'
import Crumb from '@/components/Crumb.vue'
export default {
    name: 'Setting',
    components: {
        Crumb
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tetSet {
    background-color: #f4f4f4;
}
.tetSite {
    margin: 18px auto;
}
.siteTitle {
    border-bottom: 1px solid #f4f4f4;
}
.sitePanel {
    margin: 8px 0;
}
.siteTitle .el-button--mini {
    font-size: 13px;
}
</style>