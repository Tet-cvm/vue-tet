<template>
    <div class="manage" ref="manage">
        <div class="usermanage">
            <el-table :data="manageData" style="width: 100%" :height="tableHeight + 'px'">
                <el-table-column label="序号" prop="id" width="60px"></el-table-column>
                <el-table-column label="角色" prop="role">
                    <template slot-scope="scope">
                        <span>{{ onFilter(scope.row.role) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" prop="name"></el-table-column>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" alt="" />
                    </template>
                </el-table-column>
                <el-table-column label="日期" prop="time"></el-table-column>
                <el-table-column label="操作" width="260px">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="success"
                        round
                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        round
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        round
                        :disabled="scope.row.unionid == '000001' ? true:false"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--【新增对话框】-->
        <el-dialog title="新增" :visible.sync="dialogAdd" top="18vh" :show-close="false" width="380px" custom-class="dialogAdd">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="头像">
                    <el-upload
                    class="avatar-uploader"
                    action="/api/manage/upload"
                    enctype="multipart/form-data"
                    method="post"
                    name="image[]"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="addForm.imageUrl" :src="addForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择权限">
                        <el-option label="超级管理员" value="0"></el-option>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="文案编辑" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input type="password" v-model="addForm.pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAddSubmit('addForm')">立即创建</el-button>
                    <el-button @click="dialogAdd = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--【编辑对话框】-->
        <el-dialog title="编辑" :visible.sync="dialogEdit" top="18vh" :show-close="false" width="380px" custom-class="dialogEdit">
            <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="80px">
                <el-form-item label="头像">
                    <el-upload
                    class="avatar-uploader"
                    action="/api/manage/upload"
                    enctype="multipart/form-data"
                    method="post"
                    name="image[]"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="editForm.role" placeholder="请选择权限">
                        <el-option label="超级管理员" value="0"></el-option>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="文案编辑" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input type="password" v-model="editForm.pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onEditSubmit('editForm')">立即创建</el-button>
                    <el-button @click="dialogEdit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--【删除对话框】-->
        <el-dialog title="警告" :visible.sync="dialogDel" top="30vh" :show-close="false" width="320px" custom-class="dialogDel">
            <span>你确定要删除该用户吗 ?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDel = false">取 消</el-button>
                <el-button @click="onDelSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Manage',
    data() {
        return {
            tableHeight: '',
            manageData: [],
            dialogAdd: false,
            addForm: {
                img: '',
                imageUrl: '',
                role: '',
                name: '',
                pwd: ''
            },
            addRules: {
                role: [
                    { required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            },
            dialogEdit: false,
            editForm: {
                index: Number,
                unionid: '',
                img: '',
                imageUrl: '',
                role: '',
                name: '',
                pwd: '******'
            },
            editRules: {
                role: [
                    { required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            },
            dialogDel: false,
            delForm: {
                index: Number,
                unionid: ''
            }
        }
    },
    created() {
        let that = this;
        that.$axios.post('/api/manage/list', {}, {})
        .then(function(res){
            that.manageData = res.data;
        })
        .catch(function(err) {
            that.$toast(that, 'error', '网络错误～');
        })
    },
    mounted() {
        let that = this;
        that.tableHeight = that.$refs.manage.offsetHeight;
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
                    return '文案编辑';
            }
        },
        handleAdd(index, row) {
            this.dialogAdd = true;
        },
        beforeAvatarUpload(file) {
            let that = this;
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                that.$toast(that, 'error', '上传头像图片只能是 JPG PNG 格式!');
                return;
            }
            if (!isLt1M) {
                that.$toast(that, 'error', '上传头像图片大小不能超过 1MB!');
                return;
            }
            return isJPG && isLt1M;
        },
        handleAvatarSuccess(res, file) {
            if (this.dialogAdd) {
                this.addForm.img = res;
                this.addForm.imageUrl = URL.createObjectURL(file.raw);
            } else if (this.dialogEdit) {
                this.editForm.img = res;
                this.editForm.imageUrl = URL.createObjectURL(file.raw);
            }
        },
        onAddSubmit(addForm) {
            let that = this;
            that.$refs[addForm].validate((valid)=>{
                if (valid) {
                    that.$axios.post('/api/manage/add', that.$qs.stringify(that.addForm), {})
                    .then(function(res){
                        if (res.data.status) {
                            that.dialogAdd = false;
                            that.manageData.push(res.data.data[0]);
                            that.$toast(that, 'success', res.data.message);
                        } else {
                            that.$toast(that, 'error', res.data.message);
                        }
                    })
                    .catch(function(err) {
                        that.$toast(that, 'error', '网络错误～');
                    })
                } else {
                    return false;
                }
            })
        },
        handleEdit(index, row) {
            this.editForm.index = index;
            this.editForm.unionid = this.manageData[index].unionid;
            this.editForm.img = this.manageData[index].img;
            this.editForm.imageUrl = this.manageData[index].icon;
            this.editForm.role = this.manageData[index].role.toString();
            this.editForm.name = this.manageData[index].name;
            this.dialogEdit = true;
        },
        onEditSubmit(editForm) {
            let that = this;
            that.$refs[editForm].validate((valid)=>{
                if (valid) {
                    that.$axios.post('/api/manage/edit', that.$qs.stringify(that.editForm), {})
                    .then(function(res){
                        if (res.data.status) {
                            that.manageData[that.editForm.index].role = res.data.data[0].role;
                            that.manageData[that.editForm.index].name = res.data.data[0].name;
                            that.manageData[that.editForm.index].time = res.data.data[0].time;
                            that.manageData[that.editForm.index].img = res.data.data[0].img;
                            that.manageData[that.editForm.index].icon = res.data.data[0].icon;
                            that.dialogEdit = false;
                            that.$toast(that, 'success', res.data.message);
                        } else {
                            that.$toast(that, 'error', res.data.message);
                        }
                    })
                    .catch(function(err) {
                        that.$toast(that, 'error', '网络错误～');
                    })
                } else {
                    return false;
                }
            })
        },
        handleDelete(index, row) {
            this.delForm.index = index;
            this.delForm.unionid = row.unionid;
            this.dialogDel = true;
        },
        onDelSubmit() {
            let that = this;
            let data = {
                'unionid': that.delForm.unionid
            }
            that.$axios.post('/api/manage/del', that.$qs.stringify(data), {})
            .then(function(res){
                if (res.data.status) {
                    that.manageData.splice(that.delForm.index, 1);
                    that.dialogDel = false;
                    that.$toast(that, 'success', res.data.message);
                } else {
                    that.$toast(that, 'error', res.data.message);
                }
            })
            .catch(function(err) {
                that.$toast(that, 'error', '网络错误～');
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.manage {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}
.usermanage {
    margin: 0 auto;
    width: 92%;
}
.usermanage img {
    width: 38px;
    height: 38px;
}
</style>