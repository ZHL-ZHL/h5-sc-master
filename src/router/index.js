import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: resolve => require(['@/views/Main'], resolve)
    },
    {
      path: '/test/:id/:mid',
      name: 'test',
      props: true,
      component: resolve => require(['@/views/Test'], resolve)
    },
    {
      path: '/detail/:id/:mid?',
      name: 'detail',
      props: true,
      component: resolve => require(['@/views/Detail'], resolve)
    },
    {
      path: '/buyVIP',
      name: 'buyVIP',
      component: resolve => require(['@/views/BuyVIP'], resolve)
    },
    {
      path: '/testResult/:status',
      name: 'testResult',
      props: true,
      component: resolve => require(['@/views/TestResult'], resolve)
    },
    {
      path: '/cate',
      name: 'cate',
      component: resolve => require(['@/views/Cate'], resolve)
    },
    {
      path: '/tips/:id?/:mid?',
      name: 'tips',
      props:true,
      component: resolve => require(['@/views/Tips'], resolve)
    },
    {
      path: '/share/:id/:mid',
      name: 'share',
      props:true,
      component: resolve => require(['@/views/Share'], resolve)
    },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: resolve => require(['@/views/Home'], resolve)
    // },
    // {
    //   path: '/detail',
    //   name: 'detail',
    //   component: resolve => require(['@/views/Main-detail'], resolve)
    // },
    {
      path: '/my',
      name: 'my',
      component: resolve => require(['@/views/My'], resolve)
    },
    {
      path: '/my2',
      name: 'my2',
      component: resolve => require(['@/views/My2'], resolve)
    },
    // {
    //   path: '/question',
    //   name: 'question',
    //   component: resolve => require(['@/views/Question'], resolve)
    // },
    // {
    //   path: '/message',
    //   name: 'message',
    //   component: resolve => require(['@/views/Message'], resolve)
    // },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/Login'], resolve)
    },
    {
      path: '/wlogin',
      name: 'wlogin',
      component: resolve => require(['@/views/Wlogin'], resolve)
    },
    {
      path: '/bindPhone/:openid',
      name: 'bindPhone',
      props: true,
      component: resolve => require(['@/views/BindPhone'], resolve)
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: resolve => require(['@/views/Register'], resolve)
    // },
    // {
    //   path: '/history',
    //   name: 'history',
    //   component: resolve => require(['@/views/History'], resolve)
    // },
  ],
  linkActiveClass: 'on',
})


