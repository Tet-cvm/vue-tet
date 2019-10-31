<template>
    <div class="member">
        <el-table :data="manageData" style="width: 100%" height="100%">
            <el-table-column label="序号" prop="id" width="60px"></el-table-column>
            <el-table-column label="角色" prop="role">
                <template slot-scope="scope">
                    <span>{{ onFilter(scope.row.role) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="user_name"></el-table-column>
            <el-table-column label="头像">
                <template slot-scope="scope">
                    <img :src="scope.row.user_icon" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--【删除对话框】-->
        <el-dialog title="警告" :visible.sync="dialogDel" top="30vh" :show-close="false" width="320px" custom-class="dialogDel" :before-close="handleClose">
            <span>你确定要删除该用户吗 ?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDel = false">取 消</el-button>
                <el-button @click="dialogDel = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--【编辑对话框】-->
        <el-dialog title="编辑" :visible.sync="dialogEdit" top="10vh" :show-close="false" width="680px" custom-class="dialogEdit" :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="即时配送">
                    <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="活动性质">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                        <el-checkbox label="地推活动" name="type"></el-checkbox>
                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="线上品牌商赞助"></el-radio>
                        <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script lang="ts">
export default {
    name: 'Member',
    data() {
        return {
            manageData: [],
            dialogDel: false,
            dialogEdit: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        }
    },
    created() {
        let that = this;
        that.$axios.post('/api/manage', {}, {})
        .then(function(res){
            console.log(res, 'res');
            that.manageData = res.data;
        })
        .catch(function(err) {
            that.$toast(that, 'error', '网络错误～');
        })
    },
    mounted() {
        let that = this;
    },
    methods: {
        onFilter: function(role) {
            switch(role)
            {
                case 0:
                    return '超级管理员';
                case 1:
                    return '管理员';
                case 2:
                    return '用户';
            }
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.dialogEdit = true;
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.dialogDel = true;
        },
        handleClose(done) {

        },
        onSubmit() {
            console.log('submit!');
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.member {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}
.member img {
    width: 38px;
    height: 38px;
}
</style>