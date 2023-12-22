const weihu = [{
    name: 'busObjectList',
    meta: {
      title: '业务对象',
      requireAuth: true
    },
    path: '/workflow/smartForm/form/busObjectList',
    component: () => import('@/views/workflow/smartForm/form/busObjectList')
  },
  {
    name: 'processDesignerConfigurationQuery',
    path: '/workflow/processDef/processDesignerConfigurationQuery',
    meta: {
      title: '流程配置查询',
      requireAuth: true
    },
    component: () => import('@/views/workflow/processDef/processDesignerConfigurationQuery')
  }
]
export default weihu