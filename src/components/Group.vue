<template>
  <div class="group">
    <Crumb title="Group"/>
    <div class="tetUser">
      <el-table
        :data="userData"
        style="width: 100%"
        height="640"
        >
        <el-table-column
        label="日期">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="权限">
        <template slot-scope="scope">
          <p>{{ onLevel(scope.row.level) }}</p>
        </template>
        </el-table-column>
        <el-table-column
        label="用户名">
        <template slot-scope="scope">
          <p>{{ scope.row.username }}</p>
        </template>
        </el-table-column>
        <el-table-column
        label="真是姓名">
        <template slot-scope="scope">
          <p>{{ scope.row.realname }}</p>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
            <template slot-scope="scope">
            <el-button
            size="mini"
            type="primary"
            @click="handleAdd(scope.$index, scope.row)">新增</el-button>
            <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <template v-if="scope.row.id == 1">
                    <el-button
                    size="mini"
                    type="danger"
                    disabled
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                <template v-else>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
    <!--【新增】-->
    <el-dialog
        title="新增用户"
        :visible.sync="dialogAdd"
        width="30%"
        :show-close="false"
        custom-class="dialogAdd">
        <span>
            <el-form ref="form" :model="add" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="add.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="真是姓名">
                    <el-input v-model="add.realname" type="text"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <template>
                    <el-select v-model="add.level" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="add.password" type="password"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" :disabled="!addStatus" @click="onAdd()">确 定</el-button>
        </span>
    </el-dialog>
    <!--【编辑】-->
    <el-dialog
        title="编辑用户"
        :visible.sync="dialogEdit"
        width="30%"
        :show-close="false"
        custom-class="dialogEdit">
        <span>
            <el-form ref="form" :model="edit" label-width="80px">
                <input type="hidden" v-model="edit.id"/>
                <el-form-item label="用户名">
                    <el-input v-model="edit.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="edit.realname" type="text"></el-input>
                </el-form-item>
                <el-form-item label="旧密码">
                    <el-input v-model="edit.oldpwd" type="text"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="edit.password" type="text"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" :disabled="!editStatus" @click="onEdit()">确 定</el-button>
        </span>
    </el-dialog>
    <!--【删除】-->
    <el-dialog
        title="删除用户"
        :visible.sync="dialogDelete"
        width="30%"
        :show-close="false"
        custom-class="dialogDelete">
        <span>你确定删除这个用户吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="onDelete()">确 定</el-button>
        </span>
    </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import {onTips} from '@/assets/js/common.js';
import Crumb from '@/components/Crumb.vue'
export default {
    name: 'Group',
    components: {
        Crumb
    },
    data() {
        return {
            userData: [],
            dialogAdd: false,
            addStatus: false,
            add: {
                username: '',
                realname: '',
                level: '',
                password: ''
            },
            dialogEdit: false,
            editStatus: false,
            edit: {
                id: '',
                username: '',
                realname: '',
                password: '',
                oldpwd: ''
            },
            dialogDelete: false,
            del: {
                id: '',
                index: ''
            },
            options: [
                {value: 0, label: '超级管理员', disabled: true},
                {value: 1, label: '管理员'},
                {value: 2, label: '用户'}
            ]        
        }
    },
    created() {
        let that = this;
        axios.post('/api/list', {}, {})
        .then(function(res) {
            if (res.data.status) {
                that.userData = res.data.data;
            } else {
                onTips(that, 'error', res.data.info);
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误～');
        })
    },
    watch: {
        add: {
            handler: function() {
                if (this.add.username != '' && this.add.realname != '' && this.add.password != '') {
                    this.addStatus = true;
                } else {
                    this.addStatus = false;
                }
            },
            deep: true
        },
        edit: {
            handler: function() {
                if (this.edit.username != '' && this.edit.realname != '' && this.edit.password != '******') {
                    this.editStatus = true;
                } else {
                    this.editStatus = false;
                }
            },
            deep: true
        }
    },
    methods: {
        handleAdd(index, row) {
            this.dialogAdd = true;
        },
        handleEdit(index, row) {
            this.dialogEdit = true;
            this.edit.id = row.id;
            this.edit.username = row.username;
            this.edit.realname = row.realname;
            this.edit.password = '';
            this.edit.index = index;
        },
        handleDelete(index, row) {
            this.dialogDelete = true;
            this.del.id = row.id;
            this.del.index = index;
        },
        onAdd: function() {
            let that = this;
            let data = {
                level: that.add.level,
                username: that.add.username,
                realname: that.add.realname,
                password: that.add.password
            };
            axios.post('/api/add', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.dialogAdd = false;
                    that.userData.push(res.data.data[0]);
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        },
        onEdit: function() {
            let that = this;
            let data = {
                id: that.edit.id,
                username: that.edit.username,
                realname: that.edit.realname,
                password: that.edit.password,
                oldpwd: that.edit.oldpwd
            };

            axios.post('/api/edit', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    let index = that.edit.index;
                    that.userData[index].username = that.edit.username;
                    that.userData[index].realname = that.edit.realname;                    
                    that.dialogEdit = false;
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        },
        onDelete: function() {
            let that = this;
            this.dialogDelete = false;
            let data = {
                id: that.del.id
            };
            axios.post('/api/delete', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.userData.splice(that.del.index, 1);
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        },
        onLevel: function(level) {
            let _level;
            switch(level)
            {
                case 0:
                  _level =  '超级管理员';
                  break;
                case 1:
                  _level =  '管理员';
                  break;
                case 2:
                  _level =  '用户';
                  break;
            }
            return _level;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tetUser {
  margin: 24px auto 0 auto;
  width: 94%;
}
.dialogAdd .dialogEdit .dialogDelete {
    border-radius: 4px;
}
.dialogAdd .el-dialog__header {
    text-align: center;
}
.dialogAdd .dialogEdit .el-input__inner {
    width: 90%;
}
.dialogAdd .el-button {
    width: 40%;
}
.dialogAdd .el-button+.el-button {
    margin: 0 20px 0 30px;
}
.dialogEdit .el-dialog__header {
    text-align: center;
}
.dialogEdit .el-input__inner {
    width: 90%;
}
.dialogEdit .el-button {
    width: 40%;
}
.dialogEdit .el-button+.el-button {
    margin: 0 20px 0 30px;
}
.dialogDelete .el-dialog__header {
    text-align: center;
}
.dialogDelete .el-dialog__body {
    text-align: center;
    font-size: 16px;
}
.dialogDelete .el-input__inner {
    width: 90%;
}
.dialogDelete .el-button {
    width: 40%;
}
.dialogDelete .el-button+.el-button {
    margin: 0 20px 0 30px;
}
</style>