const constructArchiveList =[ {
  path: '/constructArchiveMain/list',
  name: 'list',
  component: () => import('@/views/businessModule/noWorkflow/constructArchiveMain/list'),
  meta: { title: '项目档案', requireAuth: true }
},
  {
    path: '/constructArchiveMain/form',
    name: 'form',
    component: () => import('@/views/businessModule/noWorkflow/constructArchiveMain/form'),
    meta: { title: '新增', requireAuth: true }
  }]
export default constructArchiveList;
