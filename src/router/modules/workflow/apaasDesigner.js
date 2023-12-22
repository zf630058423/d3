const apaasDesigner = [{
    name: 'solution_formModeDesigner',
    meta: {
      title: '数据建模'
    },
    path: '/workflow/smartForm/form/solution_formModeDesigner',
    component: () => import('@/views/workflow/smartForm/form/formModeDesigner')
  },
  {
    name: 'solution_onlineFormDesigner',
    meta: {
      title: '表单设计'
    },
    path: '/workflow/smartForm/solution_onlineFormDesigner',
    component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')
  },
  {
    name: 'solution_processDefListByWorkflowKey',
    meta: {
      title: '流程设计'
    },
    path: '/workflow/processDef/solution_processDefListByWorkflowKey',
    component: () => import('@/views/workflow/processDef/processDefListByWorkflowKey')
  },
  {
    path: '/workflow/security/customDataGrid/solution_customDataGridList',
    name: 'solution_customDataGridList',
    meta: {
      title: '自定义列表设计'
    },
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
  },
  {
    name: 'solutionConfig',
    meta: {
      title: '方案设置'
    },
    path: '/workflow/security/solution/solutionConfig',
    component: () => import('@/views/workflow/security/solution/solutionConfig')
  }
]
export default apaasDesigner