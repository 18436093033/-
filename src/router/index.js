import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'
// 用路由懒加载导入
const params=()=>import( '../components/goods/Params')
const goods=()=>import('../components/goods/Goods')

Vue.use(VueRouter)


// const originalPush = VueRouter.prototype.push

// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }


const routes = [
 {path:'/login',component:Login},
 {path:'/',redirect:'/login'},
 {path:'/home',redirect:'/home/welcome', component:Home,children:[
   {path:'welcome',component:Welcome},
   {path:'users',component:Users},
   {path:'rights',component:Rights},
   {path:'roles',component:Roles},
   {path:'categories',component:Cate},
   {path:'params',component:params},
   {path:'goods',component:goods},
   {path:'add',component:Add},
   {path:'orders',component:Order},
   {path:'reports',component:Report}
 ]},

 
]

const router = new VueRouter({
  routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
  //判断是否是登录页，如果是接着下一步
  if (to.path === '/login') return next()
  //    获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //判断token是否存在，
  if (!tokenStr) {
      return next('/login')

  }
  next()
})


export default router
