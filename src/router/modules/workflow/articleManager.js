const articleManager = [{
    name: 'articleList',
    meta: {
      title: '文章管理',
      requireAuth: true
    },
    path: '/workflow/security/article/articleList/',
    component: () => import('@/views/workflow/security/article/articleOfInfoTypeList')
  },
  {
    name: 'linkOfInfoTypeList',
    meta: {
      title: '链接管理',
      requireAuth: true
    },
    path: '/workflow/security/article/linkList',
    component: () => import('@/views/workflow/security/article/linkOfInfoTypeList')
  },
  {
    name: 'announcementList',
    meta: {
      title: '通知公告',
      requireAuth: true
    },
    path: '/workflow/security/article/announcementList',
    component: () => import('@/views/workflow/security/article/linkOfInfoTypeList')
  }
]

export default articleManager