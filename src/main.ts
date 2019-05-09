import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import '@/assets/css/flex.css'
import '@/assets/css/common.css'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import './registerServiceWorker'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(codemirror)

Vue.config.productionTip = true
Vue.use(VueResource);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
