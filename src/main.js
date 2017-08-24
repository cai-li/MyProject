import Vue from 'vue';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
//引入主组件
import App from './App';
//引入路由组件
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'
import './common/css/reset.css';  
import './common/stylus/index.styl';  

//设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;
//引入模块
Vue.use(VueRouter);
Vue.use(vueResource);
Vue.use(ElementUI);
//定义路由
const routes = [
 //也可以是一个命名的路由 redirect:{name:'goods'}
  { path:'/',redirect:'/goods'},
  { path: '/goods', component: goods,name:'goods' },
  { path: '/ratings', component: ratings,name:'ratings' },
  { path: '/seller', component: seller,name:'seller' }
];
//创建路由实例
const router = new VueRouter({
  // ES6缩写语法，相当于routes:routes
  routes  
});
//结合路由命名，设置导航钩子函数
router.afterEach((to,from,next)=>{
    document.title = to.name;
})
//创建vue实例并挂载
const app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
//导航式编程  
//router.push('/goods');
