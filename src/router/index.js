import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: home }
  ]
})

//挂载路由导航守卫

router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  //from表示从那个路径跳转而来
  //next()表示放行 next('/login')强制跳转
  if(to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('ss')
  if(!tokenStr) return next('/login');
  next() 
})

export default router
