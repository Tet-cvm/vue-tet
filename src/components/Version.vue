<template>
    <div class="version">
        <template v-if="complete">
            <el-form label-position="top" :model="VersionData" :rules="VersionRules" ref="VersionData">
                <div class="project">
                    <span class="config">项目配置 ( git | svn )</span>
                    <el-divider></el-divider>
                    <div class="content">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目名称" prop="pro">
                                    <el-select v-model="VersionData.pro" @change="onSelect()" size="medium">
                                        <el-option
                                            v-for="item in VersionData.project"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            <span style="float: left">{{ item.label }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.status ? '已完成配置('+ item.type +')' : '未配置' }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="部署环境" prop="rel">
                                    <el-select v-model="VersionData.rel" size="medium">
                                        <el-option
                                            v-for="item in VersionData.release"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="git | svn地址" prop="url">
                                    <el-input v-model="VersionData.url" size="medium" placeholder="https://github.com/Tet-cvm/test.git"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="默认分支" prop="branch">
                                    <el-input v-model="VersionData.branch" size="medium"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="选择版本控制系统" prop="type">
                                    <el-tooltip placement="top" popper-class="popper">
                                        <div slot="content">请先设置SSH keys<br>然后再设置站点环境</div>
                                        <el-radio v-model="VersionData.type" label="0" border>Git (ssh)</el-radio>
                                    </el-tooltip>
                                    <el-tooltip placement="top" popper-class="popper">
                                        <div slot="content">设置站点环境, 终端执行以下命令<br>$ sh /git.sh<br>$ Username: you username<br>$ password: you password</div>
                                        <el-radio v-model="VersionData.type" label="1" border>Git (password)</el-radio>
                                    </el-tooltip>
                                    <el-tooltip placement="top" popper-class="popper">
                                        <div slot="content">设置站点环境, 终端执行以下命令<br>$ password: you password<br>$ yes</div>
                                        <el-radio v-model="VersionData.type" label="2" border>Svn (password)</el-radio>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="server">
                    <span class="target">目标服务器: {{ ip }}</span>
                    <el-divider></el-divider>
                </div>
                <div class="submit">
                    <el-form-item>
                        <el-button type="primary" size="medium" :disabled="disabled" @click="onSubmit(VersionData)">设置环境</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </template>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import Qs from 'qs';
import { onTips } from '@/assets/js/common.js';
export default {
    name: 'Version',
    data() {
        return {
            aaa: true,
            complete: false, //是否加载完成
            resData: Array,
            saveData: [],
            VersionData: {
                pro: Number,
                project: [],
                rel: Number,
                release: [
                    { value: 1, label: '开发环境' },
                    { value: 0, label: '生产环境' },
                ],
                url: '',
                branch: '',
                type: Number,
            },
            disabled: true,
            ip: '',
            VersionRules: {
                pro: [
                    { required: true, message: '', trigger: 'blur' },
                    // { min: 2, max: 10, message: '', trigger: 'blur' }
                ],
                rel: [
                    { required: true, message: '', trigger: 'blur' },
                    // { min: 2, max: 10, message: '', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: '请输入 git | svn 地址', trigger: 'blur' },
                    { min: 0, max: 100, message: '请输入合法的 git | svn 地址', trigger: 'blur' }
                ],
                branch: [
                    { required: true, message: '请输入默认 (开发 | 生产环境) 分支', trigger: 'blur' },
                    { min: 0, max: 24, message: '请输入合法的分支名称', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        let that = this;
        axios.post('/api/website', {}, {})
        .then(function(res) {
            if (res.data.status) {
                let resData = res.data.data;
                that.resData = resData;
                let pro = Number;
                let project = [];

                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].active) {
                        pro = resData[i].id;
                        that.VersionData.rel = resData[i].release;
                        that.VersionData.url = resData[i].url;
                        that.VersionData.branch = resData[i].branch;
                        that.VersionData.type = resData[i].type.toString();
                        that.ip = resData[i].ip;
                    }
                    let data = {value: resData[i].id, label: resData[i].domain, status: resData[i].status, type: resData[i].type==2 ? 'svn': 'git' }
                    project.unshift(data);
                }
                that.VersionData.project = project;
                that.VersionData.pro = pro;
                that.saveData = [that.VersionData.pro, that.VersionData.rel, that.VersionData.url, that.VersionData.branch]
                that.complete = true;
            } else {
                onTips(that, 'error', res.data.info);
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误~');
        })
    },
    watch: {
        VersionData: {
            handler: function() {
                let that = this;
                for (let i=0; i<that.resData.length; i++) {
                    if (that.resData[i].id == that.VersionData.pro) {
                        if (that.resData[i].status) {
                            let arr = [that.VersionData.pro, that.VersionData.rel, that.VersionData.url, that.VersionData.branch];
                            if (arr.toString() == that.saveData.toString()) {
                                that.disabled = true;
                            } else {
                                that.disabled = false;
                            }
                        } else {
                            that.disabled = false;
                        }
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        onSelect: function() {
            let that = this;
            for (let i=0; i<that.resData.length; i++) {
                if (that.resData[i].id == that.VersionData.pro) {
                    that.VersionData.rel = that.resData[i].release;
                    that.VersionData.url = that.resData[i].url;
                    that.VersionData.branch = that.resData[i].branch;
                    that.VersionData.type = that.resData[i].type.toString();
                    that.saveData = [that.resData[i].id, that.resData[i].release, that.resData[i].url, that.resData[i].branch];
                }
            }
        },
        onSubmit: function(VersionData) {
            let that = this;
            that.$refs.VersionData.validate((valid)=>{
                if (valid) {
                    //判断url是否与type匹配
                    let pass = false;
                    if (that.VersionData.type == '0') {
                        pass = that.VersionData.url.indexOf('git@') != -1
                    } else if (that.VersionData.type == '1') {
                        pass = that.VersionData.url.indexOf('https://github.com') != -1
                    } else if (that.VersionData.type == '2') {
                        pass = that.VersionData.url.indexOf('--username') != -1
                    }

                    if (pass) {
                        that.onAxios();
                    } else {
                        onTips(that, 'error', 'git | svn地址与版本控制系统不匹配~');
                    }
                } else {
                    return false
                }
            })
        },
        onAxios: function() {
            let that = this;
            let data = {
                'id': that.VersionData.pro,
                'project': that.VersionData.pro,
                'release': that.VersionData.rel,
                'uri': that.VersionData.url,
                'branch': that.VersionData.branch,
                'type': that.VersionData.type
            };

            axios.post('/api/mate', Qs.stringify(data), {})
            .then(function(res) {
                if (res.data.status) {
                    onTips(that, 'success', res.data.info);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function() {
                onTips(that, 'error', '网络错误~');
            })
        }
    }
}
</script>

<style scoped lang="less">
.content {
    padding: 0 32px;
}
.content .el-input {
    width: 82%;
}
.config {
    display: block;
    margin: 28px 0 0 32px;
}
.target, .submit {
    display: block;
    margin: 58px 0 0 32px;
}
.popper div {
    font-size: 13px;
    font-weight: normal;
}
</style>


