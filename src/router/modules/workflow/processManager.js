const processManage = [{
    name: 'processFormList',
    meta: {
      title: '表单设计',
      requireAuth: true
    },
    path: '/workflow/processDef/processFormList',
    component: () => import('@/views/workflow/processDef/processFormList')
  },
  {
    name: 'processDefList',
    meta: {
      title: '流程定义',
      requireAuth: true
    },
    path: '/workflow/processDef/processDefList',
    component: () => import('@/views/workflow/processDef/processDefList')
  },

  {
    name: 'processAppList',
    meta: {
      title: '流程应用',
      requireAuth: true
    },
    path: '/workflow/processDef/processAppList',
    component: () => import('@/views/workflow/processDef/processAppList')
  },
  {
    name: 'solutionList',
    meta: {
      title: '方案列表'
    },
    path: '/workflow/security/solution/solutionList',
    component: () => import('@/views/workflow/security/solution/solutionList')
  },
  {
    name: 'authorizeDefList',
    meta: {
      title: '分管授权',
      requireAuth: true
    },
    path: '/workflow/security/authorize/authorizeDefList',
    component: () => import('@/views/workflow/security/authorize/authorizeDefList')
  }
]
export default processManage