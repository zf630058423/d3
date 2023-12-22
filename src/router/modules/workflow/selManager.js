const selManager = [{
    name: 'sealList',
    meta: {
      title: '印章管理',
      requireAuth: true
    },
    path: '/workflow/security/seal/sealList',
    component: () => import('@/views/workflow/security/seal/sealList')
  },
  {
    name: 'sealInstList',
    meta: {
      title: '印章实例',
      requireAuth: true
    },
    path: '/workflow/security/seal/sealInstList',
    component: () => import('@/views/workflow/security/seal/sealInstList')
  }
]
export default selManager