const processmonitoring = [{
    name: 'orgProceInstAuthorSearchList',
    meta: {
      title: '部门授权实例查询',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/orgProceInstAuthorSearchList',
    component: () => import('@/views/workflow/workflowMonitor/orgProceInstAuthorSearchList')
  },
  {
    name: 'orgProceInstSearchList',
    meta: {
      title: '部门实例查询',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/orgProceInstSearchList',
    component: () => import('@/views/workflow/workflowMonitor/orgProceInstSearchList')
  },
  {
    name: 'orgCustProceInstSearchList',
    meta: {
      title: '扩展实例查询',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/orgCustProceInstSearchList',
    component: () => import('@/views/workflow/workflowMonitor/orgCustProceInstSearchList')
  },
  {
    name: 'advancedSearchList',
    meta: {
      title: '流程实例查询',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/advancedSearchList',
    component: () => import('@/views/workflow/workflowMonitor/advancedSearchList')
  },
  {
    name: 'todoTaskManageList',
    meta: {
      title: '待办任务管理',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/todoTaskManageList',
    component: () => import('@/views/workflow/workflowMonitor/todoTaskManageList')
  },
  {
    name: 'activationProcessList',
    meta: {
      title: '激活归档实例',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/activationProcessList',
    component: () => import('@/views/workflow/workflowMonitor/activationProcessList')
  },
  {
    name: 'processInstanceManageList',
    meta: {
      title: '流程实例管理',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/processInstanceManageList',
    component: () => import('@/views/workflow/workflowMonitor/processInstanceManageList')
  },
  {
    name: 'freeflowWorkflowInstanceList',
    meta: {
      title: '自定义流管理',
      requireAuth: true
    },
    path: '/workflow/workflowMonitor/freeflowWorkflowInstanceList',
    component: () => import('@/views/workflow/workflowMonitor/freeflowWorkflowInstanceList')
  },
  {
    name: 'logMonitorList',
    meta: {
      title: '流程日志监控',
      requireAuth: true
    },
    path: '/workflow/security/logMonitor/logMonitorList',
    component: () => import('@/views/workflow/security/logMonitor/logMonitorList')
  },
  {
    name: 'logRestAccessList',
    meta: {
      title: 'REST接口日志',
      requireAuth: true
    },
    path: '/workflow/security/logMonitor/logRestAccessList',
    component: () => import('@/views/workflow/security/logMonitor/logRestAccessList')
  },
  {
    name: 'logChangeList',
    meta: {
      title: '流程变更记录',
      requireAuth: true
    },
    path: '/workflow/security/logChange/logChangeList',
    component: () => import('@/views/workflow/security/logChange/logChangeList')
  },
  {
    name: 'taskHandoverList',
    meta: {
      title: '已办交接管理',
      requireAuth: true
    },
    path: '/workflow/taskHandover/taskHandoverList',
    component: () => import('@/views/workflow/taskHandover/taskHandoverList')
  },
  {
    name: 'customDataGridView',
    path: '/workflow/security/customDataGrid/customDataGridView',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
  }
]

export default processmonitoring