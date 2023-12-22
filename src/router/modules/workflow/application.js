const application = [{
    name: 'applicationList',
    meta: {
      title: '应用管理',
      requireAuth: true
    },
    path: '/workflow/security/application/applicationList',
    component: () => import('@/views/workflow/security/application/applicationList')
  },
  {
    name: 'applicationHome',
    meta: {
      title: '应用'
    },
    path: '/workflow/security/application/applicationHome',
    component: () => import('@/views/workflow/security/application/applicationHome')
  }
]

export default application