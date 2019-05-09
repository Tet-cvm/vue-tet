<template>
    <div class="online">
        <Crumb :title="online"/>
        <div class="onlinePanel">
            <div class="onlineSubmit">
                <el-row :gutter="20">
                    <el-col :span="3">
                        <template>
                            <el-select v-model="selectBranch" placeholder="请选择">
                                <el-option
                                    v-for="item in branch"
                                    :key="item.id"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-col>
                    <el-col :span="3">
                        <template>
                            <el-select v-model="selectVersion" placeholder="请选择">
                                <el-option
                                    v-for="item in version"
                                    :key="item.id"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-col>
                    <el-col :span="14">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)"></el-progress>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success" size="samll" @click="onRelease()">submit</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="onlineList">
                <template>
                    <el-table
                        :data="lineData"
                        style="width: 100%">
                        <el-table-column
                        prop="version"
                        label="version"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="status"
                        label="status"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="mark"
                        label="mark">
                        </el-table-column>
                        <el-table-column
                        prop="developer"
                        label="developer">
                        </el-table-column>
                        <el-table-column
                        prop="time"
                        label="time">
                        </el-table-column>
                        <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleEdit(scope.$index, scope.row)">rollback</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </template>
                <template v-if="total > 1">
                    <div class="onLinePage">
                        <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="total * 10"
                        :pager-count="5"
                        @current-change="onPage">
                        </el-pagination>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import {onTips} from '@/assets/js/common.js';
import Crumb from '@/components/Crumb.vue'
export default {
    name: 'Online',
    components: {
        Crumb
    },
    data() {
        return {
            online: 'Online',
            lineData: [],
            total: 0,
            branch: [
                {id: 1, value: 'f-test'},
                {id: 2, value: 'f-one'},
                {id: 3, value: 'f-two'},
                {id: 4, value: 'f-three'}
            ],
            selectBranch: '',
            version: [
                {id: 1, value: '234sdfgsd'},
                {id: 2, value: 'sdf3gshf'},
                {id: 3, value: 'gh4gfhjgh'},
                {id: 4, value: 'fgh56564'}
            ],
            selectVersion: ''
        }
    },
    watch: {
        selectBranch: {
            handler: function() {
                console.log(this.selectBranch);
            },
            deep: true
        },
        selectVersion: {
            handler: function() {
                console.log(this.selectVersion);
            },
            deep: true
        }
    },
    created() {
        let that = this;
        axios.post('/api/render', {}, {})
        .then(function(res) {
            if (res.data.status) {
                that.lineData = res.data.data;
                that.total = Math.ceil(res.data.page / 7);
                that.online = 'Online: [ ' + res.data.domain + ' ]';
                console.log(that.total);
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误～');
        })

        //brach
        axios.post('/api/branch', {}, {})
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        })

        //commit
        axios.post('/api/commit', {}, {})
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        })
    },
    methods: {
        onRelease: function() {
            let that = this;
            let data = {
                version: 'abcdefg'
            };
            axios.post('/api/release', Qs.stringify(data), {})
            .then(function(res) {
                console.log(res);
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        onPage: function(val) {
            console.log(val);
            let that = this;

            let data = {
                page: val
            };
            axios.post('/api/page', Qs.stringify(data), {})
            .then(function(res) {
                console.log(res, 'page');
                if (res.data.status) {
                    that.lineData = res.data.data;
                }
            })
            .catch(function(err) {
                onTips(that, 'error', '网络错误～');
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.onlinePanel {

}
.onlineSubmit {
    padding: 48px 6% 20px 6%;
    border-bottom: 1px solid #e2e2e2;
}
.onlineList {
    margin: 0 3%;
    width: 94%;
    
}
.onlineList .el-table {
    height: 448px;
}
.onLinePage {
    margin: 26px 12px 0 0;
    text-align: right;
}
</style>