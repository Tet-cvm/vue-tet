<template>
  <div class="home">
    <Crumb title="Home"/>
    <div class="tetCVM">
        <el-row :gutter="30">
            <el-col :span="circle">
                <div id="tetLoad" class="tetCanvas"></div>
            </el-col>
            <el-col :span="circle">
                <div id="tetCpu" class="tetCanvas"></div>
            </el-col>
            <el-col :span="circle">
                <div id="tetMemory" class="tetCanvas"></div>
            </el-col>
            <el-col :span="circle">
                <div id="tetDisk" class="tetCanvas"></div>
            </el-col>
        </el-row>
    </div>
    <div class="tetTraffic">
        <el-row :gutter="0">
            <el-col :span="isNotice ? 18 : 14">
                <div id="categroy"></div>
            </el-col>
            <el-col :span="isNotice ? 0 : 10">
                <div class="tetMail">
                    <div class="tetSystem flex">
                        <span class="flexLeft">系统: {{ cvmName }}</span>
                        <span class="flexCenter">
                            <el-button type="primary"  size="small" icon="el-icon-refresh" :loading="loading" @click="reLoad()">{{ loadTxt }}</el-button>
                        </span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
    <template>
        <el-dialog
        title="请选择安装集成环境"
        :visible.sync="installDialog"
        width="42%"
        :lock-scroll="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        center>
        <div class="install">
            <el-row :gutter="16">
                <el-col :span="12">
                    <el-card shadow="always">
                        <h3>LAMP</h3>
                        <div v-for="item in lamp" :key="item" class="installItem">
                            {{'集成项: ' + item }}
                        </div>
                        <el-button type="primary" round @click="onInstallLamp()">一键安装</el-button>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="always">
                        <h3>LNMP (推荐)</h3>
                        <div v-for="item in lnmp" :key="item" class="installItem">
                            {{'集成项: ' + item }}
                        </div>
                        <el-button type="primary" round @click="onInstallLnmp()">一键安装</el-button>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        </el-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import {onTips} from '@/assets/js/common.js';
