import Vue from 'vue'
import Router from 'vue-router'
/*導入頁面*/
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Admin from '../components/admin.vue'
Vue.use(Router)

/*配置路由*/
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin',
      name: 'Admin',
      component:Admin
    }
  ]
})