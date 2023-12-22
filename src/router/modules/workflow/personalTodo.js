const personalTodo = [{
    path: '/workflow/workflowBusiness/todoList',
    name: 'todoList',
    meta: {
      title: '待办事项',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/todoList')
  },
  {
    path: '/workflow/workflowBusiness/doneList',
    name: 'doneList',
    meta: {
      title: '已办事项',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/doneList')
  },
  {
    path: '/workflow/workflowBusiness/doneDetailList',
    name: 'doneDetailList',
    meta: {
      title: '已办历史'
    },
    component: () => import('@/views/workflow/workflowBusiness/doneDetailList')
  },
  {
    path: '/workflow/workflowBusiness/doneHandoverList',
    name: 'doneHandoverList',
    meta: {
      title: '交来已办',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/doneHandoverList')
  },
  {
    path: '/workflow/workflowBusiness/myWorkItem',
    name: 'myWorkItem',
    meta: {
      title: '我的发起的',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/myWorkItem')
  },
  {
    path: '/workflow/workflowBusiness/todoCirculatedList',
    name: 'todoCirculatedList',
    meta: {
      title: '待阅事项',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/todoCirculatedList')
  },
  {
    path: '/workflow/workflowBusiness/doneCirculatedList',
    name: 'doneCirculatedList',
    meta: {
      title: '已阅事项',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/doneCirculatedList')
  },
  {
    path: '/workflow/workflowBusiness/myCirculatedList',
    name: 'myCirculatedList',
    meta: {
      title: '我的传阅',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/myCirculatedList')
  },
  {
    path: '/workflow/delegates/appDelegateList',
    name: 'appDelegateList',
    meta: {
      title: '流程委托',
      requireAuth: true
    },
    component: () => import('@/views/workflow/delegates/appDelegateList')
  },
  {
    path: '/workflow/workflowBusiness/draftList',
    name: 'draftList',
    meta: {
      title: '草稿箱',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/draftList')
  },
  {
    path: '/workflow/workflowBusiness/myCancelList',
    name: 'myCancelList',
    meta: {
      title: '已作废箱',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/myCancelList')
  },

  {
    path: '/workflow/pageRoute/opinionList',
    name: 'opinionList',
    meta: {
      title: '常用意见',
      requireAuth: true
    },
    component: () => import('@/views/workflow/opinion/opinionList')
  },
  {
    path: '/workflow/workflowBusiness/startWorkflowList',
    name: 'startWorkflowList',
    meta: {
      title: '发起流程',
      requireAuth: true
    },
    component: () => import('@/views/workflow/workflowBusiness/startWorkflowList')
  },
  {
    path: '/workflow/notification/personMessageCenter',
    meta: {
      title: '个人消息'
    },
    name: 'personMessageCenter',
    component: () => import('@/views/workflow/notification/personMessageCenter')
  },
  {
    name: 'appPortalView',
    meta: {
      requireAuth: true
    },
    path: '/workflow/frame/appPortal/appPortalView',
    component: () => import('@/views/workflow/frame/appPortal/appPortalView')
  }
]
export default personalTodo;