import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 倒入全局样式表
import './assets/css/global.css'
//导入vue-table-with-tree-grid插件 （使用非elementui 组件）
import TreeTable from 'vue-table-with-tree-grid'
//导入VueQuillEditor插件（elementui 组件）
import VueQuillEditor from 'vue-quill-editor'
//导入VueQuillEditor插件的相关样式
import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 

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
//讲VueQuillEditor注册为全局可用的组件
Vue.use(VueQuillEditor)

// 注册一个格式化事件的全局过滤器
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss  = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
