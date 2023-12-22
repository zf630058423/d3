const smartFormBlock = [{
    name: 'tableDefinitionList',
    meta: {
      title: '数据库表',
      requireAuth: true,
      keepAlive: true
    },
    path: '/workflow/smartForm/table/tableDefinitionList',
    component: () => import('@/views/workflow/smartForm/table/tableDefinitionList')
  }, {
    path: '/workflow/processDef/access_processFormList',
    name: 'access_processFormList',
    meta: {
      title: '表单应用'
    },
    component: () => import('@/views/workflow/processDef/processFormList')
  }, {
    name: 'formDefList',
    meta: {
      title: '数据建模',
      requireAuth: true,
      keepAlive: true
    },
    path: '/workflow/smartForm/formDefList',
    component: () => import('@/views/workflow/smartForm/form/formDefList')
  }, {
    name: 'generalFieldList',
    meta: {
      title: '标准字段库',
      requireAuth: true,
      keepAlive: true
    },
    path: '/workflow/security/generalField/generalFieldList',
    component: () => import('@/views/workflow/security/generalField/generalFieldList')
  }
]
export default smartFormBlock