import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
/* 路由模块 */
import modules from "./modules";
/* 系统主框架 */
import Layout from '@/layout';
export const constantRoutes = [
  // =============全开发 demo页面 =======================//

  {
    path: '/demo',
    component: Layout,
    redirect: '/demo',
    children: [
      {
        path: '/demo/list',
        name: 'list',
        component: () => import('@/views/fullDevelopment/demo/list.vue'),
        meta: { title: 'demo页面', requireAuth: true }
      },
      {
        path: '/add',
        name: 'add',
        component: () => import('@/views/fullDevelopment/demo/add.vue'),
        meta: { title: 'add', requireAuth: true }
      },
    ]
  },
  // testList测试
  {
    path: '/test',
    name: 'test',
    meta: {
      title: 'test',
      requireAuth: true
    },
    component: () => import('@/views/testVue/test.vue')
  },
  {
    path: '/testList',
    name: 'testList',
    meta: {
      title: 'testList',
      requireAuth: true
    },
    component: () => import('@/views/testVue/testList.vue')
  },
  {
    path: '/tableDemo',
    name: 'tableDemo',
    meta: {
      title: 'tableDemo',
      requireAuth: true
    },
    component: () => import('@/views/testVue/tableDemo.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/localstorage',
    component: () => import('@/views/login/localstorage'),
    hidden: true
  },
  {
    path: '/denied',
    meta: {
      title: '没有访问权限'
    },
    component: () => import('@/views/denied'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 新首页
  {
    path: '/',
    component: Layout,
    redirect: '/homeNew',
    children: [{
      path: 'homeNew',
      name: 'dashboard',
      component: () => import('@/views/homeNew/workSpace/index'),
      meta: {
        title: '工作台',
        icon: 'icon icon-integral'
      }
    },
    {
      path: '/home/announceDetail',
      name: 'announceDetail',
      component: () => import('@/views/homeNew/workSpace/announceDetail'),
      meta: {
        title: '公告详情',
        icon: 'dashboard'
      }
    }
    ]
  },
  {
    path: '/projectHall',
    component: Layout,
    redirect: '/home/projectHall',
    children: [{
      path: '/home/projectHall',
      name: 'projectHall',
      component: () => import('@/views/homeNew/projectHall/index'),
      meta: {
        title: '项目大厅',
        icon: 'dashboard'
      }
    }]
  }, {
    path: '/newHome',
    component: Layout,
    redirect: '/newHome',
    name: 'newHome',
    children: [{
      path: '/newHome',
      name: 'newHome',
      component: () => import('../views/newHome/index.vue'),
      hidden: true
    }]
  },
  // 流程指引
  {
    path: '/flowGuide',
    component: Layout,
    redirect: '/home/flowGuide',
    children: [{
      path: '/home/flowGuide',
      name: 'flowGuide',
      component: () => import('@/views/flowGuide/index'),
      meta: {
        title: '流程指引',
        icon: 'dashboard'
      }
    }]
  }, {
    path: '/warningHall',
    component: Layout,
    redirect: '/home/warningHall',
    children: [{
      path: '/home/warningHall',
      name: 'warningHall',
      component: () => import('@/views/homeNew/warningHall/index'),
      meta: {
        title: '预警大厅',
        icon: 'dashboard'
      }
    }]
  }, {
    path: '/userInfo',
    component: Layout,
    redirect: '/home/userInfo',
    children: [{
      path: '/home/userInfo',
      name: 'userInfo2',
      component: () => import('@/views/home/userInfo'),
      meta: {
        title: '账号信息',
        icon: 'dashboard'
      }
    }]
  },
  // 404未找到页面时将跳到此页面
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }

];

const createRouter = () => new Router({
  // 以下mode设置为history就是去掉Url中的#号，此时必须设置base为'/'
  mode: 'history', // 去掉mode设置的话vue会默认使用hash模式，该模式下回将路径格式化为 # 开头。
  base: '/', // 路由的根路径，通常是/
  // base: '/f2web/',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [...constantRoutes, ...modules]
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
