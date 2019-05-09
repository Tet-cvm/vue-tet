import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn.vue'
import Main from '@/components/Main.vue'
import Home from '@/components/Home.vue'
import Group from '@/components/Group.vue'
import Project from '@/components/Project.vue'
import Site from '@/components/Site.vue'
import Version from '@/components/Version.vue'
import Online from '@/components/Online.vue'
import Setting from '@/components/Setting.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'signin',
      component: SignIn
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
          path: '/project',
          name: 'project',
          component: Project
        },
        {
          path: '/group',
          name: 'group',
          component: Group
        },
        {
          path: '/site',
          name: 'site',
          component: Site
        },
        {
          path: '/version',
          name: 'version',
          component: Version
        },
        {
          path: '/online',
          name: 'online',
          component: Online
        },
        {
          path: '/setting',
          name: 'setting',
          component: Setting
        }
      ]
    }
  ]
})
