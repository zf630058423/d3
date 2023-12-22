const jinchengjieru =  [{
    name: 'userOrgList',
    meta: {
      title: '接入的用户组织',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/userOrgList',
    component: () => import('@/views/workflow/security/orgImpl/userOrgList')
  },
  {
    name: 'roleList_',
    meta: {
      title: '接入的角色查询',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/roleList',
    component: () => import('@/views/workflow/security/orgImpl/roleList')
  },
  {
    name: 'postJobList_',
    meta: {
      title: '接入的职务查询',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/implPostJobList',
    component: () => import('@/views/workflow/security/orgImpl/implPostJobList')
  },
  {
    name: 'positionList_',
    meta: {
      title: '接入的岗位查询',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/implPositionList',
    component: () => import('@/views/workflow/security/orgImpl/implPositionList')
  },
  {
    name: 'userRoleList',
    meta: {
      title: '接入的用户角色',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/userRoleList',
    component: () => import('@/views/workflow/security/orgImpl/userRoleList')
  },
  {
    name: 'roleInResourceList_',
    meta: {
      title: '接入角色的菜单',
      requireAuth: true
    },
    path: '/workflow/security/orgImpl/roleInResourceList',
    component: () => import('@/views/workflow/security/orgImpl/roleInResourceList')
  },
  {
    name: 'dataMigrateList',
    meta: {
      title: '从已有数据发起',
      requireAuth: true
    },
    path: '/workflow/security/dataMigrate/dataMigrateList',
    component: () => import('@/views/workflow/security/dataMigrate/dataMigrateList')
  },
  {
    name: 'organizationConfigList',
    meta: {
      title: '组织架构接入',
      requireAuth: true
    },
    path: '/workflow/security/adaptConfig/organizationConfigList',
    component: () => import('@/views/workflow/security/adaptConfig/organizationConfigList')
  },
  {
    name: 'clusterWebsiteList',
    meta: {
      title: '集群站点管理',
      requireAuth: true
    },
    path: '/workflow/security/clusterWebsite/clusterWebsiteList',
    component: () => import('@/views/workflow/security/clusterWebsite/clusterWebsiteList')
  },
  {
    name: 'appSystemConfigList',
    meta: {
      title: '鉴权验证管理',
      requireAuth: true
    },
    path: '/workflow/security/appSystemConfig/appSystemConfigList',
    component: () => import('@/views//workflow/security/appSystemConfig/appSystemConfigList')
  }
]

export default jinchengjieru