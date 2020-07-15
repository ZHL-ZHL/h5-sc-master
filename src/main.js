// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

import router from './router'
// router.beforeEach((to, from, next)=>{
//   alert(to)
//   // alert(localStorage.href)
//   next(vm => {
//     // 通过 `vm` 访问组件实例
//     vm.deleteScan();
//   })
// })
import 'lib-flexible/flexible.js';

import './assets/font/iconfont.css'
import './assets/font2/iconfont.css'
import './assets/font3/iconfont.css'
import './assets/css/style.css'
Vue.config.productionTip = false


import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

import http from './http'
Vue.prototype.$http = http

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import {currency,LV} from './tools'
Vue.filter('cy',currency)
Vue.filter('lv',LV)
Vue.filter('dd', function (tplData) { 
  let dateMM = tplData ? new Date(tplData) : new Date();
  return `${dateMM.getFullYear()}/${dateMM.getMonth() + 1}/${dateMM.getDate()}`;
});

Vue.filter('mDate', function (tData) {
  let dateTT = tData ? new Date(tData) : new Date();
  let hours = dateTT.getHours() < 10 ? '0' : '';
  let min = dateTT.getMinutes() < 10 ? '0' : '';
  return `${hours + dateTT.getHours()}:${min + dateTT.getMinutes()}`;
});

Vue.filter('myDate', function (txData) {
  let dateT = txData ? new Date(txData) : new Date();    
  return `星期${dateT.getDay()}`;
});


// router.beforeEach((to, from, next) => {
//   let id = 0
//   if(from.query.platform_id){
//     next({query:{platform_id:from.query.platform_id}})
//   }else{
//     next()
//   }
// })
/* eslint-disable no-new */
import login from './mixin/login'
Vue.mixin(login)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
