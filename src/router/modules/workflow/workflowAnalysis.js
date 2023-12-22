const workflowAnalysis = [{
    name: 'instStatePieReport',
    meta: {
      title: '流程实例状态',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/instStatePieReport',
    component: () => import('@/views/workflow/workflowAnalysis/instStatePieReport')
  },
  {
    name: 'departTaskTotalDistReport',
    meta: {
      title: '部门流程任务状态',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/departTaskTotalDistReport',
    component: () => import('@/views/workflow/workflowAnalysis/departTaskTotalDistReport')
  },
  {
    name: 'personalTaskDistReport',
    meta: {
      title: '个人流程任务状态',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/personalTaskDistReport',
    component: () => import('@/views/workflow/workflowAnalysis/personalTaskDistReport')
  },
  {
    name: 'activityTimeCostReport',
    meta: {
      title: '查询流程节点耗时',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/activityTimeCostReport',
    component: () => import('@/views/workflow/workflowAnalysis/activityTimeCostReport')
  },
  {
    name: 'activityTaskCountReport',
    meta: {
      title: '查询流程任务数量',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/activityTaskCountReport',
    component: () => import('@/views/workflow/workflowAnalysis/activityTaskCountReport')
  },
  {
    name: 'instCountPillReport',
    meta: {
      title: '流程发起实例数',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/instCountPillReport',
    component: () => import('@/views/workflow/workflowAnalysis/instCountPillReport')
  },
  {
    name: 'instStatetPillReport',
    meta: {
      title: '流程实例状态',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/instStatetPillReport',
    component: () => import('@/views/workflow/workflowAnalysis/instStatetPillReport')
  },
  {
    name: 'instDayCountLineReport',
    meta: {
      title: '每日流程实例数',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/instDayCountLineReport',
    component: () => import('@/views/workflow/workflowAnalysis/instDayCountLineReport')
  },
  {
    name: 'instMonthCountLineReport',
    meta: {
      title: '每月流程实例数',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/instMonthCountLineReport',
    component: () => import('@/views/workflow/workflowAnalysis/instMonthCountLineReport')
  },
  {
    name: 'processTaskWarningReport',
    meta: {
      title: '用户任务超时分析',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/processTaskWarningReport',
    component: () => import('@/views/workflow/workflowAnalysis/processTaskWarningReport')
  },
  {
    name: 'participatTaskReport',
    meta: {
      title: '用户参与任务数',
      requireAuth: true
    },
    path: '/workflow/workflowAnalysis/participatTaskReport',
    component: () => import('@/views/workflow/workflowAnalysis/participatTaskReport')
  }
]

export default workflowAnalysis