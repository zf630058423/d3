const views = [{
  path: '/constructInfoView',
  name: 'ConstructInfoView',
  meta: {
    title: '项目信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/constructInfoView.vue')
}, {
  path: '/marketInfoView',
  name: 'MarketInfoView',
  meta: {
    title: '营销项目信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/marketInfoView.vue')
}, {
  path: '/marketManagerInfoView',
  name: 'MarketManagerInfoView',
  meta: {
    title: '项目经理信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/marketManagerInfoView.vue')
}, {
  path: '/supplierInfoView',
  name: 'SupplierInfoView',
  meta: {
    title: '供应商信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/supplierInfoView.vue')
}, {
  path: '/customerInfoView',
  name: 'CustomerInfoView',
  meta: {
    title: '客户信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/customerInfoView.vue')
}, {
  path: '/laborInfoView',
  name: 'LaborInfoView',
  meta: {
    title: '班组信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/laborInfoView.vue')
}, {
  path: '/orgInfoView',
  name: 'OrgInfoView',
  meta: {
    title: '组织架构',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/orgInfoView.vue')
}, {
  path: '/userInfoView',
  name: 'UserInfoView',
  meta: {
    title: '用户信息',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/userInfoView.vue')
}, {
  path: '/formDateView',
  name: 'FormDateView',
  meta: {
    title: '表单详情',
    requireAuth: true
  },
  component: () => import('@/views/businessModule/details/formDateView.vue')
}]

export default views;
