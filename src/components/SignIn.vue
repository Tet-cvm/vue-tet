<template>
  <div class="signin">
    <div class="grid-content tet-content">
        <div class="tet-login">
            <!-- <div class="tet-title">特图部署系统</div> -->
            <el-form ref="form">
                <el-form-item>
                    <el-input v-model="username" type="text" prefix-icon="fa fa-user fa-lg" placeholder="账户"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="password" type="password" prefix-icon="fa fa-unlock-alt fa-lg" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :disabled="disabled" :loading="loading">立即登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Qs from 'qs';
import {onTips} from '@/assets/js/common.js';
import {setCookie, getCookie} from '@/assets/js/cookie.js'
export default {
    name: 'SignIn',
    data() {
        return {
			username: '',
			password: '',
			status: [false, false],
			disabled: true,
			loading: false
        };
	},
	watch: {
		username: {
			handler: function() {
				this.username.length > 2 ? (this.status[0] = true) : (this.status[0] = false);
				this.onStatus();
			},
			deep: true
		},
		password: {
			handler: function() {
				this.password.length > 5 ? (this.status[1] = true) : (this.status[1] = false);
				this.onStatus();
			},
			deep: true
		}
	},
    mounted() {
        if (getCookie('username')) {
            this.$router.push('main');
        }
    },
    methods: {
		onStatus: function() {
			if (this.status[0] && this.status[1]) {
				this.disabled = false;
			} else {
				this.disabled = true;
			}
		},
		onSubmit: function() {
			let that = this;
            that.loading = true;

            let data = {
                username: that.username,
                password: that.password
            };

			axios.post('/api/signin', Qs.stringify(data), {})
			.then(function(res) {
                console.log(res);
				if (res.data.status) {
                    onTips(that, 'success', res.data.info);
                    setCookie('username', that.username, 1000*60);
                    setTimeout(function() {
                        that.$router.push('main');
                    }.bind(this), 700);
				} else {
					onTips(that, 'error', res.data.info);
					that.loading = false;
				}
			})
			.catch(function(err) {
				onTips(that, 'error', '网络错误～');
				that.loading = false;
			})
		},
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.signin {
    background-color: #545c64;
}
.tet-content {
	height: 100vh;
}
.tet-login {
	position: absolute;
	padding: 2% 3% 1% 3%;
	top: 50%;
	left: 50%;
	width: 28%;
	border-radius: 4px;
	-webkit-box-shadow:0 0 8px 0 rgba(0,0,0,.15);  
	-moz-box-shadow:0 0 8px 0 rgba(0,0,0,.15);  
	box-shadow:0 0 8px 0 rgba(0,0,0,.15);  
	background-color: #fff;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}
.tet-title {
	padding:0 0 32px 0;
	font-size: 20px;
	color: #666666;
	text-align: center;
}
.el-icon-search:before {
	content: '';
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
    background: url('../assets/image/user.png') no-repeat;
	background-position: center center;
	background-size: 78% 46%;
	opacity: 0.88;
}
.el-icon-setting:before {
	content: '';
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
    background: url('../assets/image/password.png') no-repeat;
	background-position: center center;
	background-size: 78% 46%;
	opacity: 0.68;
}
.el-button--primary {
	width: 100%;
}
</style>