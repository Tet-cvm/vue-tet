import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import Qs from 'qs';
import {toast} from '@/assets/js/common.js';
import {setCookie, getCookie, delCookie} from '@/assets/js/cookie.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import '@/assets/css/flex.css'
import '@/assets/css/common.css'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = true
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = Qs;
Vue.prototype.$toast = toast;

Vue.prototype.$setCookie = setCookie;
Vue.prototype.$getCookie = getCookie;
Vue.prototype.$delCookie = delCookie;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
