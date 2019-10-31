import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Main from '@/components/Main.vue'
import Home from '@/components/Home.vue'
import Movie from '@/components/Movie.vue'
import Manage from '@/components/Manage.vue'
import Member from '@/components/Member.vue'

Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/main',
            component: Main,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: Home
                },
                {
                    path: '/movie',
                    name: 'movie',
                    component: Movie
                },
                {
                    path: '/manage',
                    name: 'manage',
                    component: Manage
                },
                {
                    path: '/member',
                    name: 'member',
                    component: Member
                }
            ]
        }
    ]
})
