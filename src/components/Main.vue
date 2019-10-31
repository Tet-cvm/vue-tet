<template>
    <div class="main">
        <el-container>
            <el-aside>
                <Aside :isCollapse="isCollapse"/>
            </el-aside>
            <el-container>
                <el-header>
                    <Header :isCollapse="isCollapse" :onCollapse="onCollapse" :onQuit="onQuit"/>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
export default {
    name: 'Main',
    data() {
        return {
            isCollapse: false
        };
    },
    components: {
        Aside,
        Header,
    },
    mounted() {
        let that = this;
        if (that.$getCookie('key') == '') {
            that.$router.push('/');
        } else {
            // 刷新页面处理
            let data = {
                key: that.$getCookie('key')
            }
            that.$axios.post('/api/login/cookie', that.$qs.stringify(data), {})
            .then(function(res){
                console.log(res, '/api/login/cookie');
                if (res.data.status) {
                    that.$setCookie('key', that.$getCookie('key'), 1800);
                    that.$store.commit('set_user_icon', res.data.data.icon);
                    that.$store.commit('set_user_name', res.data.data.name);
                } else {
                    that.$delCookie('key');
                    that.$router.push('/');
                }
            })
			.catch(function(err) {
				that.$toast(that, 'error', '网络错误～');
				that.loading = false;
			})
        }

        // 实时刷新cookie
        document.addEventListener("mousemove", function() {
            if (that.$getCookie('key') != '') {
                that.$setCookie('key', that.$getCookie('key'), 1800);
            }
        })
    },
    methods: {
        onCollapse: function(status) {
            this.isCollapse = !status;
        },
        onQuit: function() {
            this.$delCookie('key');
            this.$router.push('/');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main {
    width: 100%;
    height: 100vh;
}
.main .el-container {
    height: 100vh;
}
.main .el-aside {
    width: auto !important;
    height: 100vh;
    background-color: rgb(84, 92, 100);
}
.main .el-header {
    padding: 0 46px 0 0;
    background-color: rgba(255, 255, 255);
}
.main .el-main {
    background-color: #E9EEF3;
}
</style>