import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users_list from '../components/users_list.vue'
import roles_list from '../components/roles_list.vue'
import rights_list from '../components/rights_list.vue'
import goods_list from '../components/goods_list.vue'
import class_params from '../components/class_params.vue'
import goods_class from '../components/goods_class.vue'
import orders_list from '../components/orders_list.vue'
import data_table from '../components/data_table.vue'
import add from '../components/add.vue'

Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: home, redirect: '/welcome', children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users_list },
      { path: '/roles', component: roles_list },
      { path: '/rights', component: rights_list },
      { path: '/goods', component: goods_list },
      { path: '/params', component: class_params },
      { path: '/categories', component: goods_class },
      { path: '/orders', component: orders_list },
      { path: '/reports', component: data_table },
      { path: '/goods/add', component: add}
    ] },
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
