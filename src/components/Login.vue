<template>
  <div class="login">
    <div class="grid-content tet-content">
        <div class="tet-login">
            <div class="tet-title">Movie</div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" prefix-icon="fa fa-user fa-lg" placeholder="账户"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="fa fa-unlock-alt fa-lg" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('loginForm')" :disabled="disabled" :loading="loading">立即登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    name: 'Login',
    data() {
        return {
			disabled: true,
			loading: false,
			loginForm: {
				username: '',
				password: ''
			},
			loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
			}
        };
	},
	watch: {
		loginForm: {
			handler: function() {
				if ((this.loginForm.username.length > 4) && (this.loginForm.password.length > 5)) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			},
			deep: true
		}
	},
    mounted() {
		let that = this;
        if (that.$getCookie('key')) {
            this.$router.push('main');
        }
    },
    methods: {
		onSubmit: function(loginForm) {
			let that = this;
			that.loading = true;
			
			that.$refs[loginForm].validate((valid)=>{
				if (valid) {
					that.$axios.post('/api/login/login', that.$qs.stringify(that.loginForm), {})
					.then(function(res) {
						console.log(res, '/api/login/login');
						if (res.data.status) {
							that.$toast(that, 'success', res.data.message);
							that.$setCookie('key', res.data.key, 1800);
							setTimeout(function() {
								that.$router.push('main');
							}.bind(this), 600);
						} else {
							that.$toast(that, 'error', res.data.message);
							that.loading = false;
						}
					})
					.catch(function(err) {
						that.$toast(that, 'error', '网络错误～');
						that.loading = false;
					})
				} else {
					return false;
				}
			})
		}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login {
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