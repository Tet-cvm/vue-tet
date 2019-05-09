<template>
    <div class="setting">
        <Crumb title="Site"/>
        <div class="Site">
            <el-button type="primary" size="mini" plain @click="onNginx()">nginx.conf</el-button>
            <el-button type="success" size="mini" plain @click="onNewSite()">new Site</el-button>
        </div>
        <div class="SitePanel">
            <template>
            <el-table
                :data="siteData"
                height="630"
                style="width: 100%">
                <el-table-column
                prop="time"
                label="time"
                width="180">
                </el-table-column>
                <el-table-column
                prop="domain"
                label="domain"
                width="180">
                </el-table-column>
                <el-table-column
                label="status">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status">
                            <i class="el-icon-success"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-warning"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                prop="directory"
                label="directory">
                </el-table-column>
                <el-table-column label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="success"
                        @click="handleSet(scope.row.id)">set</el-button>
                        <el-button
                        size="mini"
                        type="warning"
                        @click="handleStart(scope.row.id, scope.$index)">{{ scope.row.status ? 'stop' : 'start' }}</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDel(scope.row.id, scope.$index)">del</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </template>
        </div>
        <!--【新增站点】-->
        <el-dialog
        title="提示"
        :visible.sync="newDialog"
        width="42%"
        :show-close="false"
        center>
        <span>
            <el-form :model="ruleNew" :rules="rules" ref="ruleNew" label-width="100px" class="demo-ruleForm">
                <el-form-item label="domain" prop="domain">
                    <el-input v-model="ruleNew.domain" placeholder="baidu.com"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="criterion" prop="criterion">
                            <el-switch v-model="ruleNew.criterion"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="start" prop="start">
                            <el-switch v-model="ruleNew.start"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="directory" prop="directory">
                    <el-input v-model="ruleNew.directory" placeholder="baidu"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="newDialog = false">reset</el-button>
                    <el-button type="success" @click="submitNew('ruleNew')">add</el-button>
                </el-form-item>
            </el-form>
        </span>
        </el-dialog>
        <!--【删除站点】-->
        <el-dialog
            title="delete site"
            :visible.sync="delDialog"
            width="30%"
            :show-close="false"
            custom-class="dialogDelete">
            <span>Are sure delete this site</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialog = false">取 消</el-button>
                <el-button type="primary" @click="onDelete()">确 定</el-button>
            </span>
        </el-dialog>
        <!--【编辑器】-->
        <el-dialog
            title="edit site"
            :visible.sync="codemirrorDialog"
            width="60%"
            :show-close="false"
            custom-class="dialogDelete">
            <span>
                <codemirror
                    ref="myCm"
                    :value="codeMsg"
                    v-model="codeMsg"
                    :options="cmOptions"
                    :change="onChange()"
                    class="code">
                </codemirror>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="codemirrorDialog = false; nginxStatus = false;">取 消</el-button>
                <el-button type="primary" @click="nginxStatus ? onSiteNginx() : onSiteFile()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import { codemirror } from 'vue-codemirror'
require("codemirror/mode/python/python.js")
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
import {onTips} from '@/assets/js/common.js';
import Crumb from '@/components/Crumb.vue'
export default {
    name: 'Setting',
    components: {
        Crumb,
        codemirror
    },
    data() {
        return {
            siteData: [],
            newDialog: false,
            delDialog: false,
            nginxStatus: false,
            nowID: Number,
            nowIndex: Number,
            ruleNew: {
                domain: '',
                criterion: true,
                start: true,
                directory: ''
            },
            rules: {
            domain: [
                { required: true, message: '请输入域名~', trigger: 'blur' },
                { min: 2, max: 100, message: '域名输入错误~', trigger: 'blur' }
            ],
            directory: [
                { required: true, message: '请输入站点根目录名称~', trigger: 'blur' },
                { min: 3, max: 30, message: '站点根目录名称错误~', trigger: 'blur' }
            ]
            },
            codemirrorDialog: false,
            codeMsg: '',
            myCm: '',
            cmOptions: {
                value: '',
                mode: 'text/html',
                theme: 'foo bar',
                indentUnit: 2,
                smartIndent: true,
                tabSize: 4,
                readOnly: false,
                showCursorWhenSelecting: true,
                lineNumbers: true,
            }
        }
    },
    created() {
        let that = this;
        axios.post('/api/project', {}, {})
        .then(function(res) {
            if (res.data.status) {
                that.siteData = res.data.data;
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误～');
        })
    },
    methods: {
        onNginx: function() {
            let that = this;
            that.nginxStatus = true;
            axios.post('/api/nginx', {}, {})
            .then(function(res) {
                if (res.data.status) {
                    that.codeMsg = res.data.data;
                    that.codemirrorDialog = true;
                }
            })
            .catch(function() {
                onTips(that, 'error', '网络错误～');
            })
        },
        onSiteNginx: function() {
            let that = this;
            let data = {
                file: that.codeMsg
            };
            axios.post('/api/config', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.nginxStatus = false;
                    that.codemirrorDialog = false;
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function() {
                onTips(that, 'error', '网络错误～');
            })
        },
        onNewSite: function() {
            this.newDialog = true;
        },
        handleSet: function(id) {
            let that = this;
            that.nowID = id;
            let data = {
                id: id
            };
            axios.post('/api/rest', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.codeMsg = res.data.data;
                    that.codemirrorDialog = true;
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        },
        handleStart: function(id, index) {
            let that = this;
            let data = {
                id: id,
                status: !that.siteData[index].status ? 1 : 0
            };
            axios.post('/api/start', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.siteData[index].status = !that.siteData[index].status;
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        },
        handleDel: function(id, index) {
            this.delDialog = true;
            this.nowID = id;
            this.nowIndex = index;
        },
        submitNew: function(ruleNew) {
            let that = this;
            that.$refs[ruleNew].validate((valid) => {
                if (valid) {
                    let data = {
                        domain: that.ruleNew.domain,
                        criterion: that.ruleNew.criterion ? 1 : 0,
                        status: that.ruleNew.start ? 1 : 0,
                        directory: that.ruleNew.directory
                    }
                    axios.post('/api/new', Qs.stringify(data), {})
                    .then(function(res) {
                        if (res.data.status) {
                            that.newDialog = false;
                            that.siteData.push(res.data.data[0]);
                            onTips(that, 'success', res.data.info);
                        } else {
                            onTips(that, 'error', res.data.info);
                        }
                    })
                    .catch(function(err) {
                        onTips(that, 'error', '网络错误～');
                    })
                } else {
                    return false;
                }
            });
        },
        onDelete: function() {
            let that = this;
            let data = {
                id: that.nowID
            }
            axios.post('/api/clear', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.delDialog = false;
                    that.siteData.splice(that.nowIndex, 1)
                    onTips(that, 'success', res.data.info);
                }
            })
            .catch(function() {
                onTips(that, 'error', '网络错误～');
            })
        },
        onSiteFile: function() {
            let that = this;
            let data = {
                id: that.nowID,
                file: that.codeMsg
            };
            axios.post('/api/adapt', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    that.codemirrorDialog = false;
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function() {
                onTips(that, 'error', '网络错误～');
            })
        },
        onChange: function() {
            console.log('2345')
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Site {
    width: 97%;
    text-align: right;
}
.SitePanel {
    margin: 0 auto;
    width: 96%;
}
.SitePanel .el-icon-success {
    color: #67c23a;
}
.SitePanel .el-icon-warning {
    color: #f56c6c;
}
</style>