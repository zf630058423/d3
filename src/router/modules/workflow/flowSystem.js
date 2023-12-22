const flowSystem = [{
    name: 'categoryGroupList',
    meta: {
      title: '类别分组',
      requireAuth: true
    },
    path: '/workflow/security/category/categoryGroupList',
    component: () => import('@/views/workflow/security/category/categoryGroupList')
  },
  {
    name: 'licenseRegisterInfo',
    meta: {
      title: 'License授权注册',
      requireAuth: true
    },
    path: '/workflow/security/register/licenseRegisterInfo',
    component: () => import('@/views/workflow/security/register/licenseRegisterInfo')
  },
  {
    name: 'jvmRuntimeInfo',
    meta: {
      title: '服务器资源情况'
    },
    path: '/workflow/security/register/jvmRuntimeInfo',
    component: () => import('@/views/workflow/security/register/jvmRuntimeInfo')
  },
  {
    name: 'systemStatusList',
    meta: {
      title: '系统状态管理',
      requireAuth: true
    },
    path: '/workflow/security/systemStatus/systemStatusList',
    component: () => import('@/views/workflow/security/systemStatus/systemStatusList')
  }
]

export default flowSystem