<template v-if="complete">
    <div class="online">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide content">
                  <div class="lineTitle">当前站点:【 aaa.com 】dev</div>
                    <div class="line-form">
                      <el-form>
                        <el-row :gutter="20">
                          <el-col :span="6">
                            <el-form-item label="项目选择: " prop="site">
                              <el-select v-model="site" @change="onSelect()" size="medium">
                                <el-option
                                    v-for="item in siteData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.label }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 14px">{{ item.status ? '已完成配置('+ item.type +')' : '未配置' }}</span>
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="默认分支: " prop="branch">
                                <el-select v-model="branch" size="medium">
                                    <el-option
                                        v-for="item in branchData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="版本选择: " prop="version">
                                <el-select v-model="version" size="medium">
                                    <el-option
                                        v-for="item in versionData"
                                        :key="item.value" 
                                        :label="item.label"
                                        :value="item.value">
                                        <span style="float: left">{{ item.label }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 14px">{{ item.author }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-col :span="6">
                              <div class="line-submit">
                                <el-button type="primary" size="mini" @click="onRelease()">release</el-button>
                              </div>
                            </el-col>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                    <div>
                      <Terminal/>
                    </div>
                </div>
                <div class="swiper-slide menu">
                  <el-divider><i class="el-icon-arrow-up"></i></el-divider>
                    <div class="lineItem">
                      <template>
                        <el-table
                          :data="listData"
                          stripe
                          style="width: 100%">
                          <el-table-column
                            prop="time"
                            label="日期"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="developer"
                            label="开发者"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="mark"
                            label="备注">
                          </el-table-column>
                          <el-table-column
                            prop="version"
                            label="版本号">
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                type="danger"
                                @click="onRollBack(scope.$index, scope.row)">rollback</el-button>
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
                              @current-change="onRender">
                              </el-pagination>
                          </div>
                      </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import {onTips} from '@/assets/js/common.js';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import Terminal from '@/components/Terminal.vue'
export default {
    name: 'Online',
    data() {
      return {
        complete: false,
        total: Number,
        listData: [],
        site: '',
        siteData: [],
        branch: '',
        branchData: [
          { value: 1, label: 'aa' },
        ],
        version: 0,
        versionData: []
      }
    },
    components: {
      Terminal
    },
    created() {
      let that = this;
      that.onInstance();
      that.onRender(1);
      
    },
    mounted() {
      let that = this;
      var mySwiper = new Swiper('.swiper-container', {
          direction : 'vertical',
          slidesPerView: 'auto',
          initialSlide: 0,
          resistanceRatio: 0,
          slideToClickedSlide: true
      });
    },
    methods: {
      onRender: function(page) {
        let that = this;
        let data = {
          'page': page
        }
        axios.post('/api/render', Qs.stringify(data), {})
        .then(function(res) {
          console.log(res);
          if (res.data.status) {
            that.listData = res.data.data.list;
            that.total = res.data.data.page;
          } else {
            onTips(that, 'error', res.data.info);
          }
          that.complete = true;
        })
        .catch(function(err) {
          onTips(that, 'error', '网络错误～');
        })
      },
      onInstance: function() {
        let that = this;
        axios.post('/api/instance', {}, {})
        .then(function(res) {
          if (res.data.status) {
            let resData = res.data.data.site;
            let verData = res.data.data.version;
            let braData = res.data.data.branch;

            let site = '';
            let siteData = [];
            for (let i=0; i<resData.length; i++) {
              if (resData[i].active) {
                site = resData[i].id;
              }
              let data = {value: resData[i].id, label: resData[i].domain, status: resData[i].status, type: resData[i].type == 2 ? 'svn' : 'git'};
              siteData.unshift(data);
            }
            that.siteData = siteData;
            that.site = site;

            // let version = '';
            let versionData = [];

            for (let i=0; i<verData.length; i++) {
              let data = {value: i, author: verData[i].author, label: verData[i].version}
              versionData.push(data) 
            }
            that.versionData = versionData;

            // let branch = '';
            let branchData = [];

            for (let i=0; i<braData.length; i++) {
              let data = {value: i, label: braData[i]}
              branchData.push(data)
            }
            that.branchData = branchData;
            that.branch = res.data.data.init;

          } else {
            onTips(that, 'error', res.data.info);
          }
        })
        .catch(function(err) {
          onTips(that, 'error', '网络错误～');
        })
      },
      onRelease: function() {
        let that = this;
        axios.post('/api/submit', {}, {})
        .then(function(res) {
          if (res.data.status) {
            console.log('success')
          } else {
            onTips(that, 'error', res.data.info);
          }
        })
        .catch(function(err) {
          onTips(that, 'error', '网络错误～');
        })
      },
      onRollBack: function(index, row) {
        console.log(index, row);
        let that = this;
        axios.post('/api/rollback', {}, {})
        .then(function(res) {
          console.log(res, 'rollback')
          if (res.data.status) {
            console.log('aaa')
          } else {
            onTips(that, 'error', res.data.info);
          }
        })
        .catch(function(err) {
          onTips(that, 'error', '网络错误～');
        })
      },
      onSelect: function() {
        console.log(this.site);
      }
    }
}
</script>

<style scoped lang="less">
.online {
    height: 100vh;
}
.lineTitle {
  padding: 12px 22px;
  font-size: 16px;
  color: #4d4d4d;
}
.content {
    width: 100%;
    height: 82vh;
}
.menu {
    width: 100%;
    height: 82vh;
    color: #fff;
}
.swiper-container {
    width: 100%;
    height: 100%;
}
.menu i {
    font-size: 36px;
    color: #babcc2;
}
.swiper-slide {
    // text-align: center;
    // font-size: 18px;
    // background: #fff;

    // /* Center slide text vertically */
    // display: -webkit-box;
    // display: -ms-flexbox;
    // display: -webkit-flex;
    // display: flex;
    // flex-direction: column;
    // -webkit-box-pack: center;
    // -ms-flex-pack: center;
    // -webkit-justify-content: center;
    // justify-content: center;
    // -webkit-box-align: center;
    // -ms-flex-align: center;
    // -webkit-align-items: flex-start;
    // align-items: flex-start;
}
.onLinePage {
    margin: 26px 12px 0 0;
    text-align: right;
}
.lineItem {
  margin: 0 auto;
  width: 94%;
}
.line-form {
  padding: 22px;
}
.line-submit {
  margin: 44px 0 0 0;
}
</style>