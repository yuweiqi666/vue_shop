import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 倒入全局样式表
import './assets/css/global.css'
//导入vue-table-with-tree-grid插件 （使用非elementui 组件）
import TreeTable from 'vue-table-with-tree-grid'

//引入字体图标样式
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'
// 将axios挂载到Vue的原型对象上 
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('ss')
  return config
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false
// 手动注册为全局组件 命名为tree-table
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
