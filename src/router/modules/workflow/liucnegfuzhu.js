const liucnegfuzhu = [{
    name: 'categoryList',
    meta: {
      title: '类别管理',
      requireAuth: true
    },
    path: '/workflow/security/category/categoryList',
    component: () => import('@/views/workflow/security/category/categoryList')
  },
  {
    name: 'userRelationList',
    meta: {
      title: '直线领导',
      requireAuth: true
    },
    path: '/workflow/security/userRelation/userRelationList',
    component: () => import('@/views/workflow/security/userRelation/userRelationList')
  },
  {
    name: 'departAssignLeaderList',
    meta: {
      title: '部门分管领导',
      requireAuth: true
    },
    path: '/workflow/security/departAssignLeader/departAssignLeaderList',
    component: () => import('@/views/workflow/security/departAssignLeader/departAssignLeaderList')
  },
  {
    name: 'relationList',
    meta: {
      title: '汇报树',
      requireAuth: true
    },
    path: '/workflow/security/relation/relationList',
    component: () => import('@/views/workflow/security/relation/relationList')
  },
  {
    name: 'relationTypeList',
    meta: {
      title: '关系标签类型',
      requireAuth: true
    },
    path: '/workflow/security/relation/relationTypeList',
    component: () => import('@/views/workflow/security/relation/relationTypeList')
  },
  {
    name: 'customDialogList',
    meta: {
      title: '自定义对话框',
      requireAuth: true
    },
    path: '/workflow/customDialog/customDialogList',
    component: () => import('@/views/workflow/customDialog/customDialogList')
  },
  {
    name: 'selectorDailogList',
    meta: {
      title: '自定义选择器',
      requireAuth: true
    },
    path: '/workflow/selectorDailog/selectorDailogList',
    component: () => import('@/views/workflow/selectorDailog/selectorDailogList')
  },
  {
    name: 'systemSelectorDailogList',
    meta: {
      title: '自定义选择器',
      requireAuth: true
    },
    path: '/workflow/selectorDailog/systemSelectorDailogList',
    component: () => import('@/views/workflow/selectorDailog/systemSelectorDailogList')
  },
  {
    path: '/workflow/security/dataService/dataServiceList',
    name: 'dataServiceList',
    meta: {
      title: '数据服务',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/dataService/dataServiceList')
  },
  {
    path: '/workflow/security/dataBaseSource/dataBaseSourceList',
    name: 'dataBaseSourceList',
    meta: {
      title: 'DB数据源配置',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/dataBaseSource/dataBaseSourceList')
  },
  {
    path: '/workflow/pageRoute/holidayCalendar',
    name: 'holidayCalendar',
    meta: {
      title: '公共假期设置',
      requireAuth: true
    },
    component: () => import('@/views/workflow/holiday/holidayCalendar')
  },
  {
    path: '/workflow/pageRoute/workTimeSetting',
    name: '工作时制设置',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/holiday/workTimeSetting')
  },
  {
    path: '/workflow/security/taskJob/taskJobList',
    name: '定时器管理',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/taskJob/taskJobList')
  },
  {
    path: '/workflow/security/report/reportList',
    name: '图表设计',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/report/reportList')
  },

  {
    name: 'appPortalList',
    meta: {
      title: '门户管理',
      requireAuth: true
    },
    path: '/workflow/frame/appPortal/appPortalList',
    component: () => import('@/views/workflow/frame/appPortal/appPortalList')
  },
  {
    name: 'appFenceList',
    meta: {
      title: '栏目管理'
    },
    path: '/workflow/frame/appFence/appFenceList',
    component: () => import('@/views/workflow/frame/appFence/appFenceList')
  },
  {
    path: '/workflow/security/customDataGrid/customDataGridAllList',
    name: '自定义列表2',
    meta: {
      title: ''
    },
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
  },
  {
    path: '/workflow/processVar/processVarList',
    name: '流程变量',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/processVar/processVarList')
  },
  {
    path: '/workflow/processVarInst/processVarInstList',
    name: '流程变量实例',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/processVarInst/processVarInstList')
  },
  {
    path: '/workflow/security/serialNum/serialNumList',
    name: '流水号管理',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@/views/workflow/security/serialNum/serialNumList')
  },
  {
    name: 'integrationList',
    meta: {
      title: '集成企业微信第三方配置',
      requireAuth: true
    },
    path: '/workflow/security/integration/integrationList',
    component: () => import('@/views/workflow/security/integration/integrationList')
  }
]

export default liucnegfuzhu