import * as echarts from 'echarts';
import Crumb from '@/components/Crumb.vue'
export default {
    props: ['isNotice'],
    name: 'Home',
    components: {
        Crumb
    },
    data() {
        return {
            installDialog: false,
            lamp: ['Linux','Apache', 'MySQL', 'PHP'],
            lnmp: ['Linux','Nginx', 'MySQL', 'PHP'],
            domLoad: null,
            domCpu: null,
            domMemory: null,
            domDisk: null,
            nowLoadData: 18,
            nowCpuData: 18,
            nowMemoryData: 18,
            nowDiskData: 18,
            getLoadData: Number,
            getCpuData: Number,
            getMemoryData: Number,
            getDiskData: Number,
            dangerColor: '#09BB07',
            cvmName: '',
            circle: 5,
            loading: false,
            loadTxt: '重启服务器',
            round: {'load': 0, 'cpu': 0, 'memory': 0, 'disk': 0},
        }
    },
    created() {
        let that = this;

        axios.post('/api/origin', {}, {})
        // axios.get('/api/origin', {})
        .then(function(res) {
            if (res.data.status) {
                let data = res.data.data;
                let arr = data.split('\n');
                let environment;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf('environment') != -1) {
                        environment = arr[i];
                    }
                }
                that.installDialog = environment.indexOf('None') != -1;
            } else {
                onTips(that, 'error', res.data.info);
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误~');
        })

        that.axiosRound();
        let Timer = setInterval(function() {
            that.axiosRound();
        }, 3600);

        axios.post('/api/message', {}, {})
        .then(function(res) {
            if (res.data.status) {
                that.cvmName = res.data.data;
            } else {
                onTips(that, 'error', res.data.info);
            }
        })
        .catch(function(err) {
            onTips(that, 'error', '网络错误~');
        })

        axios.post('/api/chart', {}, {})
        .then(function(res){
            console.log(res);
            if (res.data.status) {
                var categroy = echarts.init(document.getElementById('categroy'));
                that.onCategroy(categroy, res.data.data.ltime, res.data.data.ntime, res.data.data.ldata, res.data.data.ndata);
            } else {
                onTips(that, 'error', res.data.info);
            }
        })
        .catch(function(err){
            onTips(that, 'error', '网络错误~');
        })
    },
    watch: {
        getLoadData: function() {
            this.onIncrease(this.domLoad, this.nowLoadData, this.getLoadData);
        },
        getCpuData: function() {
            this.onIncrease(this.domCpu, this.nowCpuData, this.getCpuData);
        },
        getMemoryData: function() {
            this.onIncrease(this.domMemory, this.nowMemoryData, this.getMemoryData);
        },
        getDiskData: function() {
            this.onIncrease(this.domDisk, this.nowDiskData, this.getDiskData);
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.domLoad = echarts.init(document.getElementById('tetLoad'));
            this.domCpu = echarts.init(document.getElementById('tetCpu'));
            this.domMemory = echarts.init(document.getElementById('tetMemory'));
            this.domDisk = echarts.init(document.getElementById('tetDisk'));
            this.onInitialize(this.domLoad, '负载均衡', this.nowLoadData);
            this.onInitialize(this.domCpu, 'CPU使用率', this.nowCpuData);
            this.onInitialize(this.domMemory, '内存使用率', this.nowMemoryData);
            this.onInitialize(this.domDisk, '硬盘使用率', this.nowDiskData);
        })
    },
    methods: {
        onInstallLamp: function() {
            let that = this;
            axios.post('/shell/lamp', {}, {})
            .then(function(res){
                if (res.data.status) {
                    console.log(res);
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err){
                onTips(that, 'error', '网络错误~');
            })
        },
        onInstallLnmp: function() {
            let that = this;
            axios.post('/shell/lnmp', {}, {})
            .then(function(res){
                if (res.data.status) {
                    that.installDialog = false;
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err){
                onTips(that, 'error', '网络错误~');
            })
        },
        axiosRound: function() {
            let that = this;
            axios.post('/api/round', {}, {})
            .then(function(res){
                console.log(res.data);
                if (res.data.status) {
                    let Data = res.data.data;
                    that.getLoadData = Data.load;
                    that.getCpuData = Data.cpu;
                    that.getMemoryData = Data.memory;
                    that.getDiskData = Data.disk;
                } else {
                    onTips(that, 'error', res.data.info);
                }
            })
            .catch(function(err){
                onTips(that, 'error', '网络错误~');
            })
        },
        //初始化数据
        onInitialize: function(myChart, Title, Data) {
            var option = {
                title: {
                    text: Title,
                    left: 'center',
                    bottom: 4,
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: '#666666'
                    }
                },
                tooltip: {
                    show: true,
                    confine: true,
                    trigger: 'item',
                    formatter: "{a} <br/> 比例：( {d}% )"
                },
                color: ['#b2b2b2', this.dangerColor],
                calculable : false,
                series: [{
                    name: Title,
                    type:'pie',
                    radius: ['47%', '60%'],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value: (100-Data).toFixed(1), name: (100-Data).toFixed(1) + '%'},
                        {value: Data.toFixed(1), name: Data.toFixed(1) + '%', label: {show: true , fontSize: '19',  fontWeight: 'bold'}},
                    ]
                }]
            };
            myChart.setOption(option);
        },
        //数据动态增减
        onIncrease: function(myChart, nowData, getData) {
            let that = this;
            if (nowData != getData) {
                let timer = setInterval(function() {
                    if (nowData < getData) {
                        nowData++;
                        that.onApply(myChart, nowData);
                        if (nowData >= getData) {
                            that.nowLoadData = that.getLoadData;
                            that.nowCpuData = that.getCpuData;
                            that.nowMemoryData = that.getMemoryData;
                            that.nowDiskData = that.getDiskData;
                            clearInterval(timer);
                        }
                    }

                    if (nowData > getData) {
                        nowData--;
                        that.onApply(myChart, nowData);
                        if (nowData <= getData) {
                            that.nowLoadData = that.getLoadData;
                            that.nowCpuData = that.getCpuData;
                            that.nowMemoryData = that.getMemoryData;
                            that.nowDiskData = that.getDiskData;
                            clearInterval(timer);
                        }
                    }
                }, 45);
            }
        },
        onApply: function(myChart, Data) {
            let that = this;
            Data > 68 ? (Data > 86 ? (this.dangerColor = '#b44038'):(this.dangerColor = '#c9856b')):(this.dangerColor = '#09BB07');
            myChart.setOption({
                animation: false,
                color: ['#b2b2b2', this.dangerColor],
                series: [{
                    data:[
                        {value: (100-Data).toFixed(1), name: (100-Data).toFixed(1)+ '%'},
                        {value: Data.toFixed(1), name: Data.toFixed(1) + '%', label: {show: true , fontSize: '19',  fontWeight: 'bold'}},
                    ]
                }]
            })
        },
        reLoad: function() {
            let that = this;
            if (!that.loading) {
                that.loading = true;
                that.loadTxt = '重启中...';
                axios.post('/api/restart', {}, {})
                .then(function(res) {
                    if (res.data.status) {
                        that.loading = false;
                        that.loadTxt = '重启服务器';
                    }
                    console.log(res);
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        },
        onCategroy: function(myChart, lastTime, nowTime, lastData, nowData) {
            var option = {
                color: ['#e64340', '#09BB07'],
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data:['昨日流量', '今日流量']
                },
                grid: {
                    top: 70,
                    bottom: 42
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#333333'
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '今日  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: nowTime
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#999999'
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '昨日  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: lastTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name:'今日流量',
                        type:'line',
                        xAxisIndex: 1,
                        smooth: true,
                        data: nowData
                    },
                    {
                        name:'昨日流量',
                        type:'line',
                        smooth: true,
                        data: lastData
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tetCVM {
    margin: 0 auto;
    padding: 0 0 16px 0;
    width: 97%;
    border-bottom: 2px solid #f0f2f5;
}
.tetCanvas {
    width: 200px;
    height: 230px;
}
.tetTraffic {
    margin: 0 auto;
    width: 97%;
}
#categroy {
    margin: 16px 0 0 0;
    width: 100%;
    height: 400px;    
}
.tetMail {
    margin: 16px 0 0 0;
    padding: 8px 12px;
    height: 400px;
    border-left: 2px solid #f0f2f5;
}
.tetSystem {
    padding: 8px;
    border-bottom: 1px solid #f0f2f5;
}
.tetSystem span:first-child{
    flex: 4,
}
.tetSystem span:last-child {
    flex: 1,
}
.install h3 {
    margin: 12px 0;
}
.installItem {
    font-size: 15px;
    color: #666666;
}

</style>